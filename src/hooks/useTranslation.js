/**
 * Re-export react-i18next's useTranslation for drop-in replacement.
 * Profesyonel i18n: getToolTitle, getToolDescription, getCategoryTitle ile
 * toolsConfig'te sadece id/path/icon tutulur; metinler translation JSON'dan gelir.
 */
import { useTranslation as useI18nTranslation } from 'react-i18next'
import { getToolTitle as _getToolTitle, getToolDescription as _getToolDescription, getCategoryTitle as _getCategoryTitle } from '../utils/i18nHelpers'

export function useTranslation() {
  const { t, i18n } = useI18nTranslation()
  const language = i18n.language?.split('-')[0] || 'tr'
  return {
    t,
    language,
    i18n,
    getToolTitle: (id) => _getToolTitle(t, id),
    getToolDescription: (id) => _getToolDescription(t, id),
    getCategoryTitle: (id) => _getCategoryTitle(t, id),
  }
}

export { useTranslation as useTranslationOriginal } from 'react-i18next'
