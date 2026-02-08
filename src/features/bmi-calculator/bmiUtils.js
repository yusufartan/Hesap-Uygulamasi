export const validateBmiInput = (name, value) => {
  const num = parseFloat(value)
  if (!value) return ''
  if (name === 'age' && (num < 1 || num > 120)) return '1-120 arası giriniz'
  if (name === 'height' && (num < 50 || num > 300)) return '50-300 cm arası giriniz'
  if (name === 'weight' && (num < 10 || num > 600)) return '10-600 kg arası giriniz'
  return ''
}

export const calculateBmi = (height, weight) => {
  if (!height || !weight) return null

  const h = parseFloat(height) / 100
  const w = parseFloat(weight)
  const bmi = w / (h * h)
  
  let status = ''
  let color = ''
  
  if (bmi < 18.5) { 
    status = 'Zayıf'
    color = '#29b6f6' // Light Blue
  } else if (bmi >= 18.5 && bmi < 24) { 
    status = 'Normal'
    color = '#66bb6a' // Green
  } else if (bmi >= 24 && bmi < 28) { 
    status = 'Kilolu'
    color = '#ffa726' // Orange
  } else { 
    status = 'Obez'
    color = '#ef5350' // Red
  }

  return { value: bmi.toFixed(1), status, color }
}

export const getIndicatorPosition = (bmiValue) => {
  const min = 15
  const max = 35
  let percent = ((parseFloat(bmiValue) - min) / (max - min)) * 100
  if (percent < 0) percent = 0
  if (percent > 100) percent = 100
  return percent
}