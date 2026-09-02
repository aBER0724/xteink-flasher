'use client';

import React, { ReactNode, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  Mark,
  Portal,
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
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Debug() {
  const { debugActions, stepData, isRunning } = useEspOperations();
  const [debugOutputNode, setDebugOutputNode] = useState<ReactNode>(null);
  const { t } = useTranslation();

  return (
    <div className="page-stack">
      <section className="operation-card" aria-labelledby="debug-heading">
        <header className="operation-card__header">
          <p className="section-eyebrow">{t('debug.eyebrow')}</p>
          <h2 id="debug-heading" className="section-heading">
            {t('debug.heading')}
          </h2>
          <div className="section-copy">
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
          </div>
        </header>
        <div className="debug-action-grid">
          <Button
            className="action-button"
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
            className="action-button"
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
            className="action-button"
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
            className="action-button"
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
            className="action-button"
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
        </div>
      </section>
      <section
        className="progress-card"
        aria-labelledby="debug-progress-heading"
      >
        <header className="progress-card__header">
          <div>
            <p className="section-eyebrow">{t('debug.progressEyebrow')}</p>
            <h2 id="debug-progress-heading" className="section-heading">
              {t('common.steps')}
            </h2>
          </div>
        </header>
        {stepData.length > 0 ? (
          <Steps steps={stepData} />
        ) : (
          <p className="progress-card__hint">{t('common.progressHint')}</p>
        )}
      </section>
      {!isRunning && !!debugOutputNode ? (
        <section className="output-card" aria-labelledby="debug-output-heading">
          <header className="operation-card__header">
            <p className="section-eyebrow">{t('debug.outputEyebrow')}</p>
            <h2 id="debug-output-heading" className="section-heading">
              {t('debug.outputEyebrow')}
            </h2>
          </header>
          {debugOutputNode}
        </section>
      ) : null}
    </div>
  );
}
