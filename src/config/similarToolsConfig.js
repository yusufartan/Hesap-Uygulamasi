/**
 * Benzer araçlar: Her sayfa için "Benzer Hesaplama Araçları" kutusunda
 * gösterilecek araç id'leri. Yeni araç eklemek için buraya id listesi ekleyin;
 * başlık/ikon toolsConfig + çevirilerden gelir.
 */
import { toolsConfig } from './toolsConfig.jsx'

const allTools = toolsConfig.flatMap((c) => c.items || [])

export function getToolById(id) {
  return allTools.find((t) => t.id === id) || null
}

/** Sayfa id'sine göre benzer araç id listesi (kendisi hariç) */
export const similarToolsByPageId = {
  discount: ['finance', 'currency', 'calculator'],
  finance: ['discount', 'currency', 'calculator'],
  currency: ['finance', 'discount', 'calculator'],
  calculator: ['discount', 'finance', 'currency'],
  bmi: ['age', 'date'],
  age: ['bmi', 'date'],
  date: ['age', 'bmi'],
  length: ['area', 'volume', 'mass'],
  area: ['length', 'volume', 'mass'],
  volume: ['length', 'area', 'mass'],
  mass: ['length', 'area', 'volume'],
  speed: ['length', 'temp', 'time'],
  temp: ['length', 'speed', 'time'],
  time: ['date', 'speed', 'temp'],
  data: ['numeral', 'calculator'],
  numeral: ['data', 'calculator'],
}
