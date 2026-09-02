'use client';

import React from 'react';
import { LuGithub } from 'react-icons/lu';
import { useTranslation } from '@/i18n';

export default function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <a
        className="github-link"
        href="https://github.com/aBER0724/xteink-flasher"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('header.github')}
      >
        <LuGithub aria-hidden="true" />
      </a>
    </footer>
  );
}
