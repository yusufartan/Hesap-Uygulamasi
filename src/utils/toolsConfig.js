/**
 * Tüm hesaplama araçlarının tek kaynak listesi.
 * menuItems.jsx ve route tanımları bu listeyle senkron tutulmalı.
 */
export const TOOL_IDS = [
  'dashboard',
  'age',
  'area',
  'bmi',
  'data',
  'date',
  'discount',
  'finance',
  'currency',
  'length',
  'mass',
  'numeral',
  'speed',
  'temp',
  'time',
  'volume',
]

export const TOOLS_CONFIG = TOOL_IDS.map((id) => {
  const paths = {
    dashboard: '/',
    age: '/age',
    area: '/area',
    bmi: '/bmi',
    data: '/data',
    date: '/date',
    discount: '/discount',
    finance: '/finance',
    currency: '/currency',
    length: '/length',
    mass: '/mass',
    numeral: '/numeral',
    speed: '/speed',
    temp: '/temp',
    time: '/time',
    volume: '/volume',
  }
  return { id, path: paths[id] }
})

export const TOOLS_COUNT = TOOL_IDS.length
