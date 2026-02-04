import { useSelector } from 'react-redux'
import { translations } from '../utils/translations'

export const useTranslation = () => {
  const language = useSelector((state) => state.language.currentLanguage)

  const t = (key) => {
    const lang = translations[language] || translations.tr || {}
    return lang[key] ?? key
  }

  return { t, language }
}
