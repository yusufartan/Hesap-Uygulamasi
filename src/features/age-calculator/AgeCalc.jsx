// c:\VS Code\Projects\Calculator-App\src\features\age-calculator\AgeCalc.jsx
import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, useTheme, alpha, Stack, Button, IconButton, Dialog, DialogContent } from '@mui/material'
import CakeIcon from '@mui/icons-material/Cake'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Helmet } from 'react-helmet-async'
import { calculateAge } from './ageUtils'
import { useTranslation } from '../../hooks/useTranslation'
import { parseDayMonthYear, dateToDayMonthYear, digitsOnlyDayMonthYear } from '../../utils/dateInputUtils'

const DEFAULT_RESULT = {
  age: { years: 0, months: 0, days: 0 },
  nextBirthday: { months: 0, days: 0, dayName: '-' },
  summary: { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0 },
}

function parseStoredDate(stored) {
  if (!stored) return { day: '', month: '', year: '' }
  const d = new Date(stored)
  if (Number.isNaN(d.getTime())) return { day: '', month: '', year: '' }
  return dateToDayMonthYear(d)
}

export default function AgeCalc() {
  const theme = useTheme()
  const { t, language } = useTranslation()

  const storedBirth = localStorage.getItem('age_birthDate')
  const storedToday = localStorage.getItem('age_todayDate')

  const [birthDay, setBirthDay] = useState(() => parseStoredDate(storedBirth).day)
  const [birthMonth, setBirthMonth] = useState(() => parseStoredDate(storedBirth).month)
  const [birthYear, setBirthYear] = useState(() => parseStoredDate(storedBirth).year)

  const [todayDay, setTodayDay] = useState(() => {
    const parsed = parseStoredDate(storedToday || new Date().toISOString().split('T')[0])
    return parsed.day || String(new Date().getDate())
  })
  const [todayMonth, setTodayMonth] = useState(() => {
    const parsed = parseStoredDate(storedToday || new Date().toISOString().split('T')[0])
    return parsed.month || String(new Date().getMonth() + 1)
  })
  const [todayYear, setTodayYear] = useState(() => {
    const parsed = parseStoredDate(storedToday || new Date().toISOString().split('T')[0])
    return parsed.year || String(new Date().getFullYear())
  })

  const [result, setResult] = useState(DEFAULT_RESULT)
  const [birthPickerOpen, setBirthPickerOpen] = useState(false)
  const [todayPickerOpen, setTodayPickerOpen] = useState(false)

  useEffect(() => {
    dayjs.locale(language)
  }, [language])

  const birthDate = parseDayMonthYear(birthDay, birthMonth, birthYear)
  const todayDate = parseDayMonthYear(todayDay, todayMonth, todayYear)

  useEffect(() => {
    if (birthDate && todayDate) {
      const calculated = calculateAge(birthDate, todayDate)
      if (calculated) setResult(calculated)
    } else {
      setResult(DEFAULT_RESULT)
    }
  }, [birthDay, birthMonth, birthYear, todayDay, todayMonth, todayYear])

  useEffect(() => {
    if (birthDate) localStorage.setItem('age_birthDate', birthDate.toISOString().split('T')[0])
  }, [birthDay, birthMonth, birthYear])

  useEffect(() => {
    if (todayDate) localStorage.setItem('age_todayDate', todayDate.toISOString().split('T')[0])
  }, [todayDay, todayMonth, todayYear])

  const handleClear = () => {
    setBirthDay('')
    setBirthMonth('')
    setBirthYear('')
    const d = new Date()
    setTodayDay(String(d.getDate()))
    setTodayMonth(String(d.getMonth() + 1))
    setTodayYear(String(d.getFullYear()))
    setResult(DEFAULT_RESULT)
  }

  const setBirthFromDate = (date) => {
    if (!date) return
    const d = new Date(date)
    setBirthDay(String(d.getDate()))
    setBirthMonth(String(d.getMonth() + 1))
    setBirthYear(String(d.getFullYear()))
    setBirthPickerOpen(false)
  }

  const setTodayFromDate = (date) => {
    if (!date) return
    const d = new Date(date)
    setTodayDay(String(d.getDate()))
    setTodayMonth(String(d.getMonth() + 1))
    setTodayYear(String(d.getFullYear()))
    setTodayPickerOpen(false)
  }

  const cardStyle = {
    p: { xs: 2, md: 3 },
    borderRadius: 4,
    height: '100%',
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
  }

  const renderDateFields = (day, month, year, setDay, setMonth, setYear, onOpenPicker, label) => (
    <Card elevation={0} sx={{ ...cardStyle, p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label={t('days')}
          placeholder="31"
          value={day}
          onChange={(e) => setDay(digitsOnlyDayMonthYear(e.target.value, 'day'))}
          inputProps={{ inputMode: 'numeric', maxLength: 2 }}
          size="small"
          sx={{ width: 72 }}
        />
        <TextField
          label={t('months')}
          placeholder="12"
          value={month}
          onChange={(e) => setMonth(digitsOnlyDayMonthYear(e.target.value, 'month'))}
          inputProps={{ inputMode: 'numeric', maxLength: 2 }}
          size="small"
          sx={{ width: 72 }}
        />
        <TextField
          label={t('years')}
          placeholder="1990"
          value={year}
          onChange={(e) => setYear(digitsOnlyDayMonthYear(e.target.value, 'year'))}
          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
          size="small"
          sx={{ width: 88 }}
        />
        <IconButton onClick={onOpenPicker} color="primary" title={t('birthDate')} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
          <CalendarMonthIcon />
        </IconButton>
      </Box>
    </Card>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
      <Helmet>
        <title>{t('age')} | {t('appTitle')}</title>
        <meta name="description" content={t('ageDesc')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/age" />
        <meta property="og:title" content={`${t('age')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('ageDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/age" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>
          <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            {t('age')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>{t('ageDesc')}</Typography>
          <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>
            {t('reset')}
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            {renderDateFields(birthDay, birthMonth, birthYear, setBirthDay, setBirthMonth, setBirthYear, () => setBirthPickerOpen(true), t('birthDate'))}
            <Dialog open={birthPickerOpen} onClose={() => setBirthPickerOpen(false)} maxWidth="xs" fullWidth>
              <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <DatePicker
                  value={birthDate ? dayjs(birthDate) : null}
                  onChange={(v) => setBirthFromDate(v ? v.toDate() : null)}
                  slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                />
              </DialogContent>
            </Dialog>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {renderDateFields(todayDay, todayMonth, todayYear, setTodayDay, setTodayMonth, setTodayYear, () => setTodayPickerOpen(true), t('today'))}
            <Dialog open={todayPickerOpen} onClose={() => setTodayPickerOpen(false)} maxWidth="xs" fullWidth>
              <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <DatePicker
                  value={todayDate ? dayjs(todayDate) : null}
                  onChange={(v) => setTodayFromDate(v ? v.toDate() : null)}
                  slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>

        <Card elevation={0} sx={{ ...cardStyle, mb: 4, p: 0, overflow: 'hidden' }}>
          <Grid container>
            <Grid size={{ xs: 12, md: 6 }} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: { md: `1px solid ${theme.palette.divider}` }, borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' } }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>{t('yourAge')}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h2" fontWeight="800" color="primary.main" sx={{ fontSize: { xs: '3rem', md: '3.75rem' } }}>
                  {Number.isFinite(result.age.years) ? result.age.years : 0}
                </Typography>
                <Typography variant="h5" color="text.secondary">{t('years')}</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {Number.isFinite(result.age.months) ? result.age.months : 0} {t('months')} | {Number.isFinite(result.age.days) ? result.age.days : 0} {t('days')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <CakeIcon color="secondary" />
                <Typography variant="h6" color="text.secondary">{t('nextBirthday')}</Typography>
              </Stack>
              <Typography variant="h4" fontWeight="600" gutterBottom>{result.nextBirthday.dayName}</Typography>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 1, color: 'text.secondary' }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body1">
                  {Number.isFinite(result.nextBirthday.months) ? result.nextBirthday.months : 0} {t('months')} {Number.isFinite(result.nextBirthday.days) ? result.nextBirthday.days : 0} {t('days')} {t('remaining')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>{t('lifeSummary')}</Typography>
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
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>{item.label}</Typography>
                  <Typography variant="h6" fontWeight="600">
                    {Number.isFinite(item.value) ? item.value.toLocaleString() : 0}
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
