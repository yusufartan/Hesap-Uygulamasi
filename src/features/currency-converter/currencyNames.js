/**
 * Para birimi görünen adları (TR/EN) ve semboller.
 * API'dan gelen name alanı İngilizce; TR için bu map kullanılır.
 * Eksik kodlar API name ile fallback edilir.
 */
const NAMES_TR = {
  USD: 'ABD Doları',
  EUR: 'Euro',
  GBP: 'İngiliz Sterlini',
  TRY: 'Türk Lirası',
  JPY: 'Japon Yeni',
  CHF: 'İsviçre Frangı',
  CAD: 'Kanada Doları',
  AUD: 'Avustralya Doları',
  CNY: 'Çin Yuanı',
  BRL: 'Brezilya Realı',
  CZK: 'Çek Kronu',
  DKK: 'Danimarka Kronu',
  HKD: 'Hong Kong Doları',
  HUF: 'Macar Forinti',
  IDR: 'Endonezya Rupisi',
  ILS: 'İsrail Şekeli',
  INR: 'Hint Rupisi',
  ISK: 'İzlanda Kronu',
  KRW: 'Güney Kore Wonu',
  MXN: 'Meksika Pesosu',
  MYR: 'Malezya Ringgiti',
  NOK: 'Norveç Kronu',
  NZD: 'Yeni Zelanda Doları',
  PHP: 'Filipin Pesosu',
  PLN: 'Polonya Zlotisi',
  RON: 'Rumen Leyi',
  SEK: 'İsveç Kronu',
  SGD: 'Singapur Doları',
  THB: 'Tayland Bahtı',
  ZAR: 'Güney Afrika Randı',
  BGN: 'Bulgar Levası',
  RUB: 'Rus Rublesi',
}

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  TRY: '₺',
  JPY: '¥',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  BRL: 'R$',
  MXN: '$',
  ZAR: 'R',
  PLN: 'zł',
  THB: '฿',
  ILS: '₪',
  PHP: '₱',
  HUF: 'Ft',
  CZK: 'Kč',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  RON: 'lei',
  BGN: 'лв',
  AUD: 'A$',
  CAD: 'C$',
  NZD: 'NZ$',
  HKD: 'HK$',
  SGD: 'S$',
  MYR: 'RM',
  IDR: 'Rp',
  ISK: 'kr',
  RUB: '₽',
}

export function getCurrencyNameTr(code) {
  return NAMES_TR[code] || null
}

export function getCurrencySymbol(code) {
  return SYMBOLS[code] || code
}

/**
 * Seçim kutusunda gösterilecek metin: "ABD Doları" (TR) veya API name (EN).
 * Seçildikten sonra: "$ ABD Doları" (sembol + isim).
 */
export function getCurrencyDisplayName(code, language = 'tr', apiName = '') {
  const name = language === 'tr' ? (NAMES_TR[code] || apiName) : (apiName || code)
  return name || code
}

export function getCurrencyLabelWithSymbol(code, language = 'tr', apiName = '') {
  const name = getCurrencyDisplayName(code, language, apiName)
  const symbol = getCurrencySymbol(code)
  return symbol ? `${symbol} ${name}` : name
}
