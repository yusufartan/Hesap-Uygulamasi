/**
 * Benzer Araçlar Utility Fonksiyonları
 * Kurumsal seviyede otomatik kategori bazlı eşleşme sistemi
 */

import { toolsConfig } from '../config/toolsConfig'

/**
 * Tüm araçları düzleştirilmiş liste olarak döndürür
 */
export function getAllTools() {
  return toolsConfig.flatMap((category) => category.items || [])
}

/**
 * Tool ID'ye göre araç bilgisini bulur
 */
export function getToolById(toolId) {
  const allTools = getAllTools()
  return allTools.find((tool) => tool.id === toolId) || null
}

/**
 * Tool ID'ye göre kategori bilgisini bulur
 */
export function getCategoryByToolId(toolId) {
  for (const category of toolsConfig) {
    if (category.items?.some((item) => item.id === toolId)) {
      return category
    }
  }
  return null
}

/**
 * Kategori ID'ye göre o kategorideki tüm araçları döndürür (kendisi hariç)
 */
export function getToolsByCategory(categoryId, excludeToolId = null) {
  const category = toolsConfig.find((cat) => cat.id === categoryId)
  if (!category || !category.items) return []
  
  return category.items.filter((tool) => tool.id !== excludeToolId)
}

/**
 * Pathname'den tool ID'yi çıkarır
 */
export function getToolIdFromPathname(pathname) {
  if (pathname === '/' || pathname === '') return 'dashboard'
  
  const allTools = getAllTools()
  const tool = allTools.find((t) => t.path === pathname)
  return tool?.id || null
}

/**
 * Otomatik benzer araçları bulur
 * 
 * Strateji:
 * 1. Aynı kategorideki diğer araçlar (öncelikli)
 * 2. İlgili kategorilerden araçlar (fallback)
 * 3. Popüler araçlar (son fallback)
 * 
 * @param {string} toolId - Mevcut araç ID'si
 * @param {number} maxResults - Maksimum sonuç sayısı (varsayılan: 3)
 * @param {Array<string>} manualOverrides - Manuel override listesi (opsiyonel)
 * @returns {Array<string>} Benzer araç ID'leri
 */
export function findSimilarTools(toolId, maxResults = 3, manualOverrides = null) {
  // Manuel override varsa öncelik ver
  if (manualOverrides && Array.isArray(manualOverrides) && manualOverrides.length > 0) {
    return manualOverrides.slice(0, maxResults)
  }

  const currentCategory = getCategoryByToolId(toolId)
  if (!currentCategory) {
    // Kategori bulunamazsa popüler araçları döndür
    return getPopularTools(maxResults, toolId)
  }

  const similarTools = []
  
  // 1. Aynı kategorideki diğer araçlar (öncelikli)
  const sameCategoryTools = getToolsByCategory(currentCategory.id, toolId)
  similarTools.push(...sameCategoryTools.map((t) => t.id))
  
  // 2. Eğer yeterli araç yoksa, ilgili kategorilerden ekle
  if (similarTools.length < maxResults) {
    const relatedCategories = getRelatedCategories(currentCategory.id)
    for (const relatedCategoryId of relatedCategories) {
      if (similarTools.length >= maxResults) break
      const relatedTools = getToolsByCategory(relatedCategoryId, toolId)
      for (const tool of relatedTools) {
        if (similarTools.length >= maxResults) break
        if (!similarTools.includes(tool.id)) {
          similarTools.push(tool.id)
        }
      }
    }
  }
  
  // 3. Hala yeterli değilse popüler araçları ekle
  if (similarTools.length < maxResults) {
    const popularTools = getPopularTools(maxResults - similarTools.length, toolId)
    for (const popularId of popularTools) {
      if (!similarTools.includes(popularId)) {
        similarTools.push(popularId)
      }
    }
  }
  
  return similarTools.slice(0, maxResults)
}

/**
 * İlgili kategorileri döndürür (kategori ilişkileri mapping'i)
 */
function getRelatedCategories(categoryId) {
  const relatedMap = {
    'finance': ['genel'],
    'health': ['time'],
    'time': ['health'],
    'unit-converters': ['math-data'],
    'math-data': ['unit-converters', 'genel'],
    'genel': ['finance', 'math-data'],
  }
  
  return relatedMap[categoryId] || []
}

/**
 * Popüler araçları döndürür (genel kullanılan araçlar)
 */
function getPopularTools(maxResults, excludeToolId = null) {
  const popularToolIds = ['calculator', 'currency', 'discount', 'finance', 'bmi', 'age']
  return popularToolIds
    .filter((id) => id !== excludeToolId)
    .slice(0, maxResults)
}
