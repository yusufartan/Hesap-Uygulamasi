/**
 * Profesyonel i18n yardımcıları — Kurumsal sitelerdeki gibi convention-based çeviri.
 * Yeni araç eklerken: toolsConfig'e sadece id/path/icon ekle, translation JSON'a tools.{id} ve tools.{id}.description ekle.
 */

/**
 * ID'yi okunabilir başlığa çevirir (fallback için)
 * "percent-calc" -> "Percent Calc"
 */
export function formatIdAsTitle(id) {
  if (!id || typeof id !== 'string') return ''
  return id
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Araç başlığı — t('tools.{id}.title') veya t('{id}') fallback ile
 */
export function getToolTitle(t, id) {
  if (!id) return ''
  const key = `tools.${id}.title`
  const val = t(key)
  if (val && val !== key) return val
  const legacy = t(id)
  if (legacy && legacy !== id) return legacy
  return formatIdAsTitle(id)
}

/**
 * Araç açıklaması — t('tools.{id}.description') veya t('{id}Desc')
 */
export function getToolDescription(t, id) {
  if (!id) return ''
  const key = `tools.${id}.description`
  const val = t(key)
  if (val && val !== key) return val
  const legacyKey = `${id}Desc`
  const legacy = t(legacyKey)
  if (legacy && legacy !== legacyKey) return legacy
  return ''
}

/**
 * Kategori başlığı — t('categories.{id}') veya t('category{Id}')
 */
export function getCategoryTitle(t, id) {
  if (!id) return ''
  const categoryKeys = {
    genel: 'categoryGenel',
    finance: 'categoryFinance',
    health: 'categoryHealth',
    time: 'categoryTime',
    'unit-converters': 'categoryUnitConverters',
    'math-data': 'categoryMathData',
  }
  const legacyKey = categoryKeys[id]
  if (legacyKey) {
    const val = t(legacyKey)
    if (val && val !== legacyKey) return val
  }
  const key = `categories.${id}`
  const val = t(key)
  if (val && val !== key) return val
  return formatIdAsTitle(id)
}
