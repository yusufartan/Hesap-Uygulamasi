export const unitOptions = [
  { shortName: 'ps', longName: 'Pikosaniye', factor: 1e-12 },
  { shortName: 'µs', longName: 'Mikrosaniye', factor: 1e-6 },
  { shortName: 'ms', longName: 'Milisaniye', factor: 0.001 },
  { shortName: 's', longName: 'Saniye', factor: 1 },
  { shortName: 'min', longName: 'Dakika', factor: 60 },
  { shortName: 'h', longName: 'Saat', factor: 3600 },
  { shortName: 'd', longName: 'Gün', factor: 86400 },
  { shortName: 'wk', longName: 'Hafta', factor: 604800 },
  { shortName: 'mo', longName: 'Ay (Ortalama)', factor: 2629746 }, // ~30.44 gün
  { shortName: 'yr', longName: 'Yıl (Ortalama)', factor: 31556952 }, // ~365.24 gün
  { shortName: 'dec', longName: 'On Yıl', factor: 315569520 },
  { shortName: 'cen', longName: 'Yüzyıl', factor: 3155695200 }
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

export const convertTime = (value, fromFactor, toFactor) => {
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
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e12) {
      return result.toPrecision(6).replace(/\.?0+$/, "")
  }
  
  return parseFloat(result.toFixed(6)).toString()
}