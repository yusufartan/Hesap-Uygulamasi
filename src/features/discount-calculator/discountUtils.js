export const calculateDiscountResults = (price, rate) => {
  const p = parseFloat(price)
  const r = parseFloat(rate)

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