'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation, type Locale } from '@/i18n';

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

const THEME_OPTIONS = [
  { value: 'light', key: 'header.themeLight' },
  { value: 'dark', key: 'header.themeDark' },
  { value: 'system', key: 'header.themeSystem' },
] as const;

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="theme-switcher" role="group" aria-label={t('header.theme')}>
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={theme === option.value}
          title={t('header.theme')}
          onClick={() => setTheme(option.value)}
        >
          {t(option.key)}
        </button>
      ))}
    </div>
  );
}

export default function HeaderBar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useTranslation();

  return (
    <header className="masthead">
      <div className="masthead__row">
        <div className="masthead__brand">
          <div className="masthead__title-row">
            <h1>
              <Link href="/">{t('header.title')}</Link>
            </h1>
            <nav className="primary-nav" aria-label={t('header.title')}>
              <Link
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                {t('common.flash')}
              </Link>
              <Link
                href="/debug"
                aria-current={pathname === '/debug' ? 'page' : undefined}
              >
                {t('common.debug')}
              </Link>
            </nav>
          </div>
          <p className="masthead__intro">{t('header.intro')}</p>
        </div>

        <div className="masthead__actions">
          <div className="locale-switcher" role="group" aria-label="Language">
            {LOCALE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={locale === option.value}
                onClick={() => setLocale(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
