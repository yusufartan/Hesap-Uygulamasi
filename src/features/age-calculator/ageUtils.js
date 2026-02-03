export const calculateAge = (birth, current) => {
  if (birth > current) {
    // Gelecek tarih seçilirse hesaplama yapma
    return null
  }

  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"]

  // 1. Yaş Hesabı
  let yearDiff = current.getFullYear() - birth.getFullYear()
  let monthDiff = current.getMonth() - birth.getMonth()
  let dayDiff = current.getDate() - birth.getDate()

  if (dayDiff < 0) {
    monthDiff--
    const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0)
    dayDiff += prevMonth.getDate()
  }

  if (monthDiff < 0) {
    yearDiff--
    monthDiff += 12
  }

  // 2. Sonraki Doğum Günü Hesabı
  // Saat farklarından etkilenmemek için tarihleri saat 00:00'a sabitleyelim
  const currentReset = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  let nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate())
  
  if (currentReset > nextBirthday) {
    nextBirthday.setFullYear(current.getFullYear() + 1)
  }

  // Takvim bazlı kesin hesaplama (30.44 sabiti yerine)
  let monthsUntilNext = nextBirthday.getMonth() - currentReset.getMonth()
  let daysRemaining = nextBirthday.getDate() - currentReset.getDate()

  if (daysRemaining < 0) {
    monthsUntilNext -= 1
    // Şu anki ayın kaç gün çektiğini bulup ekleyelim
    const daysInCurrentMonth = new Date(currentReset.getFullYear(), currentReset.getMonth() + 1, 0).getDate()
    daysRemaining += daysInCurrentMonth
  }

  if (monthsUntilNext < 0) {
    monthsUntilNext += 12
  }

  // 3. Özet Hesapları
  const totalMillisecondsLived = current - birth
  const totalDaysLived = Math.floor(totalMillisecondsLived / (1000 * 60 * 60 * 24))
  const totalWeeksLived = Math.floor(totalDaysLived / 7)
  const totalMonthsLived = Math.floor(totalDaysLived / 30.44)
  const totalHoursLived = Math.floor(totalMillisecondsLived / (1000 * 60 * 60))
  const totalMinutesLived = Math.floor(totalMillisecondsLived / (1000 * 60))

  return {
    age: { years: yearDiff, months: monthDiff, days: dayDiff },
    nextBirthday: { 
      months: monthsUntilNext, 
      days: daysRemaining, 
      dayName: dayNames[nextBirthday.getDay()] 
    },
    summary: {
      years: yearDiff,
      months: totalMonthsLived,
      weeks: totalWeeksLived,
      days: totalDaysLived,
      hours: totalHoursLived,
      minutes: totalMinutesLived
    }
  }
}