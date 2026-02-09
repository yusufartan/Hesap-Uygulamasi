/**
 * Benzer Araçlar Konfigürasyonu
 * 
 * Bu dosya artık sadece MANUEL OVERRIDE'lar için kullanılır.
 * Otomatik sistem kategori bazlı eşleşme yapar.
 * 
 * Manuel override eklemek isterseniz:
 * - Buraya toolId: [toolId1, toolId2, ...] şeklinde ekleyin
 * - Otomatik sistem bu override'ı önceliklendirir
 * 
 * Otomatik sistem:
 * - Aynı kategorideki araçları önceliklendirir
 * - İlgili kategorilerden araçları ekler
 * - Popüler araçlarla tamamlar
 */

import { getToolById as getToolByIdUtil } from '../utils/similarToolsUtils'

/**
 * Backward compatibility için getToolById export ediyoruz
 * Yeni kodlar utils/similarToolsUtils.js'den import etmeli
 */
export function getToolById(id) {
  return getToolByIdUtil(id)
}

/**
 * MANUEL OVERRIDE MAPPING
 * 
 * Bu mapping otomatik sistemi override eder.
 * Boş bırakırsanız otomatik kategori bazlı eşleşme kullanılır.
 * 
 * Örnek kullanım:
 * - Özel bir eşleşme istiyorsanız buraya ekleyin
 * - Yoksa otomatik sistem devreye girer
 */
export const similarToolsByPageId = {
  // Manuel override örnekleri (opsiyonel)
  // discount: ['finance', 'currency', 'calculator'],
  // finance: ['discount', 'currency', 'calculator'],
  // currency: ['finance', 'discount', 'calculator'],
  
  // Boş bırakılanlar otomatik sistem tarafından doldurulur
}
