export type Locale = 'en' | 'zh' | 'ja';

export type TranslationKey = keyof typeof import('./locales/en').default;

export type Translations = Record<TranslationKey, string>;
