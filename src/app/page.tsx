'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Heading,
  Separator,
  Card,
  Alert,
  Stack,
  Flex,
} from '@chakra-ui/react';
import FileUpload, { FileUploadHandle } from '@/components/FileUpload';
import Steps from '@/components/Steps';
import { useEspOperations } from '@/esp/useEspOperations';
import {
  getOfficialFirmwareVersions,
  getCommunityFirmwareRemoteData,
  getCjkFirmwareRemoteData,
} from '@/remote/firmwareFetcher';
import { useTranslation } from '@/i18n';

/** Render translated HTML strings (bold, em tags) safely */
function HtmlText({ html }: { html: string }) {
  // Only allow <b>, <em> tags - safe for our translation strings
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Home() {
  const { actions, stepData, isRunning } = useEspOperations();
  const { t } = useTranslation();
  const [officialFirmwareVersions, setOfficialFirmwareVersions] = useState<{
    en: string;
    ch: string;
  } | null>(null);
  const [communityFirmwareVersions, setCommunityFirmwareVersions] = useState<{
    crossPoint: { version: string; releaseDate: string };
  } | null>(null);
  const [cjkFirmwareVersions, setCjkFirmwareVersions] = useState<{
    crossPointCjk: { version: string; releaseDate: string };
  } | null>(null);
  const fullFlashFileInput = useRef<FileUploadHandle>(null);
  const appPartitionFileInput = useRef<FileUploadHandle>(null);

  useEffect(() => {
    getOfficialFirmwareVersions().then((versions) =>
      setOfficialFirmwareVersions(versions),
    );

    getCommunityFirmwareRemoteData().then(setCommunityFirmwareVersions);

    getCjkFirmwareRemoteData().then(setCjkFirmwareVersions);
  }, []);

  return (
    <Flex direction="column" gap="20px">
      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t('flash.warning.title')}</Alert.Title>
          <Alert.Description>
            <Stack>
              <p>
                <HtmlText html={t('flash.warning.desc1')} />
              </p>
              <p>
                <HtmlText html={t('flash.warning.desc2')} />
              </p>
            </Stack>
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Stack gap={3} as="section">
        <div>
          <Heading size="xl">{t('flash.fullFlash.heading')}</Heading>
          <Stack gap={1} color="grey" textStyle="sm">
            <p>{t('flash.fullFlash.desc1')}</p>
            <p>
              <HtmlText html={t('flash.fullFlash.desc2')} />
            </p>
          </Stack>
        </div>
        <Stack as="section">
          <Button
            variant="subtle"
            onClick={actions.saveFullFlash}
            disabled={isRunning}
          >
            {t('flash.saveFullFlash')}
          </Button>
          <Stack direction="row">
            <Flex grow={1}>
              <FileUpload ref={fullFlashFileInput} />
            </Flex>
            <Button
              variant="subtle"
              flexGrow={1}
              onClick={() =>
                actions.writeFullFlash(() =>
                  fullFlashFileInput.current?.getFile(),
                )
              }
              disabled={isRunning}
            >
              {t('flash.writeFullFlash')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Separator />
      <Stack gap={3} as="section">
        <div>
          <Heading size="xl">{t('flash.otaFlash.heading')}</Heading>
          <Stack gap={1} color="grey" textStyle="sm">
            <p>
              <HtmlText html={t('flash.otaFlash.desc1')} />
            </p>
            <p>
              <HtmlText html={t('flash.otaFlash.desc2')} />
            </p>
          </Stack>
        </div>
        <Stack as="section">
          <Button
            variant="subtle"
            onClick={actions.flashEnglishFirmware}
            disabled={isRunning || !officialFirmwareVersions}
            loading={!officialFirmwareVersions}
          >
            {t('flash.flashEnglish')} ({officialFirmwareVersions?.en ?? '...'})
          </Button>
          <Button
            variant="subtle"
            onClick={actions.flashChineseFirmware}
            disabled={isRunning || !officialFirmwareVersions}
            loading={!officialFirmwareVersions}
          >
            {t('flash.flashChinese')} ({officialFirmwareVersions?.ch ?? '...'})
          </Button>
          <Button
            variant="subtle"
            onClick={actions.flashCrossPointFirmware}
            disabled={isRunning || !communityFirmwareVersions}
            loading={!communityFirmwareVersions}
          >
            {t('flash.flashCrossPoint')} (
            {communityFirmwareVersions?.crossPoint.version}) -{' '}
            {communityFirmwareVersions?.crossPoint.releaseDate}
          </Button>
          <Button
            variant="subtle"
            onClick={actions.flashCjkFirmware}
            disabled={isRunning || !cjkFirmwareVersions}
            loading={!cjkFirmwareVersions}
          >
            {t('flash.flashCrossPointCjk')} (
            {cjkFirmwareVersions?.crossPointCjk.version}) -{' '}
            {cjkFirmwareVersions?.crossPointCjk.releaseDate}
          </Button>
          <Stack direction="row">
            <Flex grow={1}>
              <FileUpload ref={appPartitionFileInput} />
            </Flex>
            <Button
              variant="subtle"
              flexGrow={1}
              onClick={() =>
                actions.flashCustomFirmware(() =>
                  appPartitionFileInput.current?.getFile(),
                )
              }
              disabled={isRunning}
            >
              {t('flash.flashFromFile')}
            </Button>
          </Stack>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="subtle"
              onClick={actions.fakeWriteFullFlash}
              disabled={isRunning}
            >
              {t('flash.fakeWrite')}
            </Button>
          )}
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
      <Alert.Root status="info">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t('flash.changeLanguage.title')}</Alert.Title>
          <Alert.Description>
            {t('flash.changeLanguage.desc')}
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root status="info">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{t('flash.restartDevice.title')}</Alert.Title>
          <Alert.Description>{t('flash.restartDevice.desc')}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </Flex>
  );
}
