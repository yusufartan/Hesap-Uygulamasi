import axios from 'axios'
import { API_ENDPOINTS } from '../../utils/apiConfig'

const API_URL = API_ENDPOINTS.CURRENCY

// API çalışmazsa kullanılacak yedek liste (Graceful Degradation)
const FALLBACK_CURRENCIES = [
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'RUB', name: 'Russian Ruble' }
]

// Mevcut para birimlerini getir
export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(`${API_URL}/currencies`)
    // API { USD: "United States Dollar", ... } dönüyor, biz bunu diziye çevirelim
    return Object.entries(response.data).map(([code, name]) => ({
      code,
      name
    }))
  } catch (error) {
    console.warn('API erişim hatası, yedek liste kullanılıyor:', error)
    // Hata fırlatmak yerine yedek listeyi döndürerek uygulamanın çökmesini engelliyoruz
    return FALLBACK_CURRENCIES
  }
}

// Çeviri yap
export const convertCurrency = async (amount, from, to) => {
  if (!amount || from === to) return amount
  
  try {
    const response = await axios.get(`${API_URL}/latest`, {
      params: { amount, from, to }
    })
    return response.data.rates[to]
  } catch (error) {
    console.error('Çeviri hatası:', error)
    throw new Error('Çeviri işlemi sırasında bir hata oluştu.')
  }
}