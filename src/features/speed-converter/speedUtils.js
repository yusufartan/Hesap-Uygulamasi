export const unitOptions = [
  { shortName: 'm/s', longName: 'Metre/saniye', factor: 1 },
  { shortName: 'km/h', longName: 'Kilometre/saat', factor: 0.277777778 },
  { shortName: 'mph', longName: 'Mil/saat', factor: 0.44704 },
  { shortName: 'kn', longName: 'Knot (Deniz mili/saat)', factor: 0.514444444 },
  { shortName: 'ft/s', longName: 'Foot/saniye', factor: 0.3048 },
  { shortName: 'mach', longName: 'Mach (Ses hızı)', factor: 340.29 },
  { shortName: 'c', longName: 'Işık hızı', factor: 299792458 }
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

export const convertSpeed = (value, fromFactor, toFactor) => {
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
