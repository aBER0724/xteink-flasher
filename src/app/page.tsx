'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { LuTriangleAlert } from 'react-icons/lu';
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
  // eslint-disable-next-line react/no-danger
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
    <div className="page-stack">
      <section
        className="notice notice--warning"
        aria-labelledby="flash-warning-title"
      >
        <LuTriangleAlert className="notice__icon" aria-hidden="true" />
        <div>
          <h2 id="flash-warning-title" className="notice__title">
            {t('flash.warning.title')}
          </h2>
          <div className="notice__copy">
            <p>
              <HtmlText html={t('flash.warning.desc1')} />
            </p>
            <p>
              <HtmlText html={t('flash.warning.desc2')} />
            </p>
          </div>
        </div>
      </section>

      <section className="operation-card" aria-labelledby="full-flash-heading">
        <header className="operation-card__header">
          <p className="section-eyebrow">{t('flash.backupEyebrow')}</p>
          <h2 id="full-flash-heading" className="section-heading">
            {t('flash.fullFlash.heading')}
          </h2>
          <div className="section-copy">
            <p>{t('flash.fullFlash.desc1')}</p>
            <p>
              <HtmlText html={t('flash.fullFlash.desc2')} />
            </p>
          </div>
        </header>
        <div className="action-grid">
          <Button
            className="action-button action-button--primary"
            onClick={actions.saveFullFlash}
            disabled={isRunning}
          >
            {t('flash.saveFullFlash')}
          </Button>
          <div className="file-action-row">
            <FileUpload ref={fullFlashFileInput} disabled={isRunning} />
            <Button
              className="action-button"
              onClick={() =>
                actions.writeFullFlash(() =>
                  fullFlashFileInput.current?.getFile(),
                )
              }
              disabled={isRunning}
            >
              {t('flash.writeFullFlash')}
            </Button>
          </div>
        </div>
      </section>

      <section className="operation-card" aria-labelledby="ota-flash-heading">
        <header className="operation-card__header">
          <p className="section-eyebrow">{t('flash.firmwareEyebrow')}</p>
          <h2 id="ota-flash-heading" className="section-heading">
            {t('flash.otaFlash.heading')}
          </h2>
          <div className="section-copy">
            <p>
              <HtmlText html={t('flash.otaFlash.desc1')} />
            </p>
            <p>
              <HtmlText html={t('flash.otaFlash.desc2')} />
            </p>
          </div>
        </header>
        <div className="firmware-grid">
          <Button
            className="action-button"
            onClick={actions.flashEnglishFirmware}
            disabled={isRunning || !officialFirmwareVersions}
            loading={!officialFirmwareVersions}
          >
            <span className="firmware-action__label">
              {t('flash.flashEnglish')}
            </span>
            <span className="firmware-action__meta">
              {officialFirmwareVersions?.en ?? '...'}
            </span>
          </Button>
          <Button
            className="action-button"
            onClick={actions.flashChineseFirmware}
            disabled={isRunning || !officialFirmwareVersions}
            loading={!officialFirmwareVersions}
          >
            <span className="firmware-action__label">
              {t('flash.flashChinese')}
            </span>
            <span className="firmware-action__meta">
              {officialFirmwareVersions?.ch ?? '...'}
            </span>
          </Button>
          <Button
            className="action-button"
            onClick={actions.flashCrossPointFirmware}
            disabled={isRunning || !communityFirmwareVersions}
            loading={!communityFirmwareVersions}
          >
            <span className="firmware-action__label">
              {t('flash.flashCrossPoint')}
            </span>
            <span className="firmware-action__meta">
              {communityFirmwareVersions?.crossPoint.version ?? '...'} ·{' '}
              {communityFirmwareVersions?.crossPoint.releaseDate ?? '...'}
            </span>
          </Button>
          <Button
            className="action-button"
            onClick={actions.flashCjkFirmwareSc}
            disabled={isRunning || !cjkFirmwareVersions}
            loading={!cjkFirmwareVersions}
          >
            <span className="firmware-action__label">
              {t('flash.flashCrossPointCjkSc')}
            </span>
            <span className="firmware-action__meta">
              {cjkFirmwareVersions?.crossPointCjk.version ?? '...'} ·{' '}
              {cjkFirmwareVersions?.crossPointCjk.releaseDate ?? '...'}
            </span>
          </Button>
          <Button
            className="action-button"
            onClick={actions.flashCjkFirmwareTc}
            disabled={isRunning || !cjkFirmwareVersions}
            loading={!cjkFirmwareVersions}
          >
            <span className="firmware-action__label">
              {t('flash.flashCrossPointCjkTc')}
            </span>
            <span className="firmware-action__meta">
              {cjkFirmwareVersions?.crossPointCjk.version ?? '...'} ·{' '}
              {cjkFirmwareVersions?.crossPointCjk.releaseDate ?? '...'}
            </span>
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button
              className="action-button"
              onClick={actions.fakeWriteFullFlash}
              disabled={isRunning}
            >
              {t('flash.fakeWrite')}
            </Button>
          )}
          <FileUpload ref={appPartitionFileInput} disabled={isRunning} />
          <Button
            className="action-button"
            onClick={() =>
              actions.flashCustomFirmware(() =>
                appPartitionFileInput.current?.getFile(),
              )
            }
            disabled={isRunning}
          >
            {t('flash.flashFromFile')}
          </Button>
        </div>
      </section>

      <section className="progress-card" aria-labelledby="progress-heading">
        <header className="progress-card__header">
          <div>
            <p className="section-eyebrow">{t('flash.progressEyebrow')}</p>
            <h2 id="progress-heading" className="section-heading">
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

      <div className="info-grid">
        <section className="info-card">
          <h2>{t('flash.changeLanguage.title')}</h2>
          <p>{t('flash.changeLanguage.desc')}</p>
        </section>
        <section className="info-card">
          <h2>{t('flash.restartDevice.title')}</h2>
          <p>{t('flash.restartDevice.desc')}</p>
        </section>
      </div>
    </div>
  );
}
