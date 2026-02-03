export const unitOptions = [
  { shortName: '°C', longName: 'Celsius', id: 'c' },
  { shortName: '°F', longName: 'Fahrenheit', id: 'f' },
  { shortName: 'K', longName: 'Kelvin', id: 'k' }
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

const toCelsius = (val, id) => {
  switch (id) {
    case 'c': return val
    case 'f': return (val - 32) * 5 / 9
    case 'k': return val - 273.15
    default: return val
  }
}

const fromCelsius = (val, id) => {
  switch (id) {
    case 'c': return val
    case 'f': return (val * 9 / 5) + 32
    case 'k': return val + 273.15
    default: return val
  }
}

export const convertTemp = (value, fromId, toId) => {
  if (!value && value !== 0) return ''
  
  let num = parseFloat(value)
  if (isNaN(num)) {
      // İşlem bitmemişse hesaplama yapma
      if (/[+\-*/]$/.test(value)) return ''
      num = safeEvaluate(value)
  }

  if (isNaN(num)) return ''

  // Önce Celsius'a çevir, sonra hedef birime
  const celsiusVal = toCelsius(num, fromId)
  const result = fromCelsius(celsiusVal, toId)
  
  // Çok küçük veya çok büyük sayılar için formatlama
  if (Math.abs(result) < 1e-6 && result !== 0) {
      return result.toPrecision(6).replace(/\.?0+$/, "")
  }
  
  // Ondalık basamak sayısını sınırla
  return parseFloat(result.toFixed(4)).toString()
}
