import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  Button,
  useTheme,
  alpha,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PercentIcon from '@mui/icons-material/Percent'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CalculateIcon from '@mui/icons-material/Calculate'
import DeleteIcon from '@mui/icons-material/Delete'
import SimilarToolsCard from '../../components/common/SimilarToolsCard'
import { calculateLoan, calculateInvestment } from './financeUtils.js'
import { useTranslation } from '../../hooks/useTranslation'

const formatNumber = (num) => {
  if (!num) return ''
  if (/[+\-*/]/.test(num)) return num
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const unformatNumber = (num) => {
  return num.toString().replace(/,/g, '')
}

const PRESET_RATES = [5, 10, 15, 20]
const QUICK_TERM_YEARS = [1, 3, 5]

export default function FinanceCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  const [mode, setMode] = useState('loan')
  const [investmentType, setInvestmentType] = useState('onetime')
  const [amount, setAmount] = useState(() => localStorage.getItem('finance_amount') || '')
  const [rate, setRate] = useState(() => localStorage.getItem('finance_rate') || '')
  const [years, setYears] = useState(1)
  const [months, setMonths] = useState(0)
  const [openPicker, setOpenPicker] = useState(false)
  const [activeField, setActiveField] = useState('amount')
  const [result, setResult] = useState(null)

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

  const applyPresetRate = (r) => setRate(String(r))
  const applyQuickTerm = (y) => {
    setYears(y)
    setMonths(0)
    setOpenPicker(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2, textAlign: 'center', position: 'relative' }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          {t('finance')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 500, mx: 'auto' }}>
          {t('financeDesc')}
        </Typography>
        <Button
          variant="text"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={handleClear}
          sx={{
            position: { md: 'absolute' },
            right: { md: 3 }, // Sidebar ile arasında boşluk (24px)
            top: '50%',
            transform: { md: 'translateY(-50%)' },
            mt: { xs: 1.5, md: 0 },
          }}
        >
          {t('reset')}
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }} sx={{ alignSelf: 'flex-start', minWidth: 0 }}>
          <Card
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              maxWidth: 520,
              width: '100%',
            }}
          >
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              fullWidth
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.5) : '#f5f5f5',
                borderRadius: 2,
                p: 0.5,
                mb: 2,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    boxShadow: 1,
                  },
                },
              }}
            >
              <ToggleButton value="loan">{t('loan')}</ToggleButton>
              <ToggleButton value="investment">{t('investment')}</ToggleButton>
            </ToggleButtonGroup>

            {mode === 'investment' && (
              <ToggleButtonGroup
                value={investmentType}
                exclusive
                onChange={handleInvestmentTypeChange}
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  '& .MuiToggleButton-root': { border: 'none', borderRadius: 2, textTransform: 'none' },
                  '& .Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' },
                }}
              >
                <ToggleButton value="onetime">{t('oneTime')}</ToggleButton>
                <ToggleButton value="recurring">{t('recurring')}</ToggleButton>
              </ToggleButtonGroup>
            )}

            <Box
              onClick={() => setActiveField('amount')}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                border: `1px solid ${activeField === 'amount' ? alpha(theme.palette.primary.main, 0.5) : 'transparent'}`,
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ mb: 0.5 }}>
                {mode === 'loan' ? t('loanAmount') : investmentType === 'onetime' ? t('investmentAmount') : t('monthlyInvestment')}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: activeField === 'amount' ? 'primary.main' : 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  sx: { fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 'bold' },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box
                onClick={() => setActiveField('rate')}
                sx={{
                  flex: '1 1 140px',
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  border: `1px solid ${activeField === 'rate' ? alpha(theme.palette.primary.main, 0.5) : 'transparent'}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ mb: 0.5 }}>
                  {t('interestRate')}
                </Typography>
                <TextField
                  fullWidth
                  value={rate}
                  onChange={handleInputChange(setRate)}
                  onFocus={() => setActiveField('rate')}
                  placeholder="0"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <PercentIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { fontSize: '1.1rem', fontWeight: 'bold' },
                  }}
                />
              </Box>

              <Box
                onClick={() => setOpenPicker(true)}
                sx={{
                  flex: '1 1 140px',
                  cursor: 'pointer',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ mb: 0.5 }}>
                  {t('duration')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {years} {t('years')} {months} {t('months')}
                  </Typography>
                  <CalendarMonthIcon fontSize="small" color="action" sx={{ ml: 'auto' }} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                {t('quickSelect')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {PRESET_RATES.map((r) => (
                  <Button
                    key={r}
                    size="small"
                    variant={rate === String(r) ? 'contained' : 'outlined'}
                    onClick={() => applyPresetRate(r)}
                    sx={{ minWidth: 56 }}
                  >
                    %{r}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
                {t('duration')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {QUICK_TERM_YEARS.map((y) => (
                  <Button
                    key={y}
                    size="small"
                    variant={years === y && months === 0 ? 'contained' : 'outlined'}
                    onClick={() => applyQuickTerm(y)}
                    sx={{ minWidth: 56 }}
                  >
                    {y} {t('years')}
                  </Button>
                ))}
                <Button size="small" variant="outlined" onClick={() => setOpenPicker(true)} sx={{ minWidth: 56 }}>
                  …
                </Button>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCalculate}
              startIcon={<CalculateIcon />}
              sx={{
                mt: 2,
                borderRadius: 2,
                height: 48,
                fontWeight: 'bold',
              }}
            >
              {t('calculate')}
            </Button>

            {result && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {mode === 'loan' ? t('monthlyPayment') : t('totalValue')}
                </Typography>
                <Typography variant="h5" fontWeight="700" color="primary.main" sx={{ my: 0.5 }}>
                  {mode === 'loan' ? result.monthlyPayment : result.totalValue}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('totalInterest')}: <strong>{result.totalInterest}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mode === 'loan' ? t('totalPayment') : t('totalInvested')}: <strong>{mode === 'loan' ? result.totalPayment : result.totalInvested}</strong>
                  </Typography>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ alignSelf: 'flex-start', minWidth: 0, display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
          <SimilarToolsCard />
        </Grid>
      </Grid>

      <Dialog open={openPicker} onClose={() => setOpenPicker(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', gap: 4, height: { xs: 250, md: 300 } }}>
          <Box sx={{ width: 100, overflow: 'auto' }}>
            <Typography align="center" fontWeight="bold" gutterBottom>
              {t('years')}
            </Typography>
            <List>
              {[...Array(31).keys()].map((y) => (
                <ListItem key={y} disablePadding>
                  <ListItemButton
                    selected={years === y}
                    onClick={() => setYears(y)}
                    sx={{
                      justifyContent: 'center',
                      borderRadius: 2,
                      '&.Mui-selected': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) },
                    }}
                  >
                    <ListItemText primary={y} primaryTypographyProps={{ align: 'center', fontWeight: years === y ? 'bold' : 'normal' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ width: 100, overflow: 'auto' }}>
            <Typography align="center" fontWeight="bold" gutterBottom>
              {t('months')}
            </Typography>
            <List>
              {[...Array(12).keys()].map((m) => (
                <ListItem key={m} disablePadding>
                  <ListItemButton
                    selected={months === m}
                    onClick={() => setMonths(m)}
                    sx={{
                      justifyContent: 'center',
                      borderRadius: 2,
                      '&.Mui-selected': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) },
                    }}
                  >
                    <ListItemText primary={m} primaryTypographyProps={{ align: 'center', fontWeight: months === m ? 'bold' : 'normal' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <Button onClick={() => setOpenPicker(false)} sx={{ m: 2 }}>
          {t('ok')}
        </Button>
      </Dialog>
    </Container>
  )
}
