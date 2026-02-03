import { useSelector } from 'react-redux'
import { translations } from '../utils/translations'

export const useTranslation = () => {
  const language = useSelector((state) => state.language.currentLanguage)

  const t = (key) => {
    // Seçili dildeki karşılığı bul, yoksa key'in kendisini döndür
    return translations[language][key] || key
  }

  return { t, language }
}
