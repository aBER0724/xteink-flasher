'use client';

import * as crypto from 'crypto';

import { ESPLoader, Transport } from 'esptool-js';
import OtaPartition from '@/esp/OtaPartition';

export interface AppPartitionConfig {
  app0Offset: number;
  app0Size: number;
  app1Offset: number;
  app1Size: number;
}

export const STANDARD_PARTITION: AppPartitionConfig = {
  app0Offset: 0x10000,
  app0Size: 0x640000,
  app1Offset: 0x650000,
  app1Size: 0x640000,
};

export const CJK_PARTITION: AppPartitionConfig = {
  app0Offset: 0x10000,
  app0Size: 0x680000,
  app1Offset: 0x690000,
  app1Size: 0x680000,
};

const PARTITION_TYPES: Record<number, Record<number, string>> = {
  // App type
  0x00: {
    0x00: 'app-factory',
    0x10: 'app-ota_0',
    0x11: 'app-ota_1',
    0x12: 'app-ota_2',
    0x13: 'app-ota_3',
    0x20: 'app-test',
  },
  // Data type
  0x01: {
    0x00: 'data-ota',
    0x01: 'data-phy',
    0x02: 'data-nvs',
    0x03: 'data-coredump',
    0x04: 'data-nvs_keys',
    0x05: 'data-efuse',
    0x06: 'data-undefined',
    0x80: 'data-esphttpd',
    0x81: 'data-fat',
    0x82: 'data-spiffs',
    0x83: 'data-littlefs',
  },
  // Bootloader type
  0x02: {
    0x00: 'bootloader-primary',
    0x01: 'bootloader-ota',
  },
  // Partition table type
  0x03: {
    0x00: 'partitiontable-primary',
    0x01: 'partitiontable-ota',
  },
};

// Reverse mapping: type string -> { type, subtype } bytes for partition table generation
const REVERSE_PARTITION_TYPES: Record<
  string,
  { type: number; subtype: number }
> = {};
for (const [typeKey, subtypes] of Object.entries(PARTITION_TYPES)) {
  for (const [subtypeKey, name] of Object.entries(
    subtypes as Record<string, string>,
  )) {
    REVERSE_PARTITION_TYPES[name] = {
      type: parseInt(typeKey, 10),
      subtype: parseInt(subtypeKey, 10),
    };
  }
}

export default class EspController {
  static async requestDevice() {
    if (!('serial' in navigator && navigator.serial)) {
      throw new Error(
        'WebSerial is not supported in this browser. Please use Chrome or Edge.',
      );
    }

    return navigator.serial.requestPort({
      filters: [{ usbVendorId: 12346, usbProductId: 4097 }],
    });
  }

  static async fromRequestedDevice() {
    const device = await this.requestDevice();
    return new EspController(device);
  }

  /**
   * Serialize partition table entries into ESP32 binary format (4KB).
   * Format per entry (32 bytes): magic(2) + type(1) + subtype(1) + offset(4 LE) + size(4 LE) + label(16) + flags(4)
   * Followed by MD5 record: 0xEB 0xEB + 14*0xFF + 16-byte MD5 digest
   */
  static buildPartitionTableBinary(
    table: Array<{ type: string; offset: number; size: number }>,
  ): Uint8Array {
    const PARTITION_TABLE_SIZE = 0x1000; // 4KB
    const ENTRY_SIZE = 32;
    const buffer = new Uint8Array(PARTITION_TABLE_SIZE).fill(0xff);

    const md5 = crypto.createHash('md5');

    for (let i = 0; i < table.length; i++) {
      const entry = table[i]!;
      const entryOffset = i * ENTRY_SIZE;
      const entryBuffer = new Uint8Array(ENTRY_SIZE);

      // Magic bytes
      entryBuffer[0] = 0xaa;
      entryBuffer[1] = 0x50;

      // Type & Subtype
      const typeInfo = REVERSE_PARTITION_TYPES[entry.type];
      if (!typeInfo) {
        throw new Error(`Unknown partition type: ${entry.type}`);
      }
      entryBuffer[2] = typeInfo.type;
      entryBuffer[3] = typeInfo.subtype;

      /* eslint-disable no-bitwise */
      // Offset (little-endian u32)
      entryBuffer[4] = entry.offset & 0xff;
      entryBuffer[5] = (entry.offset >> 8) & 0xff;
      entryBuffer[6] = (entry.offset >> 16) & 0xff;
      entryBuffer[7] = (entry.offset >> 24) & 0xff;

      // Size (little-endian u32)
      entryBuffer[8] = entry.size & 0xff;
      entryBuffer[9] = (entry.size >> 8) & 0xff;
      entryBuffer[10] = (entry.size >> 16) & 0xff;
      entryBuffer[11] = (entry.size >> 24) & 0xff;
      /* eslint-enable no-bitwise */

      // Label (16 bytes, null-padded) - extract from type string after first '-'
      const label = entry.type.split('-').slice(1).join('-');
      const labelBytes = new TextEncoder().encode(label);
      entryBuffer.set(labelBytes.slice(0, 16), 12);
      // Bytes 28-31: flags, all zero (default from Uint8Array init)

      buffer.set(entryBuffer, entryOffset);
      md5.update(Buffer.from(entryBuffer));
    }

    // MD5 checksum record after last entry
    const md5Offset = table.length * ENTRY_SIZE;
    buffer[md5Offset] = 0xeb;
    buffer[md5Offset + 1] = 0xeb;
    // Bytes 2-15 stay 0xFF (already filled)
    const md5Digest = md5.digest();
    buffer.set(new Uint8Array(md5Digest), md5Offset + 16);

    return buffer;
  }

