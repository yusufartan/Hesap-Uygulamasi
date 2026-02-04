import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, Button, IconButton, Tooltip, useTheme, alpha, InputAdornment, ToggleButton, ToggleButtonGroup, Dialog, DialogContent, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney' // Para birimi ikonu
import PercentIcon from '@mui/icons-material/Percent'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CalculateIcon from '@mui/icons-material/Calculate'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import Numpad from '../../components/Numpad/Numpad'
import { Helmet } from 'react-helmet-async'
import { calculateLoan, calculateInvestment } from './financeUtils.js'
import { useTranslation } from '../../hooks/useTranslation'

const formatNumber = (num) => {
  if (!num) return ''
  if (/[+\-*/]/.test(num)) return num
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join('.')
}

const unformatNumber = (num) => {
  return num.toString().replace(/,/g, '')
}

export default function FinanceCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State Tanımlamaları
  const [mode, setMode] = useState('loan') // 'loan' | 'investment'
  const [investmentType, setInvestmentType] = useState('onetime') // 'onetime' | 'recurring'
  const [amount, setAmount] = useState(() => localStorage.getItem('finance_amount') || '')
  const [rate, setRate] = useState(() => localStorage.getItem('finance_rate') || '')
  
  // Süre için Yıl ve Ay
  const [years, setYears] = useState(1)
  const [months, setMonths] = useState(0)
  const [openPicker, setOpenPicker] = useState(false)
  
  const [activeField, setActiveField] = useState('amount') // 'amount' | 'rate' | 'term'
  const [result, setResult] = useState(null)
  const [showNumpad, setShowNumpad] = useState(false)

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('finance_amount', amount)
    localStorage.setItem('finance_rate', rate)
  }, [amount, rate])

  const handleClear = () => {
    setAmount('')
    setRate('')
    setYears(1)
    setMonths(0)
    setResult(null)
    setActiveField('amount')
  }

  const handleCalculate = () => {
    const totalMonths = years * 12 + months
    if (mode === 'loan') {
      const res = calculateLoan(unformatNumber(amount), rate, totalMonths)
      setResult(res)
    } else {
      const res = calculateInvestment(unformatNumber(amount), rate, totalMonths, investmentType)
      setResult(res)
    }
  }

  // Klavye Girişi İçin Handlerlar
  const handleInputChange = (setter, isFormatted = false) => (e) => {
    const val = e.target.value
    if (val.startsWith('.')) return
    if (/^[0-9.,]*$/.test(val)) {
      if (isFormatted) {
        const raw = val.replace(/,/g, '')
        setter(formatNumber(raw))
      } else {
        setter(val)
      }
    }
  }

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode)
      setResult(null)
    }
  }

  const handleInvestmentTypeChange = (event, newType) => {
    if (newType !== null) {
      setInvestmentType(newType)
      setResult(null)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('finance')} | {t('appTitle')}</title>
        <meta name="description" content={t('financeDesc')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/finance" />
        <meta property="og:title" content={`${t('finance')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('financeDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/finance" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '3rem' } }}>
          {t('finance')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('financeDesc')}
        </Typography>
        <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>
          {t('reset')}
        </Button>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* Sol Taraf: Girişler */}
        <Grid size={{ xs: 12, md: showNumpad ? 7 : 12 }}> {/* Card padding responsive */}
          <Card elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, position: 'relative', bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton onClick={() => setShowNumpad((v) => !v)} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            {/* Ana Mod Seçimi */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              fullWidth
              sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#1C1C1E' : '#f5f5f5', 
                borderRadius: 2,
                p: 0.5,
                '& .MuiToggleButton-root': {
                  color: 'text.secondary',
                  border: 'none',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.mode === 'dark' ? '#3a3a3c' : '#fff',
                    color: '#FF8C00',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#3a3a3c' : '#fff' }
                  }
                }
              }}
            >
              <ToggleButton value="loan">{t('loan')}</ToggleButton>
              <ToggleButton value="investment">{t('investment')}</ToggleButton>
            </ToggleButtonGroup>

            {/* Yatırım Türü Seçimi (Sadece Yatırım Modunda) */}
            {mode === 'investment' && (
              <ToggleButtonGroup
                value={investmentType}
                exclusive
                onChange={handleInvestmentTypeChange}
                fullWidth
                size="small"
                sx={{ 
                  bgcolor: 'transparent',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 2,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    '&.Mui-selected': {
                      bgcolor: alpha('#FF8C00', 0.1),
                      color: '#FF8C00',
                      '&:hover': { bgcolor: alpha('#FF8C00', 0.2) }
                    }
                  }
                }}
              >
                <ToggleButton value="onetime">{t('oneTime')}</ToggleButton>
                <ToggleButton value="recurring">{t('recurring')}</ToggleButton>
              </ToggleButtonGroup>
            )}

            {/* Miktar */}
            <Box onClick={() => setActiveField('amount')} sx={{ cursor: 'pointer', p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${activeField === 'amount' ? alpha('#FF8C00', 0.5) : 'transparent'}` }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {mode === 'loan' ? t('loanAmount') : (investmentType === 'onetime' ? t('investmentAmount') : t('monthlyInvestment'))}
              </Typography>
              <TextField
                fullWidth
                value={amount}
                onChange={handleInputChange(setAmount, true)}
                onFocus={() => setActiveField('amount')}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={{ color: activeField === 'amount' ? '#FF8C00' : 'text.disabled' }} /></InputAdornment>,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 'bold', color: activeField === 'amount' ? '#FF8C00' : 'text.primary' }
                }}
              />
            </Box>

            {/* Faiz ve Süre */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box onClick={() => setActiveField('rate')} sx={{ flex: 1, cursor: 'pointer', p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${activeField === 'rate' ? alpha(theme.palette.primary.main, 0.5) : 'transparent'}` }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">{t('interestRate')}</Typography>
                <TextField
                  fullWidth
                  value={rate}
                  onChange={handleInputChange(setRate)}
                  onFocus={() => setActiveField('rate')}
                  placeholder="0"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true, // responsive font size
                    endAdornment: <InputAdornment position="end"><PercentIcon fontSize="small" /></InputAdornment>,
                    sx: { fontSize: { xs: '1.2rem', md: '1.5rem' }, fontWeight: 'bold' }
                  }}
                />
              </Box>

              <Box onClick={() => setOpenPicker(true)} sx={{ flex: 1, cursor: 'pointer', p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5), display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> {/* responsive font size */}
                <Typography variant="caption" color="text.secondary" fontWeight="bold">{t('duration')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* responsive font size */}
                  <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>{years} {t('years')} {months} {t('months')}</Typography>
                  <CalendarMonthIcon fontSize="small" color="action" sx={{ ml: 'auto' }} />
                </Box>
              </Box>
            </Box>

            {/* Hesapla Butonu */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCalculate}
              startIcon={<CalculateIcon />}
              sx={{ 
                mt: 1, // responsive font size
                bgcolor: '#FF8C00', 
                color: '#fff', // responsive font size
                borderRadius: 3, 
                height: 56,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#e67e00' }
              }}
            >
              {t('calculate')}
            </Button>

            {/* Sonuç Gösterimi */}
            {result && (
              <Box sx={{ mt: 2, p: 3, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? '#1C1C1E' : '#263238', color: '#fff', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {mode === 'loan' ? t('monthlyPayment') : t('totalValue')}
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#FF8C00', my: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                  {mode === 'loan' ? result.monthlyPayment : result.totalValue}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ opacity: 0.5, display: 'block' }}>{t('totalInterest')}</Typography>
                    <Typography variant="body1" fontWeight="bold">{result.totalInterest}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ opacity: 0.5, display: 'block' }}>{mode === 'loan' ? t('totalPayment') : t('totalInvested')}</Typography>
                    <Typography variant="body1" fontWeight="bold">{mode === 'loan' ? result.totalPayment : result.totalInvested}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Sağ Taraf: Numpad (gizli varsayılan) */}
        {showNumpad && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Numpad
              layout="simple"
              onKeyPress={(key) => {
                let currentVal, setVal
                if (activeField === 'amount') { currentVal = amount; setVal = setAmount }
                else { currentVal = rate; setVal = setRate }
                const rawVal = activeField === 'amount' ? unformatNumber(currentVal) : currentVal
                if (key === 'DEL') {
                  const newVal = rawVal.toString().slice(0, -1)
                  setVal(activeField === 'amount' ? formatNumber(newVal) : newVal)
                } else if (key === '.') {
                  if (!rawVal.toString().includes('.')) setVal(activeField === 'amount' ? formatNumber(rawVal + '.') : rawVal + '.')
                } else {
                  setVal(activeField === 'amount' ? formatNumber(rawVal.toString() + key) : rawVal.toString() + key)
                }
              }}
            />
          </Grid>
        )}
      </Grid>

      {/* Custom Duration Picker Dialog */}
      <Dialog open={openPicker} onClose={() => setOpenPicker(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', gap: 4, height: { xs: 250, md: 300 } }}>
          <Box sx={{ width: 100, overflow: 'auto' }}>
            <Typography align="center" fontWeight="bold" gutterBottom>{t('years')}</Typography>
            <List>
              {[...Array(31).keys()].map((y) => (
                <ListItem key={y} disablePadding>
                  <ListItemButton 
                    selected={years === y} 
                    onClick={() => setYears(y)}
                    sx={{ justifyContent: 'center', borderRadius: 2, '&.Mui-selected': { color: '#FF8C00', bgcolor: alpha('#FF8C00', 0.1) }, '& .MuiListItemText-primary': { fontSize: { xs: '0.9rem', md: '1rem' } } }}
                  >
                    <ListItemText primary={y} primaryTypographyProps={{ align: 'center', fontWeight: years === y ? 'bold' : 'normal' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ width: 100, overflow: 'auto' }}>
            <Typography align="center" fontWeight="bold" gutterBottom>{t('months')}</Typography>
            <List>
              {[...Array(12).keys()].map((m) => (
                <ListItem key={m} disablePadding>
                  <ListItemButton 
                    selected={months === m} 
                    onClick={() => setMonths(m)}
                    sx={{ justifyContent: 'center', borderRadius: 2, '&.Mui-selected': { color: '#FF8C00', bgcolor: alpha('#FF8C00', 0.1) }, '& .MuiListItemText-primary': { fontSize: { xs: '0.9rem', md: '1rem' } } }}
                  >
                    <ListItemText primary={m} primaryTypographyProps={{ align: 'center', fontWeight: months === m ? 'bold' : 'normal' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <Button onClick={() => setOpenPicker(false)} sx={{ m: 2 }}>Tamam</Button>
      </Dialog>

    </Container>
  )
}
