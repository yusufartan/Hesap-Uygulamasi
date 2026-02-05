import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import tr from './locales/tr/translation.json'
import en from './locales/en/translation.json'

const resources = {
  tr: { translation: tr },
  en: { translation: en },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes
      defaultVariables: {},
      format: (value, format, lng) => {
        // Locale-aware number formatting (TR: 1.234,56 — EN: 1,234.56)
        if (format === 'number' && (typeof value === 'number' || !isNaN(Number(value)))) {
          const num = typeof value === 'number' ? value : Number(value)
          return new Intl.NumberFormat(lng === 'tr' ? 'tr-TR' : 'en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 10,
          }).format(num)
        }
        if (format === 'currency' && (typeof value === 'number' || !isNaN(Number(value)))) {
          const num = typeof value === 'number' ? value : Number(value)
          return new Intl.NumberFormat(lng === 'tr' ? 'tr-TR' : 'en-US', {
            style: 'currency',
            currency: lng === 'tr' ? 'TRY' : 'USD',
          }).format(num)
        }
        return value
      },
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      // Migrate from old key if present
      lookupFromPathIndex: 0,
    },
  })

// Migrate legacy app_language to i18nextLng once
const legacy = typeof localStorage !== 'undefined' && localStorage.getItem('app_language')
if (legacy && (legacy === 'tr' || legacy === 'en')) {
  i18n.changeLanguage(legacy)
  localStorage.removeItem('app_language')
}

/**
 * Format a number for the current locale (TR: 1.234,56 — EN: 1,234.56).
 * Use in calculator results, inputs, etc.
 * @param {number} value - Number to format
 * @param {Intl.NumberFormatOptions} [options] - Optional Intl options (min/max fraction digits, etc.)
 * @returns {string}
 */
export function formatNumber(value, options = {}) {
  const lng = i18n.language?.split('-')[0] || 'tr'
  return new Intl.NumberFormat(lng === 'tr' ? 'tr-TR' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
    ...options,
  }).format(Number(value))
}

/**
 * Use in translation strings: t('resultLabel', { value: formatNumber(1234.56) })
 * Or with built-in interpolation: t('key', { count: 1234.56 }) when key is "Sonuç: {{count, number}}"
 */
export default i18n