  private espLoader;

  constructor(device: SerialPort) {
    const transport = new Transport(device, false);
    this.espLoader = new ESPLoader({
      transport,
      baudrate: 115200,
      romBaudrate: 115200,
      enableTracing: false,
    });
  }

  async connect() {
    await this.espLoader.main();
  }

  async disconnect({ skipReset = false }: { skipReset?: boolean } = {}) {
    await this.espLoader.after(skipReset ? 'no_reset' : 'hard_reset');
    await this.espLoader.transport.disconnect();
  }

  async readPartitionTable() {
    const partitionData = [];

    const data = await this.espLoader.readFlash(0x8000, 0x2000);
    const md5 = crypto.createHash('md5');
    for (let offset = 0; offset < data.length; offset += 32) {
      const chunk = data.slice(offset, offset + 32);
      if (
        chunk.length !== 32 ||
        Buffer.from(chunk).equals(Buffer.alloc(32, 0xff))
      )
        break;
      if (Buffer.from(chunk.slice(0, 2)).equals(Buffer.from([0xeb, 0xeb]))) {
        if (Buffer.from(chunk.slice(16)).equals(md5.digest())) {
          // eslint-disable-next-line no-continue
          continue;
        } else {
          throw new Error("MD5 checksums don't match!");
        }
      }

      md5.update(Buffer.from(chunk));
      partitionData.push({
        type:
          PARTITION_TYPES[chunk[2] ?? 0x99]?.[chunk[3] ?? 0x99] ?? 'unknown',
        /* eslint-disable no-bitwise */
        offset:
          (chunk[4] ?? 0) +
          ((chunk[5] ?? 0) << 8) +
          ((chunk[6] ?? 0) << 16) +
          ((chunk[7] ?? 0) << 24),
        size:
          (chunk[8] ?? 0) +
          ((chunk[9] ?? 0) << 8) +
          ((chunk[10] ?? 0) << 16) +
          ((chunk[11] ?? 0) << 24),
        /* eslint-enable no-bitwise */
      });
    }
    return partitionData;
  }

  async readFullFlash(
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    return this.espLoader.readFlash(0, 0x1000000, onPacketReceived);
  }

  async writeFullFlash(
    data: Uint8Array,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    if (data.length !== 0x1000000) {
      throw new Error(
        `Data length must be 0x1000000, but got 0x${data.length.toString().padStart(7, '0')}`,
      );
    }

    await this.writeData(data, 0, reportProgress);
  }

  async readOtadataPartition(
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    return new OtaPartition(
      await this.espLoader.readFlash(0xe000, 0x2000, onPacketReceived),
    );
  }

  async writeOtadataPartition(
    partition: OtaPartition,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.writeData(partition.data, 0xe000, reportProgress);
  }

  async writePartitionTable(
    data: Uint8Array,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.writeData(data, 0x8000, reportProgress);
  }

  async readAppPartition(
    partitionLabel: 'app0' | 'app1',
    config: AppPartitionConfig = STANDARD_PARTITION,
    onPacketReceived?: (
      packet: Uint8Array,
      progress: number,
      totalSize: number,
    ) => void,
  ) {
    const offset =
      partitionLabel === 'app0' ? config.app0Offset : config.app1Offset;
    const size =
      partitionLabel === 'app0' ? config.app0Size : config.app1Size;
    return this.espLoader.readFlash(offset, size, onPacketReceived);
  }

  async readAppPartitionForIdentification(
    partitionLabel: 'app0' | 'app1',
    {
      config = STANDARD_PARTITION,
      readSize = 0x6400, // Default to 25KB (0x6400) for fast identification
      offset = 0,
      onPacketReceived,
    }: {
      config?: AppPartitionConfig;
      readSize?: number;
      offset?: number;
      onPacketReceived?: (
        packet: Uint8Array,
        progress: number,
        totalSize: number,
      ) => void;
    } = {},
  ) {
    // Optimized read for firmware identification with flexible read size and offset:
    // - Default (25KB / 0x6400): Fast path, covers 99% of cases
    // - Additional chunks: Specify offset multiples of 25KB until identification succeeds
    // In testing, most firmwares are identified within the first 25KB read, so reading the entire
    // partition is unnecessary in the majority of cases.

    const baseOffset =
      partitionLabel === 'app0' ? config.app0Offset : config.app1Offset;

    return this.espLoader.readFlash(
      baseOffset + offset,
      readSize,
      onPacketReceived,
    );
  }

  async writeAppPartition(
    partitionLabel: 'app0' | 'app1',
    data: Uint8Array,
    config: AppPartitionConfig = STANDARD_PARTITION,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    const maxSize =
      partitionLabel === 'app0' ? config.app0Size : config.app1Size;
    if (data.length > maxSize) {
      throw new Error(
        `Data cannot be larger than 0x${maxSize.toString(16)}`,
      );
    }
    if (data.length < 0xf0000) {
      throw new Error(
        `Data seems too small, are you sure this is the right file?`,
      );
    }

    const offset =
      partitionLabel === 'app0' ? config.app0Offset : config.app1Offset;

    await this.writeData(data, offset, reportProgress);
  }

  private async writeData(
    data: Uint8Array,
    address: number,
    reportProgress?: (
      fileIndex: number,
      written: number,
      total: number,
    ) => void,
  ) {
    await this.espLoader.writeFlash({
      fileArray: [
        {
          data: this.espLoader.ui8ToBstr(data),
          address,
        },
      ],
      flashSize: 'keep',
      flashMode: 'keep',
      flashFreq: 'keep',

      eraseAll: false,
      compress: true,
      reportProgress,
    });
  }
}
