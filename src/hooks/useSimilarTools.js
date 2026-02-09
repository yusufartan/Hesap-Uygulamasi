/**
 * Benzer Araçlar Hook'u
 * URL'den otomatik olarak benzer araçları bulur
 */

import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { findSimilarTools, getToolIdFromPathname } from '../utils/similarToolsUtils'
import { similarToolsByPageId } from '../config/similarToolsConfig'

/**
 * Mevcut sayfa için benzer araçları döndürür
 * 
 * @param {Object} options - Seçenekler
 * @param {number} options.maxResults - Maksimum sonuç sayısı (varsayılan: 3)
 * @param {Array<string>} options.manualToolIds - Manuel tool ID listesi (override)
 * @returns {Array<string>} Benzer araç ID'leri
 */
export function useSimilarTools({ maxResults = 3, manualToolIds = null } = {}) {
  const location = useLocation()
  
  const similarToolIds = useMemo(() => {
    const toolId = getToolIdFromPathname(location.pathname)
    
    if (!toolId) {
      return []
    }
    
    // Manuel override varsa kullan
    if (manualToolIds && Array.isArray(manualToolIds) && manualToolIds.length > 0) {
      return manualToolIds.slice(0, maxResults)
    }
    
    // Önce manuel config'e bak (backward compatibility)
    const manualConfig = similarToolsByPageId[toolId]
    if (manualConfig && manualConfig.length > 0) {
      return manualConfig.slice(0, maxResults)
    }
    
    // Otomatik bulma
    return findSimilarTools(toolId, maxResults)
  }, [location.pathname, maxResults, manualToolIds])
  
  return similarToolIds
}
