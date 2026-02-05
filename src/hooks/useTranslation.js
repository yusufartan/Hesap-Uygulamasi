/**
 * Re-export react-i18next's useTranslation for drop-in replacement.
 * Components can keep using: const { t, language } = useTranslation()
 */
import { useTranslation as useI18nTranslation } from 'react-i18next'

export function useTranslation() {
  const { t, i18n } = useI18nTranslation()
  const language = i18n.language?.split('-')[0] || 'tr'
  return { t, language, i18n }
}

export { useTranslation as useTranslationOriginal } from 'react-i18next'
