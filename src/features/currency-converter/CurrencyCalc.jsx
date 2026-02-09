
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  MenuItem,
  Select,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SimilarToolsCard from '../../components/common/SimilarToolsCard'
import { fetchCurrencies, convertCurrency, FALLBACK_CURRENCIES } from './currencyUtils'
import { getCurrencyDisplayName, getCurrencyLabelWithSymbol } from './currencyNames'
import CurrencyChart from './CurrencyChart'
import { useTranslation } from '../../hooks/useTranslation'
import { SELECT_MENU_PROPS } from '../../utils/selectMenuProps'

export default function CurrencyCalc() {
  const theme = useTheme()
  const { t, language } = useTranslation()
  const lang = React.useMemo(() => (language?.startsWith('tr') ? 'tr' : 'en'), [language])

  const [amount, setAmount] = useState(() => localStorage.getItem('currency_amount') || '')
  const [fromCurrency, setFromCurrency] = useState(() => localStorage.getItem('currency_from') || 'USD')
  const [toCurrency, setToCurrency] = useState(() => localStorage.getItem('currency_to') || 'TRY')
  const [result, setResult] = useState(null)
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem('currency_amount', amount)
    localStorage.setItem('currency_from', fromCurrency)
    localStorage.setItem('currency_to', toCurrency)
  }, [amount, fromCurrency, toCurrency])

  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchCurrencies()
        setCurrencies(Array.isArray(list) && list.length > 0 ? list : FALLBACK_CURRENCIES)
      } catch (err) {
        setCurrencies(FALLBACK_CURRENCIES)
        setError(err.message)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setResult(amount ? parseFloat(amount) || null : null)
      return
    }
    if (!amount) {
      setResult(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    convertCurrency(amount, fromCurrency, toCurrency)
      .then((val) => {
        if (!cancelled) setResult(val)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || t('conversionError'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [amount, fromCurrency, toCurrency, t])

  const handleClear = () => {
    setAmount('')
    setResult(null)
    setError(null)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === '') {
      setAmount('')
      return
    }
    if (/^\d+\.?\d*$/.test(val)) setAmount(val)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
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
          {t('currency')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 500, mx: 'auto' }}>
          {t('currencyHeroDesc')}
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
            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ mb: 0.5 }}>
              {t('amountAndUnit')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                value={amount}
                onChange={handleInputChange}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 'bold', color: 'primary.main' },
                }}
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                variant="standard"
                disableUnderline
                MenuProps={SELECT_MENU_PROPS}
                renderValue={(code) => {
                  const c = currencies.find((x) => x.code === code)
                  return getCurrencyLabelWithSymbol(code, lang, c?.name)
                }}
                sx={{ minWidth: 160, fontWeight: 'bold' }}
              >
                {currencies.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {getCurrencyDisplayName(c.code, lang, c.name)}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <Button
                size="small"
                onClick={swapCurrencies}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  minWidth: 40,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                }}
              >
                <SwapVertIcon />
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" sx={{ mb: 0.5 }}>
              {t('targetUnit')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography
                variant="h5"
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  color: result != null ? 'text.primary' : 'text.disabled',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                ) : result != null ? (
                  result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                ) : (
                  '0.00'
                )}
              </Typography>
              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                variant="standard"
                disableUnderline
                MenuProps={SELECT_MENU_PROPS}
                renderValue={(code) => {
                  const c = currencies.find((x) => x.code === code)
                  return getCurrencyLabelWithSymbol(code, lang, c?.name)
                }}
                sx={{ minWidth: 160, fontWeight: 'bold' }}
              >
                {currencies.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {getCurrencyDisplayName(c.code, lang, c.name)}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <CurrencyChart fromCurrency={fromCurrency} toCurrency={toCurrency} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ alignSelf: 'flex-start', minWidth: 0, display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
          <SimilarToolsCard />
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}