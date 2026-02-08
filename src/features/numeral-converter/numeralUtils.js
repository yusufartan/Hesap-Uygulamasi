export const unitOptions = [
  { shortName: 'BIN', longName: 'Binary (İkili)', base: 2 },
  { shortName: 'OCT', longName: 'Octal (Sekizli)', base: 8 },
  { shortName: 'DEC', longName: 'Decimal (Onlu)', base: 10 },
  { shortName: 'HEX', longName: 'Hexadecimal (Onaltılı)', base: 16 }
]

// Verilen değerin, belirtilen tabana uygun olup olmadığını kontrol eder
export const isValidInput = (value, base) => {
  if (!value) return true
  
  // Hexadecimal için A-F harflerine izin ver
  if (base === 16) {
    return /^[0-9A-Fa-f]*$/.test(value)
  }
  
  // Diğer tabanlar için sadece rakamları kontrol et
  // Örn: Binary için sadece 0-1, Octal için 0-7
  const regex = new RegExp(`^[0-${base - 1}]*$`)
  return regex.test(value)
}

export const convertNumeral = (value, fromBase, toBase) => {
  if (!value) return ''
  
  try {
    // Önce decimal'e çevir
    const decimalValue = parseInt(value, fromBase)
    
    if (isNaN(decimalValue)) return ''
    
    // Decimal'den hedef tabana çevir ve büyük harfe dönüştür (Hex için)
    return decimalValue.toString(toBase).toUpperCase()
  } catch (e) {
    return ''
  }
}
