import axios from 'axios'

const API_URL = 'https://api.frankfurter.app'

// API çalışmazsa kullanılacak yedek liste
export const FALLBACK_CURRENCIES = [
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Renminbi Yuan' },
  // ... diğerleri (listenin kalanı aynı kalabilir)
]

// Mevcut para birimlerini getir
export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(`${API_URL}/currencies`)
    return Object.entries(response.data).map(([code, name]) => ({
      code,
      name
    }))
  } catch (error) {
    console.warn('API hatası, yedek liste:', error)
    return FALLBACK_CURRENCIES
  }
}

// Anlık Çeviri yap (Bu zaten çalışıyordu, koruyoruz)
export const convertCurrency = async (amount, from, to) => {
  if (!amount || from === to) return amount
  try {
    const response = await axios.get(`${API_URL}/latest`, {
      params: { amount, from, to },
    })
    return response.data.rates[to]
  } catch (error) {
    console.error('Çeviri hatası:', error)
    throw error
  }
}

// TARİHSEL VERİ (Grafik İçin - Burayı Tamamen Değiştirdik)
export const fetchHistoricalRates = async (from, to, startDate, endDate) => {
  // Aynı para birimi ise grafik çizme
  if (from === to) return { dates: [], rates: [] }

  try {
    // Frankfurter API formatı: /2024-01-01..2024-01-30?from=USD&to=TRY
    const url = `${API_URL}/${startDate}..${endDate}`
    
    const response = await axios.get(url, {
      params: {
        from: from,
        to: to
      }
    })

    if (!response.data || !response.data.rates) {
      return { dates: [], rates: [] }
    }

    // Gelen veri objesini { tarih: { kur: değer } } diziye çeviriyoruz
    // Örn: { "2024-01-01": { "TRY": 30.5 } } -> date: "2024-01-01", rate: 30.5
    const dates = Object.keys(response.data.rates)
    const rates = dates.map(date => response.data.rates[date][to])

    return { dates, rates }

  } catch (error) {
    console.warn('Geçmiş veri alınamadı:', error)
    return { dates: [], rates: [] }
  }
}