// c:\VS Code\Projects\Calculator-App\src\features\age-calculator\AgeCalc.jsx
import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, useTheme, alpha, Stack, Button } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Helmet } from 'react-helmet-async'
import { calculateAge } from './ageUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function AgeCalc() {
  const theme = useTheme()
  const { t, language } = useTranslation()

  // State tanımlamaları
  const [birthDate, setBirthDate] = useState(() => {
    return localStorage.getItem('age_birthDate') || ''
  })
  const [todayDate, setTodayDate] = useState(() => {
    return localStorage.getItem('age_todayDate') || new Date().toISOString().split('T')[0]
  })
  
  const [result, setResult] = useState({
    age: { years: 0, months: 0, days: 0 },
    nextBirthday: { months: 0, days: 0, dayName: '-' },
    summary: { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0 }
  })

  // Dil değişince takvim dilini de güncelle
  useEffect(() => {
    dayjs.locale(language)
  }, [language])

  // Tarihler değiştiğinde hesaplama yap
  useEffect(() => {
    if (birthDate && todayDate) {
      const calculatedResult = calculateAge(new Date(birthDate), new Date(todayDate))
      if (calculatedResult) {
        setResult(calculatedResult)
      }
    }
  }, [birthDate, todayDate])

  // Değerleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('age_birthDate', birthDate)
  }, [birthDate])

  useEffect(() => {
    localStorage.setItem('age_todayDate', todayDate)
  }, [todayDate])

  // Temizleme Fonksiyonu
  const handleClear = () => {
    setBirthDate('')
    const defaultToday = new Date().toISOString().split('T')[0]
    setTodayDate(defaultToday)
    setResult({
      age: { years: 0, months: 0, days: 0 },
      nextBirthday: { months: 0, days: 0, dayName: '-' },
      summary: { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0 }
    })
  }

  // Ortak Kart Stili
  const cardStyle = {
    p: 3,
    borderRadius: 4,
    height: '100%',
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1]
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
    <Helmet>
      <title>{t('age')} | {t('appTitle')}</title>
      <meta name="description" content={t('ageDesc')} />
      <link rel="canonical" href="https://site-adresi.com/age" />
      <meta property="og:title" content={`${t('age')} | ${t('appTitle')}`} />
      <meta property="og:description" content={t('ageDesc')} />
      <meta property="og:url" content="https://site-adresi.com/age" />
      <meta property="og:type" content="website" />
    </Helmet>
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
          {t('age')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('ageDesc')}
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

      {/* Tarih Girişleri */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label={t('birthDate')}
            value={birthDate ? dayjs(birthDate) : null}
            onChange={(newValue) => setBirthDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
            slotProps={{ 
              textField: { fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } } } 
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label={t('today')}
            value={todayDate ? dayjs(todayDate) : null}
            onChange={(newValue) => setTodayDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
            slotProps={{ 
              textField: { fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: 3 } } } 
            }}
          />
        </Grid>
      </Grid>

      {/* Ana Sonuç Kartı */}
      <Card elevation={0} sx={{ ...cardStyle, mb: 4, p: 0, overflow: 'hidden' }}>
        <Grid container>
          {/* Sol Taraf: Yaş */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: { md: `1px solid ${theme.palette.divider}` }, borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' } }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>{t('yourAge')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h2" fontWeight="800" color="primary.main" sx={{ fontSize: { xs: '3rem', md: '3.75rem' } }}>
                {result.age.years}
              </Typography>
              <Typography variant="h5" color="text.secondary">{t('years')}</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {result.age.months} {t('months')} | {result.age.days} {t('days')}
            </Typography>
          </Grid>

          {/* Sağ Taraf: Sonraki Doğum Günü */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <CakeIcon color="secondary" />
              <Typography variant="h6" color="text.secondary">{t('nextBirthday')}</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="600" gutterBottom>
              {result.nextBirthday.dayName}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1, color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body1">
                {result.nextBirthday.months} {t('months')} {result.nextBirthday.days} {t('days')} {t('remaining')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {/* Özet Kartı */}
      <Card elevation={0} sx={cardStyle}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          {t('lifeSummary')}
        </Typography>
        <Grid container spacing={3}>
          {[
            { label: t('years'), value: result.summary.years },
            { label: t('months'), value: result.summary.months },
            { label: t('weeks'), value: result.summary.weeks },
            { label: t('days'), value: result.summary.days },
            { label: t('hours'), value: result.summary.hours },
            { label: t('minutes'), value: result.summary.minutes },
          ].map((item, index) => (
            <Grid size={{ xs: 6, sm: 4 }} key={index}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? alpha('#fff', 0.05) : alpha('#000', 0.02) }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight="600">
                  {item.value.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
    </LocalizationProvider>
  )
}
