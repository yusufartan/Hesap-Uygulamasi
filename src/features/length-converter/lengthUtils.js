export const unitOptions = [
  { shortName: 'km', longName: 'Kilometre', factor: 1000 },
  { shortName: 'm', longName: 'Metre', factor: 1 },
  { shortName: 'dm', longName: 'Desimetre', factor: 0.1 },
  { shortName: 'cm', longName: 'Santimetre', factor: 0.01 },
  { shortName: 'mm', longName: 'Milimetre', factor: 0.001 },
  { shortName: 'µm', longName: 'Mikrometre', factor: 1e-6 },
  { shortName: 'nm', longName: 'Nanometre', factor: 1e-9 },
  { shortName: 'pm', longName: 'Pikometre', factor: 1e-12 },
  { shortName: 'nmi', longName: 'Deniz mili', factor: 1852 },
  { shortName: 'mi', longName: 'Mil', factor: 1609.344 },
  { shortName: 'yd', longName: 'Yard', factor: 0.9144 },
  { shortName: 'ft', longName: 'Foot', factor: 0.3048 },
  { shortName: 'in', longName: 'İnç', factor: 0.0254 },
  { shortName: 'ld', longName: 'Ay uzaklığı', factor: 384400000 },
  { shortName: 'ly', longName: 'Işık yılı', factor: 9.4607e15 },
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

export const convertLength = (value, fromFactor, toFactor) => {
  if (!value) return ''
  
  // Eğer input bir işlem içeriyorsa (örn: "10+5"), önce onu hesapla
  let num = parseFloat(value)
  if (isNaN(num)) {
      // İşlem bitmemişse (örn: "10+") hesaplama yapma
      if (/[+\-*/]$/.test(value)) return ''
      num = safeEvaluate(value)
  }

  if (isNaN(num)) return ''
  
  const result = num * (fromFactor / toFactor)
  
  // Çok küçük veya çok büyük sayılar için bilimsel gösterimden kaçınarak string formatla
  if (Math.abs(result) < 1e-6 || Math.abs(result) > 1e9) {
      return result.toPrecision(6).replace(/\.?0+$/, "")
  }
  
  return parseFloat(result.toFixed(6)).toString()
}
