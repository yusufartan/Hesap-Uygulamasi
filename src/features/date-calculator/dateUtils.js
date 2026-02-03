import dayjs from 'dayjs'

export const calculateDateDifference = (start, end) => {
  if (!start || !end) return null
  
  const date1 = dayjs(start)
  const date2 = dayjs(end)

  if (!date1.isValid() || !date2.isValid()) return null

  // Küçük tarihi başa al (Mutlak fark hesaplamak için)
  const [startDate, endDate] = date1.isAfter(date2) ? [date2, date1] : [date1, date2]

  let years = endDate.year() - startDate.year()
  let months = endDate.month() - startDate.month()
  let days = endDate.date() - startDate.date()

  if (days < 0) {
    months--
    // Bitiş tarihinden bir önceki ayın gün sayısını alıp ekle
    const prevMonth = endDate.subtract(1, 'month')
    days += prevMonth.daysInMonth()
  }

  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}