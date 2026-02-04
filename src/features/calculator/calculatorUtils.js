/**
 * Hesap makinesi mantık fonksiyonları — tüm hesaplama ve ifade işlemleri burada.
 */

export const ERROR_KEY = '__calcError__'

/**
 * İki sayı üzerinde ikili işlem (+, −, ×, ÷).
 * @param {string} prev - Önceki değer
 * @param {string} next - Sonraki değer
 * @param {string} op - Operatör: '+', '−', '×', '÷'
 * @param {() => string} [getError] - Hata mesajı döndüren fonksiyon (örn. sıfıra bölme)
 * @returns {string} Sonuç veya hata anahtarı
 */
export function computeBinary(prev, next, op, getError) {
  const a = parseFloat(prev)
  const b = parseFloat(next)
  if (Number.isNaN(a) || Number.isNaN(b)) return next
  switch (op) {
    case '+': return String(a + b)
    case '−': return String(a - b)
    case '×': return String(a * b)
    case '÷': return b === 0 ? (getError ? getError() : ERROR_KEY) : String(a / b)
    default: return next
  }
}

/**
 * Tek sayı üzerinde tekli işlem (%, √, x², 1/x).
 * @param {string} value - Girdi değeri
 * @param {string} op - '%' | '√' | 'x²' | '1/x'
 * @param {() => string} [getError] - Hata mesajı döndüren fonksiyon
 * @returns {string} Sonuç veya hata anahtarı
 */
export function computeUnary(value, op, getError) {
  const x = parseFloat(value)
  if (Number.isNaN(x)) return value
  switch (op) {
    case '%': return String(x / 100)
    case '√': return x < 0 ? (getError ? getError() : ERROR_KEY) : String(Math.sqrt(x))
    case 'x²': return String(x * x)
    case '1/x': return x === 0 ? (getError ? getError() : ERROR_KEY) : String(1 / x)
    default: return value
  }
}

/**
 * Basit ifade değerlendirici: sayılar, +, −, ×, ÷, ( ).
 * Boşlukla ayrılmış tokenlar bekler.
 * @param {string} str - İfade (örn. "3 + 4 × ( 2 − 1 )")
 * @param {() => string} [getError] - Hata mesajı
 * @returns {string | null} Sonuç veya null / hata
 */
export function evalExpression(str, getError) {
  const s = str.replace(/\s+/g, ' ').trim()
  if (!s) return null
  try {
    const tokens = s.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
    const parseNum = (i) => {
      if (i >= tokens.length) return [null, i]
      const t = tokens[i]
      if (t === '(') {
        const [v, j] = parseExpr(i + 1)
        if (v === null || tokens[j] !== ')') return [null, i]
        return [v, j + 1]
      }
      const n = parseFloat(t)
      if (!Number.isNaN(n)) return [n, i + 1]
      return [null, i]
    }
    const parseMul = (i) => {
      let [v, j] = parseNum(i)
      if (v === null) return [null, i]
      while (j < tokens.length && (tokens[j] === '×' || tokens[j] === '÷')) {
        const op = tokens[j]
        const [b, k] = parseNum(j + 1)
        if (b === null) return [null, j]
        v = op === '×' ? v * b : b === 0 ? (getError ? getError() : null) : v / b
        if (typeof v === 'string') return [v, k]
        j = k
      }
      return [v, j]
    }
    const parseExpr = (i) => {
      let [v, j] = parseMul(i)
      if (v === null) return [null, i]
      while (j < tokens.length && (tokens[j] === '+' || tokens[j] === '−')) {
        const op = tokens[j]
        const [b, k] = parseMul(j + 1)
        if (b === null) return [null, j]
        v = op === '+' ? v + b : v - b
        if (typeof v === 'string') return [v, k]
        j = k
      }
      return [v, j]
    }
    const [val, end] = parseExpr(0)
    if (end !== tokens.length || val === null) return null
    return typeof val === 'string' ? val : String(val)
  } catch {
    return null
  }
}

/**
 * Ekranda gösterilecek değeri biçimlendirir (NaN, Infinity, uzun ondalık).
 * @param {string} num - Gösterilecek değer
 * @returns {string}
 */
export function formatDisplay(num) {
  const s = String(num)
  const n = parseFloat(s)
  if (Number.isNaN(n) || !Number.isFinite(n)) return s
  if (s.length > 12 && s.includes('.')) return n.toExponential(6)
  return s
}

/**
 * Rakam veya ondalık nokta girildiğinde yeni ekran değerini döndürür.
 * @param {string} currentDisplay - Mevcut ekran
 * @param {string} key - '0'-'9' veya '.'
 * @param {boolean} nextReplacesDisplay - Bir sonraki giriş ekranı değiştirsin mi
 * @returns {string} Yeni ekran değeri
 */
export function getNextDisplayForInput(currentDisplay, key, nextReplacesDisplay) {
  if (nextReplacesDisplay) return key === '.' ? '0.' : key
  if (key === '.') {
    if (currentDisplay.includes('.')) return currentDisplay
    return currentDisplay === '0' ? '0.' : currentDisplay + '.'
  }
  if (key === '0' && currentDisplay === '0') return currentDisplay
  if (currentDisplay === '0' && key !== '.') return key
  return currentDisplay + key
}

/**
 * Backspace sonrası ekran değerini döndürür.
 * @param {string} currentDisplay - Mevcut ekran
 * @returns {string}
 */
export function getDisplayAfterBackspace(currentDisplay) {
  if (currentDisplay.length <= 1) return '0'
  return currentDisplay.slice(0, -1)
}

/**
 * Hata sonucu mu kontrolü (display veya eval sonucu için).
 * @param {string} value - Kontrol edilecek değer
 * @param {string} errorMessage - Uygulama hata mesajı (t('calcError'))
 * @returns {boolean}
 */
export function isErrorResult(value, errorMessage) {
  return value === errorMessage || value === ERROR_KEY
}
