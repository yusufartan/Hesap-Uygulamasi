import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, Typography, Card, Button, useTheme, alpha, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EventIcon from '@mui/icons-material/Event'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Helmet } from 'react-helmet-async'
import { calculateDateDifference } from './dateUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function DateCalc() {
  const theme = useTheme()
  const { t, language } = useTranslation()
  
  // State tanımlamaları
  const [startDate, setStartDate] = useState(() => {
    const saved = localStorage.getItem('date_startDate')
    return saved ? dayjs(saved) : dayjs()
  })
  const [endDate, setEndDate] = useState(() => {
    const saved = localStorage.getItem('date_endDate')
    return saved ? dayjs(saved) : dayjs().add(1, 'month')
  })
  const [result, setResult] = useState(null)

  // Dil değişince takvim dilini de güncelle
  useEffect(() => {
    dayjs.locale(language)
  }, [language])

  // Tarihler değiştiğinde hesaplama yap
  useEffect(() => {
    const diff = calculateDateDifference(startDate, endDate)
    setResult(diff)
  }, [startDate, endDate])

  // LocalStorage Kayıt
  useEffect(() => {
    if (startDate) localStorage.setItem('date_startDate', startDate.toISOString())
    else localStorage.removeItem('date_startDate')
    
    if (endDate) localStorage.setItem('date_endDate', endDate.toISOString())
    else localStorage.removeItem('date_endDate')
  }, [startDate, endDate])

  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    setResult(null)
  }

  // Ortak Kart Stili
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
      <Helmet>
        <title>{t('date')} | {t('appTitle')}</title>
        <meta name="description" content={t('dateDesc')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/date" />
        <meta property="og:title" content={`${t('date')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('dateDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/date" />
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
            {t('date')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
            {t('dateDesc')}
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

        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={0} sx={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
              
              {/* Tarih Seçiciler */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label={t('startDate')}
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label={t('endDate')}
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                  />
                </Grid>
              </Grid>

              {/* Sonuç Paneli (Fark) */}
              <Box sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#263238' : alpha(theme.palette.primary.main, 0.05),
                borderRadius: 3, 
                p: 4, 
                textAlign: 'center',
                boxShadow: theme.shadows[4],
                color: theme.palette.text.primary
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#ff9800', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t('difference')}
                </Typography>
                
                {result ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4, md: 6 } }}>
                    {[t('years'), t('months'), t('days')].map((label, index) => {
                      const values = [result.years, result.months, result.days]
                      return (
                        <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="h2" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1 }}>
                            {values[index]}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>{label}</Typography>
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <Typography sx={{ opacity: 0.5 }}>{t('enterValue')}</Typography>
                )}
              </Box>

              {/* Alt Özet */}
              {startDate && endDate && startDate.isValid() && endDate.isValid() && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500' }}>
                    {startDate.format('DD MMMM YYYY')} — {endDate.format('DD MMMM YYYY')}
                  </Typography>
                </Box>
              )}

            </Card>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  )
}