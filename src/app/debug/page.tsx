'use client';

import React, { ReactNode, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  Mark,
  Portal,
  Separator,
  Stack,
  Table,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEspOperations } from '@/esp/useEspOperations';
import Steps from '@/components/Steps';
import { OtaPartitionState } from '@/esp/OtaPartitionState';
import OtaPartition, { OtaPartitionDetails } from '@/esp/OtaPartition';
import HexSpan from '@/components/HexSpan';
import HexViewer from '@/components/HexViewer';
import { downloadData } from '@/utils/download';
import { FirmwareInfo } from '@/utils/firmwareIdentifier';
import { useTranslation } from '@/i18n';

function OtadataDebug({ otaPartition }: { otaPartition: OtaPartition }) {
  const bootPartitionLabel = otaPartition.getCurrentBootPartitionLabel();
  const { t } = useTranslation();

  return (
    <Stack>
      <Heading size="lg">{t('debug.otaData')}</Heading>
      <Stack direction="row">
        {otaPartition.otaAppPartitions().map((partition) => (
          <Card.Root
            variant="subtle"
            size="sm"
            key={partition.partitionLabel}
            colorPalette="red"
          >
            <Card.Header>
              <Heading size="md">
                {t('debug.partition')} {partition.partitionLabel}
              </Heading>
            </Card.Header>
            <Card.Body>
              <Table.Root size="sm">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>{t('debug.bootPartition')}</Table.Cell>
                    <Table.Cell>
                      <Mark
                        colorPalette={
                          partition.partitionLabel === bootPartitionLabel
                            ? 'green'
                            : 'red'
                        }
                        variant="solid"
                        paddingLeft={1}
                        paddingRight={1}
                      >
                        {partition.partitionLabel === bootPartitionLabel
                          ? t('common.yes')
                          : t('common.no')}
                      </Mark>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>{t('debug.otaSequence')}</Table.Cell>
                    <Table.Cell>{partition.sequence}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>{t('debug.otaState')}</Table.Cell>
                    <Table.Cell>
                      <Mark
                        colorPalette={
                          [
                            OtaPartitionState.ABORTED,
                            OtaPartitionState.INVALID,
                          ].includes(partition.state)
                            ? 'red'
                            : 'green'
                        }
                        variant="solid"
                        paddingLeft={1}
                        paddingRight={1}
                      >
                        {partition.state}
                      </Mark>{' '}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>{t('debug.crc32Bytes')}</Table.Cell>
                    <Table.Cell>
                      <HexSpan data={partition.crcBytes} />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>{t('debug.crc32Valid')}</Table.Cell>
                    <Table.Cell>
                      <Mark
                        colorPalette={partition.crcValid ? 'green' : 'red'}
                        variant="solid"
                        paddingLeft={1}
                        paddingRight={1}
                      >
                        {partition.crcValid ? t('common.yes') : t('common.no')}
                      </Mark>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
      <Dialog.Root size="xl" modal>
        <Dialog.Trigger asChild>
          <Button variant="outline">{t('common.viewRawData')}</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t('common.rawData')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <HexViewer data={otaPartition.data} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Button
        variant="outline"
        onClick={() =>
          downloadData(
            otaPartition.data,
            'otadata.bin',
            'application/octet-stream',
          )
        }
      >
        {t('common.downloadRawData')}
      </Button>
    </Stack>
  );
}

function AppDebug({
  appPartitionData,
  partitionLabel,
}: {
  appPartitionData: Uint8Array;
  partitionLabel: OtaPartitionDetails['partitionLabel'];
}) {
  const { t } = useTranslation();

  return (
    <Stack>
      <Heading size="lg">
        {t('debug.appPartitionData')} ({partitionLabel})
      </Heading>
      <Dialog.Root size="xl" modal>
        <Dialog.Trigger asChild>
          <Button variant="outline">{t('common.viewRawData')}</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t('common.rawData')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
              <Dialog.Body>
                <HexViewer data={appPartitionData} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Button
        variant="outline"
        onClick={() =>
          downloadData(
            appPartitionData,
            `${partitionLabel}.bin`,
            'application/octet-stream',
          )
        }
      >
        {t('common.downloadRawData')}
      </Button>
    </Stack>
  );
}

function FirmwareIdentificationDebug({
  app0: app0Info,
  app1: app1Info,
  currentBoot,
}: {
  app0: FirmwareInfo;
  app1: FirmwareInfo;
  currentBoot: 'app0' | 'app1';
}) {
  const { t } = useTranslation();

  const getColorPalette = (
    type: FirmwareInfo['type'],
  ): 'green' | 'orange' | 'blue' | 'gray' => {
    switch (type) {
      case 'official-english':
      case 'official-chinese':
        return 'green';
      case 'crosspoint':
        return 'blue';
      case 'unknown':
      default:
        return 'orange';
    }
  };

  const translateFirmwareDisplayName = (info: FirmwareInfo): string => {
    switch (info.type) {
      case 'official-english':
        return t('firmware.officialEnglish');
      case 'official-chinese':
        return t('firmware.officialChinese');
      case 'crosspoint':
        return t('firmware.crosspoint');
      case 'unknown':
      default:
        return t('firmware.unknown');
    }
  };

  return (
    <Stack>
      <Heading size="lg">{t('debug.firmwareInfo')}</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2 }} gap={4}>
        {[
          { label: 'app0', info: app0Info },
          { label: 'app1', info: app1Info },
        ].map(({ label, info }) => (
          <Card.Root
            variant="subtle"
            size="sm"
            key={label}
            colorPalette={getColorPalette(info.type)}
          >
            <Card.Header>
              <Flex alignItems="center" gap={2}>
                <Heading size="md">
                  {t('debug.partition')} {label}
                </Heading>
                {label === currentBoot && (
                  <Badge colorPalette="green" variant="solid" size="sm">
                    {t('common.active')}
                  </Badge>
                )}
              </Flex>
            </Card.Header>
            <Card.Body>
              <Stack gap={2}>
                <div>
                  <Text fontWeight="bold">{t('debug.firmware')}</Text>
                  <Text>{translateFirmwareDisplayName(info)}</Text>
                </div>
                <div>
                  <Text fontWeight="bold">{t('debug.version')}</Text>
                  <Text>{info.version}</Text>
                </div>
                <div>
                  <Text fontWeight="bold">{t('debug.type')}</Text>
                  <Text>{info.type}</Text>
                </div>
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

/** Render translated HTML strings (bold, em tags) safely */
function HtmlText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Debug() {
  const { debugActions, stepData, isRunning } = useEspOperations();
  const [debugOutputNode, setDebugOutputNode] = useState<ReactNode>(null);
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap="20px">
      <Stack gap={3} as="section">
        <div>
          <Heading size="xl">{t('debug.heading')}</Heading>
          <Stack gap={1} color="grey" textStyle="sm">
            <p>{t('debug.desc')}</p>
            <p>
              <HtmlText html={t('debug.readOtadata.desc')} />
            </p>
            <p>
              <HtmlText html={t('debug.readApp.desc')} />
            </p>
            <p>
              <HtmlText html={t('debug.swapBoot.desc')} />
            </p>
            <p>
              <HtmlText html={t('debug.identifyFirmware.desc')} />
            </p>
          </Stack>
        </div>
        <Stack as="section">
          <Button
            variant="subtle"
            onClick={() => {
              debugActions
                .readDebugOtadata()
                .then((data) =>
                  setDebugOutputNode(<OtadataDebug otaPartition={data} />),
                );
            }}
            disabled={isRunning}
          >
            {t('debug.readOtadata')}
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              debugActions
                .readAppPartition('app0')
                .then((data) =>
                  setDebugOutputNode(
                    <AppDebug appPartitionData={data} partitionLabel="app0" />,
                  ),
                );
            }}
            disabled={isRunning}
          >
            {t('debug.readApp0')}
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              debugActions
                .readAppPartition('app1')
                .then((data) =>
                  setDebugOutputNode(
                    <AppDebug appPartitionData={data} partitionLabel="app1" />,
                  ),
                );
            }}
            disabled={isRunning}
          >
            {t('debug.readApp1')}
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              debugActions
                .swapBootPartition()
                .then((data) =>
                  setDebugOutputNode(<OtadataDebug otaPartition={data} />),
                );
            }}
            disabled={isRunning}
          >
            {t('debug.swapBoot')}
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              debugActions
                .readAndIdentifyAllFirmware()
                .then((data) =>
                  setDebugOutputNode(
                    <FirmwareIdentificationDebug
                      app0={data.app0}
                      app1={data.app1}
                      currentBoot={data.currentBoot}
                    />,
                  ),
                );
            }}
            disabled={isRunning}
          >
            {t('debug.identifyFirmware')}
          </Button>
        </Stack>
      </Stack>
      <Separator />
      <Card.Root variant="subtle">
        <Card.Header>
          <Heading size="lg">{t('common.steps')}</Heading>
        </Card.Header>
        <Card.Body>
          {stepData.length > 0 ? (
            <Steps steps={stepData} />
          ) : (
            <Alert.Root status="info" variant="surface">
              <Alert.Indicator />
              <Alert.Title>{t('common.progressHint')}</Alert.Title>
            </Alert.Root>
          )}
        </Card.Body>
      </Card.Root>
      {!isRunning && !!debugOutputNode ? (
        <>
          <Separator />
          {debugOutputNode}
        </>
      ) : null}
    </Flex>
  );
}
