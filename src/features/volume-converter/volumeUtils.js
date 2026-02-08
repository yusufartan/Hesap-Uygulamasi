export const unitOptions = [
  { shortName: 'l', longName: 'Litre', factor: 1 },
  { shortName: 'ml', longName: 'Mililitre', factor: 0.001 },
  { shortName: 'm³', longName: 'Metreküp', factor: 1000 },
  { shortName: 'cm³', longName: 'Santimetreküp', factor: 0.001 },
  { shortName: 'mm³', longName: 'Milimetreküp', factor: 0.000001 },
  { shortName: 'gal (US)', longName: 'Galon (ABD)', factor: 3.78541 },
  { shortName: 'gal (UK)', longName: 'Galon (BK)', factor: 4.54609 },
  { shortName: 'fl oz (US)', longName: 'Sıvı Ons (ABD)', factor: 0.0295735 },
  { shortName: 'fl oz (UK)', longName: 'Sıvı Ons (BK)', factor: 0.0284131 },
  { shortName: 'cup', longName: 'Su Bardağı (ABD)', factor: 0.236588 },
  { shortName: 'tbsp', longName: 'Yemek Kaşığı (ABD)', factor: 0.0147868 },
  { shortName: 'tsp', longName: 'Çay Kaşığı (ABD)', factor: 0.00492892 }
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

export const convertVolume = (value, fromFactor, toFactor) => {
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
