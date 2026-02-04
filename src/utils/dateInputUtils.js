/**
 * Gün / Ay / Yıl metin alanlarından geçerli tarih üretir.
 * Eksik veya geçersiz girişte null döner; böylece diğer alanlar silinmez ve NaN oluşmaz.
 */

export function parseDayMonthYear(dayStr, monthStr, yearStr) {
  const d = parseInt(dayStr, 10)
  const m = parseInt(monthStr, 10)
  const y = parseInt(yearStr, 10)
  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null
  if (m < 1 || m > 12 || y < 1900 || y > 2100) return null
  const lastDay = new Date(y, m, 0).getDate()
  if (d < 1 || d > lastDay) return null
  return new Date(y, m - 1, d)
}

/** Tarihi gün, ay, yıl string'lerine böler (1-based ay). */
export function dateToDayMonthYear(date) {
  if (!date) return { day: '', month: '', year: '' }
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return { day: '', month: '', year: '' }
  return {
    day: String(d.getDate()),
    month: String(d.getMonth() + 1),
    year: String(d.getFullYear()),
  }
}

/** Sadece rakam kabul eder; gün/ay 2, yıl 4 karakter. */
export function digitsOnlyDayMonthYear(value, type) {
  const digits = value.replace(/\D/g, '')
  if (type === 'year') return digits.slice(0, 4)
  return digits.slice(0, 2)
}
