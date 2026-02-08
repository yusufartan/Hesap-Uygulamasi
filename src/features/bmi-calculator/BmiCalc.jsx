import React, { useState } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, Button, useTheme, alpha, IconButton, Divider } from '@mui/material'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import CalculateIcon from '@mui/icons-material/Calculate'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { validateBmiInput, calculateBmi, getIndicatorPosition } from './bmiUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function BmiCalc() {
  const theme = useTheme()
  const { t } = useTranslation()
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('male')
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({ age: '', height: '', weight: '' })

  const handleInputChange = (setter, name) => (e) => {
    const val = e.target.value

    // Nokta ile başlamasını engelle
    if (val.startsWith('.')) return

    // Sadece sayı ve nokta girişine izin ver (Harf ve kelime girişini engelle)
    if (!/^\d*\.?\d*$/.test(val)) return

    setter(val)
    setErrors(prev => ({ ...prev, [name]: validateBmiInput(name, val) }))
  }

  const handleClear = () => {
    setAge('')
    setHeight('')
    setWeight('')
    setGender('male')
    setResult(null)
    setErrors({ age: '', height: '', weight: '' })
  }

  const handleCalculate = () => {
    const ageErr = !age ? t('enterValue') : validateBmiInput('age', age)
    const heightErr = !height ? t('enterValue') : validateBmiInput('height', height)
    const weightErr = !weight ? t('enterValue') : validateBmiInput('weight', weight)

    setErrors({ age: ageErr, height: heightErr, weight: weightErr })

    if (ageErr || heightErr || weightErr) return

    if (height && weight) {
      const result = calculateBmi(height, weight)
      setResult(result)
    }
  }

  // AreaCalc ile ortak kart stili
  const cardStyle = {
    p: { xs: 2, md: 4 },
    borderRadius: 5,
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    height: '100%',
    transition: 'transform 0.3s ease',
  }

  // AreaCalc benzeri input kutusu stili
  const inputBoxStyle = {
    p: 2,
    borderRadius: 4,
    bgcolor: alpha(theme.palette.background.default, 0.5),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 1
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>
        <Typography 
          variant="h3" 
          fontWeight="800" 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          {t('bmi')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('bmiDesc')}
        </Typography>
        <Button 
          variant="text" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={handleClear}
          sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}
        >
          {t('reset')}
        </Button>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* Sol Taraf: Girişler */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
            
            {/* Yaş */}
            <Box sx={inputBoxStyle}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('yourAge')}</Typography>
              <TextField
                fullWidth
                value={age}
                onChange={handleInputChange(setAge, 'age')}
                placeholder="25"
                variant="standard"
                error={!!errors.age}
                helperText={errors.age}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: 'text.primary' }
                }}
              />
            </Box>

            {/* Cinsiyet */}
            <Box sx={inputBoxStyle}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('gender')}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <IconButton 
                  onClick={() => setGender('male')}
                  sx={{ 
                    bgcolor: gender === 'male' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    color: gender === 'male' ? 'primary.main' : 'text.secondary',
                    border: `1px solid ${gender === 'male' ? theme.palette.primary.main : alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 3,
                    width: 50, height: 50
                  }}
                >
                  <MaleIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setGender('female')}
                  sx={{ 
                    bgcolor: gender === 'female' ? alpha('#ec4899', 0.1) : 'transparent',
                    color: gender === 'female' ? '#ec4899' : 'text.secondary',
                    border: `1px solid ${gender === 'female' ? '#ec4899' : alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 3,
                    width: 50, height: 50
                  }}
                >
                  <FemaleIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Boy */}
            <Box sx={inputBoxStyle}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('height')}</Typography>
              <TextField
                fullWidth
                value={height}
                onChange={handleInputChange(setHeight, 'height')}
                placeholder="175"
                variant="standard"
                error={!!errors.height}
                helperText={errors.height}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: 'text.primary' }
                }}
              />
            </Box>

            {/* Kilo */}
            <Box sx={inputBoxStyle}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('weight')}</Typography>
              <TextField
                fullWidth
                value={weight}
                onChange={handleInputChange(setWeight, 'weight')}
                placeholder="70"
                variant="standard"
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: 'text.primary' }
                }}
              />
            </Box>

            <Button 
              variant="contained" 
              size="large"
              onClick={handleCalculate}
              startIcon={<CalculateIcon />}
              sx={{ 
                py: { xs: 1.5, md: 2 },
                borderRadius: 4,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              {t('calculate')}
            </Button>

          </Card>
        </Grid>

        {/* Sağ Taraf: Sonuç Paneli */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ ...cardStyle, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha('#fff', 0.6) }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 2
            }}>
              {result ? (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{t('bmiResult')}</Typography>
                  <Typography variant="h1" fontWeight="800" sx={{ color: result.color, mb: 1, fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem' } }}>
                    {result.value}
                  </Typography>
                  <Typography variant="h4" fontWeight="600" sx={{ color: result.color, mb: 2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                    {t(result.status === 'Zayıf' ? 'underweight' : result.status === 'Normal' ? 'normal' : result.status === 'Kilolu' ? 'overweight' : 'obese')}
                  </Typography>

                  {/* Özel Gauge Bar */}
                  <Box sx={{ width: '100%', position: 'relative', mt: 2, px: 2, mb: 4 }}>
                    {/* Renkli Bar */}
                    <Box sx={{ 
                      height: 16, 
                      borderRadius: 8, 
                      background: 'linear-gradient(90deg, #29b6f6 0%, #66bb6a 33%, #ffa726 66%, #ef5350 100%)',
                      width: '100%',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                    
                    {/* Gösterge Oku */}
                    <Box sx={{
                      position: 'absolute',
                      top: -12,
                      left: `${getIndicatorPosition(result.value)}%`,
                      transform: 'translateX(-50%)',
                      transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        width: 0, 
                        height: 0, 
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: `12px solid ${theme.palette.text.primary}`,
                        mb: 0.5,
                        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
                      }} />
                    </Box>

                    {/* Etiketler */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, color: 'text.secondary', fontSize: '0.85rem', fontWeight: 500 }}>
                      <span>15</span>
                      <span>18.5</span>
                      <span>24</span>
                      <span>28</span>
                      <span>35</span>
                    </Box>
                  </Box>

                  {/* Kategoriler (Legend) */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {[
                      { label: t('underweight'), color: '#29b6f6' },
                      { label: t('normal'), color: '#66bb6a' },
                      { label: t('overweight'), color: '#ffa726' },
                      { label: t('obese'), color: '#ef5350' }
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2, width: '100%' }} />

                  {/* Analiz Bölümü */}
                  <Box sx={{ width: '100%', textAlign: 'left', px: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{t('analysis')}</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">{t('height')}</Typography>
                      <Typography variant="body2" fontWeight="600">{height}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">{t('suggestedWeight')}</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {(() => {
                          const h = parseFloat(height) / 100
                          const min = (18.5 * h * h).toFixed(1)
                          const max = (24.9 * h * h).toFixed(1)
                          return `${min} - ${max} kg`
                        })()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                  <CalculateIcon sx={{ fontSize: 80, mb: 2, color: 'text.secondary' }} />
                  <Typography variant="h6" color="text.secondary">{t('enterValue')}</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}