/**
 * Türkçe biçimi parse eder: "100.000" = 100000, "100,5" veya "100.000,5" = 100000.5
 * Nokta binlik ayracı, virgül ondalık ayracı kabul edilir.
 */
function parseNumber(str) {
  if (!str || typeof str !== 'string') return NaN
  const trimmed = str.trim().replace(/\s/g, '')
  if (!trimmed) return NaN
  const lastComma = trimmed.lastIndexOf(',')
  let numStr
  if (lastComma >= 0) {
    const intPart = trimmed.slice(0, lastComma).replace(/\./g, '')
    const decPart = trimmed.slice(lastComma + 1)
    numStr = intPart + (decPart ? '.' + decPart : '')
  } else {
    numStr = trimmed.replace(/\.(?=\d{3}(\d{3})*$)/g, '')
  }
  return parseFloat(numStr)
}

export const calculateDiscountResults = (price, rate) => {
  const p = parseNumber(price)
  const r = parseNumber(rate)

  if (!price || isNaN(p)) return { finalPrice: '0', savedAmount: '0' }
  
  // İndirim oranı boşsa veya geçersizse 0 kabul et
  const effectiveRate = (!rate || isNaN(r)) ? 0 : r

  const saved = (p * effectiveRate) / 100
  const final = p - saved

  // Sonuçları formatla (Gerekirse ondalık göster, tam sayıysa gösterme)
  const format = (num) => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2)
  }

  return {
    finalPrice: format(final < 0 ? 0 : final),
    savedAmount: format(saved < 0 ? 0 : saved)
  }
}