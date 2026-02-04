import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, Button, useTheme, alpha, IconButton, Dialog, DialogContent } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Helmet } from 'react-helmet-async'
import { calculateDateDifference } from './dateUtils'
import { useTranslation } from '../../hooks/useTranslation'
import { parseDayMonthYear, dateToDayMonthYear, digitsOnlyDayMonthYear } from '../../utils/dateInputUtils'

function parseStoredToDmy(stored) {
  if (!stored) return { day: '', month: '', year: '' }
  const d = new Date(stored)
  if (Number.isNaN(d.getTime())) return { day: '', month: '', year: '' }
  return dateToDayMonthYear(d)
}

export default function DateCalc() {
  const theme = useTheme()
  const { t, language } = useTranslation()

  const savedStart = localStorage.getItem('date_startDate')
  const savedEnd = localStorage.getItem('date_endDate')
  const defaultStart = dayjs()
  const defaultEnd = dayjs().add(1, 'month')

  const [startDay, setStartDay] = useState(() => parseStoredToDmy(savedStart).day || String(defaultStart.date()))
  const [startMonth, setStartMonth] = useState(() => parseStoredToDmy(savedStart).month || String(defaultStart.month() + 1))
  const [startYear, setStartYear] = useState(() => parseStoredToDmy(savedStart).year || String(defaultStart.year()))

  const [endDay, setEndDay] = useState(() => parseStoredToDmy(savedEnd).day || String(defaultEnd.date()))
  const [endMonth, setEndMonth] = useState(() => parseStoredToDmy(savedEnd).month || String(defaultEnd.month() + 1))
  const [endYear, setEndYear] = useState(() => parseStoredToDmy(savedEnd).year || String(defaultEnd.year()))

  const [result, setResult] = useState(null)
  const [startPickerOpen, setStartPickerOpen] = useState(false)
  const [endPickerOpen, setEndPickerOpen] = useState(false)

  useEffect(() => {
    dayjs.locale(language)
  }, [language])

  const startDate = parseDayMonthYear(startDay, startMonth, startYear)
  const endDate = parseDayMonthYear(endDay, endMonth, endYear)

  useEffect(() => {
    const diff = startDate && endDate ? calculateDateDifference(startDate, endDate) : null
    setResult(diff)
  }, [startDay, startMonth, startYear, endDay, endMonth, endYear])

  useEffect(() => {
    if (startDate) localStorage.setItem('date_startDate', startDate.toISOString())
    else localStorage.removeItem('date_startDate')
    if (endDate) localStorage.setItem('date_endDate', endDate.toISOString())
    else localStorage.removeItem('date_endDate')
  }, [startDay, startMonth, startYear, endDay, endMonth, endYear])

  const handleClear = () => {
    setStartDay('')
    setStartMonth('')
    setStartYear('')
    setEndDay('')
    setEndMonth('')
    setEndYear('')
    setResult(null)
  }

  const setStartFromDate = (date) => {
    if (!date) return
    const d = new Date(date)
    setStartDay(String(d.getDate()))
    setStartMonth(String(d.getMonth() + 1))
    setStartYear(String(d.getFullYear()))
    setStartPickerOpen(false)
  }

  const setEndFromDate = (date) => {
    if (!date) return
    const d = new Date(date)
    setEndDay(String(d.getDate()))
    setEndMonth(String(d.getMonth() + 1))
    setEndYear(String(d.getFullYear()))
    setEndPickerOpen(false)
  }

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

  const renderDateFields = (day, month, year, setDay, setMonth, setYear, onOpenPicker, label) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>{label}</Typography>
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
          placeholder="2024"
          value={year}
          onChange={(e) => setYear(digitsOnlyDayMonthYear(e.target.value, 'year'))}
          inputProps={{ inputMode: 'numeric', maxLength: 4 }}
          size="small"
          sx={{ width: 88 }}
        />
        <IconButton onClick={onOpenPicker} color="primary" title={label} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
          <CalendarMonthIcon />
        </IconButton>
      </Box>
    </Box>
  )

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
          <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            {t('date')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>{t('dateDesc')}</Typography>
          <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>
            {t('reset')}
          </Button>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={0} sx={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderDateFields(startDay, startMonth, startYear, setStartDay, setStartMonth, setStartYear, () => setStartPickerOpen(true), t('startDate'))}
                  <Dialog open={startPickerOpen} onClose={() => setStartPickerOpen(false)} maxWidth="xs" fullWidth>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                      <DatePicker
                        value={startDate ? dayjs(startDate) : null}
                        onChange={(v) => setStartFromDate(v ? v.toDate() : null)}
                        slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                      />
                    </DialogContent>
                  </Dialog>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderDateFields(endDay, endMonth, endYear, setEndDay, setEndMonth, setEndYear, () => setEndPickerOpen(true), t('endDate'))}
                  <Dialog open={endPickerOpen} onClose={() => setEndPickerOpen(false)} maxWidth="xs" fullWidth>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                      <DatePicker
                        value={endDate ? dayjs(endDate) : null}
                        onChange={(v) => setEndFromDate(v ? v.toDate() : null)}
                        slotProps={{ actionBar: { actions: ['cancel', 'accept'] } }}
                      />
                    </DialogContent>
                  </Dialog>
                </Grid>
              </Grid>

              <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? '#263238' : alpha(theme.palette.primary.main, 0.05), borderRadius: 3, p: 4, textAlign: 'center', boxShadow: theme.shadows[4], color: theme.palette.text.primary }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#ff9800', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {t('difference')}
                </Typography>
                {result ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4, md: 6 } }}>
                    {[t('years'), t('months'), t('days')].map((label, index) => {
                      const values = [result.years, result.months, result.days]
                      const val = values[index]
                      return (
                        <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography variant="h2" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1 }}>
                            {Number.isFinite(val) ? val : 0}
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

              {startDate && endDate && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'grey.500' }}>
                    {dayjs(startDate).format('DD MMMM YYYY')} — {dayjs(endDate).format('DD MMMM YYYY')}
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
