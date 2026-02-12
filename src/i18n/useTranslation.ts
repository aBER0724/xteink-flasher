'use client';

import { useContext } from 'react';
import { I18nContext, type I18nContextValue } from './I18nProvider';

export default function useTranslation(): I18nContextValue {
  return useContext(I18nContext);
}
