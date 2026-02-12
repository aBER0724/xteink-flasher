'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Locale } from './types';
import en from './locales/en';
import zh from './locales/zh';
import ja from './locales/ja';

type TranslationKey = keyof typeof en;

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  zh,
  ja,
};

const STORAGE_KEY = 'xteink-locale';

function detectDefaultLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in dictionaries) return stored as Locale;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  return 'en';
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  /** Translate a step name (uses English step name as key, returns translated version) */
  tStep: (stepName: string) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => en[key],
  tStep: (name) => name,
});

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(detectDefaultLocale());
    setHydrated(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key] ?? en[key],
    [locale],
  );

  const tStep = useCallback(
    (stepName: string): string => {
      // Try to find a matching step translation key
      const stepKey = `step.${stepName}` as TranslationKey;
      const dict = dictionaries[locale];
      if (stepKey in dict) {
        return dict[stepKey];
      }

      // Handle dynamic step names like "Flash app partition (app0)"
      // Try to match the base name before parentheses
      const baseMatch = stepName.match(/^(.+?)\s*\(/);
      if (baseMatch) {
        const baseKey = `step.${baseMatch[1]}` as TranslationKey;
        if (baseKey in dict) {
          const suffix = stepName.slice(baseMatch[1]!.length);
          return `${dict[baseKey]}${suffix}`;
        }
      }

      // Also handle "Read app partition (app0)" → step key "Read app0 partition" doesn't exist
      // but "Read app0 partition" and "Read app1 partition" do
      const directKey = `step.${stepName}` as TranslationKey;
      if (directKey in dict) {
        return dict[directKey];
      }

      return stepName;
    },
    [locale],
  );

  // Set document lang on hydration
  useEffect(() => {
    if (hydrated) {
      document.documentElement.lang = locale;
    }
  }, [hydrated, locale]);

  const contextValue = useMemo(
    () => ({ locale, setLocale, t, tStep }),
    [locale, setLocale, t, tStep],
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}
