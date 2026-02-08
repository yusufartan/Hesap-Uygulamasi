export const unitOptions = [
  { shortName: "km²", longName: "Kilometre kare", factor: 1000000 },
  { shortName: "ha", longName: "Hektar", factor: 10000 },
  { shortName: "a", longName: "Ar", factor: 100 },
  { shortName: "m²", longName: "Metre kare", factor: 1 },
  { shortName: "dm²", longName: "Desimetre kare", factor: 0.01 },
  { shortName: "cm²", longName: "Santimetre kare", factor: 0.0001 },
  { shortName: "mm²", longName: "Milimetre kare", factor: 0.000001 },
  { shortName: "µ²", longName: "Mikron kare", factor: 1e-12 },
  { shortName: "ac", longName: "Akre", factor: 4046.856 },
  { shortName: "mile²", longName: "Mil kare", factor: 2589988.11 },
  { shortName: "yd²", longName: "Yard kare", factor: 0.836127 },
  { shortName: "ft²", longName: "Adım kare", factor: 0.092903 },
  { shortName: "in²", longName: "İnç kare", factor: 0.00064516 },
  { shortName: "rd²", longName: "Rodkare", factor: 25.2929 },
  { shortName: "qing", longName: "Qing", factor: 666666.6667 },
  { shortName: "mu", longName: "Mu", factor: 666.6667 },
  { shortName: "chi²", longName: "Chikare", factor: 0.1111 },
  { shortName: "cun²", longName: "Cun kare", factor: 0.0001 },
  { shortName: "gongli²", longName: "Kilometre kare (Gongli)", factor: 1000000 }
]

export const convertArea = (value, fromFactor, toFactor) => {
  if (!value) return ''
  const num = parseFloat(value)
  if (isNaN(num)) return ''
  const result = num * (fromFactor / toFactor)
  return parseFloat(result.toFixed(10)).toString()
}