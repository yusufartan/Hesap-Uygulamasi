// Basit matematiksel ifadeleri güvenli bir şekilde hesaplar
export const safeEvaluate = (expression) => {
  try {
    if (/[^0-9+\-*/. ]/.test(expression)) return parseFloat(expression)
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + expression + ')')()
  } catch (e) {
    return parseFloat(expression)
  }
}

export const calculateLoan = (amount, rate, term) => {
  const p = parseFloat(amount)
  const r = parseFloat(rate)
  const n = parseFloat(term)

  if (!p || !r || !n) return null

  // Aylık faiz oranı (yüzde / 100)
  const i = r / 100
  
  // BSMV ve KKDF gibi vergiler hariç basit kredi hesaplama formülü
  // Taksit = P * [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
  
  let monthlyPayment
  if (i === 0) {
      monthlyPayment = p / n
  } else {
      monthlyPayment = p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
  }

  const totalPayment = monthlyPayment * n
  const totalInterest = totalPayment - p

  // Para birimi formatı
  const format = (num) => {
    return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return {
    monthlyPayment: format(monthlyPayment),
    totalPayment: format(totalPayment),
    totalInterest: format(totalInterest)
  }
}

export const calculateInvestment = (amount, rate, totalMonths, type = 'onetime') => {
  const p = parseFloat(amount)
  const r = parseFloat(rate)
  const n = parseFloat(totalMonths)

  if (!p || !r || !n) return null

  let totalValue = 0
  const monthlyRate = (r / 100) / 12

  if (type === 'onetime') {
    // Tek Seferlik Yatırım (Bileşik Faiz)
    totalValue = p * Math.pow(1 + monthlyRate, n)
  } else {
    // Yinelenen Yatırım (Aylık Ekleme - Dönem Sonu)
    totalValue = p * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
  }

  const totalInvested = type === 'onetime' ? p : p * n
  const totalInterest = totalValue - totalInvested

  const format = (num) => {
    return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return {
    totalValue: format(totalValue),
    totalInterest: format(totalInterest),
    totalInvested: format(totalInvested)
  }
}
