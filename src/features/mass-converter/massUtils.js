export const unitOptions = [
  { shortName: 't', longName: 'Ton (Metrik)', factor: 1000000 },
  { shortName: 'kg', longName: 'Kilogram', factor: 1000 },
  { shortName: 'g', longName: 'Gram', factor: 1 },
  { shortName: 'mg', longName: 'Miligram', factor: 0.001 },
  { shortName: 'µg', longName: 'Mikrogram', factor: 0.000001 },
  { shortName: 'lb', longName: 'Pound (Libre)', factor: 453.59237 },
  { shortName: 'oz', longName: 'Ounce (Ons)', factor: 28.34952 },
  { shortName: 'st', longName: 'Stone', factor: 6350.29318 },
  { shortName: 'ct', longName: 'Karat', factor: 0.2 },
  { shortName: 'q', longName: 'Kental (Quintal)', factor: 100000 },
  { shortName: 'gr', longName: 'Grain', factor: 0.06479891 },
  { shortName: 'l.t', longName: 'Long Ton (UK)', factor: 1016046.91 },
  { shortName: 'sh.t', longName: 'Short Ton (US)', factor: 907184.74 }
]

// Basit matematiksel ifadeleri güvenli bir şekilde hesaplar
export const safeEvaluate = (expression) => {
  try {
    // Sadece sayı ve operatörlere izin ver
    if (/[^0-9+\-*/. ]/.test(expression)) return parseFloat(expression)
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + expression + ')')()
  } catch (e) {
    return parseFloat(expression)
  }
}

export const convertMass = (value, fromFactor, toFactor) => {
  if (!value) return ''
  
  let num = parseFloat(value)
  if (isNaN(num)) {
      // İşlem bitmemişse hesaplama yapma
      if (/[+\-*/]$/.test(value)) return ''
      num = safeEvaluate(value)
  }

  if (isNaN(num)) return ''
  
  const result = num * (fromFactor / toFactor)
  
  // Çok küçük veya çok büyük sayılar için formatlama
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e9) {
      return result.toPrecision(6).replace(/\.?0+$/, "")
  }
  
  return parseFloat(result.toFixed(6)).toString()
}
