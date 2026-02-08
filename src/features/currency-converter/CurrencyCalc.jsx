import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, Tooltip, useTheme, alpha, CircularProgress, Alert, Snackbar } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Numpad from '../../components/Numpad/Numpad'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { fetchCurrencies, convertCurrency } from './currencyUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function CurrencyCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State Tanımlamaları (LocalStorage Entegrasyonu)
  const [amount, setAmount] = useState(() => localStorage.getItem('currency_amount') || '')
  const [fromCurrency, setFromCurrency] = useState(() => localStorage.getItem('currency_from') || 'USD')
  const [toCurrency, setToCurrency] = useState(() => localStorage.getItem('currency_to') || 'TRY')
  const [result, setResult] = useState(null)
  
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focusedInput, setFocusedInput] = useState(1) // 1: Miktar girişi
  const [showNumpad, setShowNumpad] = useState(false)

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('currency_amount', amount)
    localStorage.setItem('currency_from', fromCurrency)
    localStorage.setItem('currency_to', toCurrency)
  }, [amount, fromCurrency, toCurrency])

  // Sayfa yüklendiğinde para birimlerini çek
  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchCurrencies()
        setCurrencies(list)
      } catch (err) {
        setError(err.message)
      }
    }
    init()
  }, [])

  // Hesaplama Fonksiyonu
  const handleCalculate = async () => {
    if (!amount) return
    setLoading(true)
    setError(null)
    try {
      const res = await convertCurrency(amount, fromCurrency, toCurrency)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Temizle
  const handleClear = () => {
    setAmount('')
    setResult(null)
    setError(null)
  }

  // Numpad İşlemleri
  const handleKeyPress = (key) => {
    if (key === 'AC') {
      handleClear()
      return
    }
    if (key === 'DEL') {
      setAmount(prev => prev.toString().slice(0, -1))
      return
    }
    if (key === '.') {
      // Boşsa veya zaten nokta varsa işlem yapma
      setAmount(prev => {
        if (prev === '' || prev.includes('.')) return prev
        return prev + '.'
      })
      return
    }
    setAmount(prev => prev.toString() + key)
  }

  // Klavye Girişi Kontrolü
  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === '') {
      setAmount('')
      return
    }
    // Sadece rakamla başlayan ve tek nokta içeren değerlere izin ver (Regex: Rakamla başla, opsiyonel nokta ve devamı)
    if (/^\d+\.?\d*$/.test(val)) {
      setAmount(val)
    }
  }

  // Stiller
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>

      <Box sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          {t('currency')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('currencyHeroDesc')}
        </Typography>
        <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>
          {t('reset')}
        </Button>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {/* Sol Taraf: Girişler */}
        <Grid size={{ xs: 12, md: showNumpad ? 7 : 12 }}>
          <Card elevation={0} sx={{ ...cardStyle, position: 'relative', display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton onClick={() => setShowNumpad((v) => !v)} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            {/* Giriş Miktarı ve Birimi */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('amountAndUnit')}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}> {/* responsive font size */}
                <TextField fullWidth value={amount} onChange={handleInputChange} placeholder="0" variant="standard" InputProps={{ disableUnderline: true, sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: 'primary.main' } }} />
                <Select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} variant="standard" disableUnderline sx={{ minWidth: 80, fontWeight: 'bold' }}>
                  {currencies.map((c) => <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>)}
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton onClick={() => { const temp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(temp); }} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                <SwapVertIcon />
              </IconButton>
            </Box>

            {/* Hedef Birim ve Sonuç */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{t('targetUnit')}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}> {/* responsive font size */}
                <Typography variant="h3" sx={{ flexGrow: 1, fontWeight: 700, color: result ? 'text.primary' : 'text.disabled' }}>
                  {result ? result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '0.00'}
                </Typography>
                <Select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} variant="standard" disableUnderline sx={{ minWidth: 80, fontWeight: 'bold' }}>
                  {currencies.map((c) => <MenuItem key={c.code} value={c.code}>{c.code}</MenuItem>)}
                </Select>
              </Box>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleCalculate} 
              disabled={loading || !amount}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CurrencyExchangeIcon />}
              sx={{ py: { xs: 1.5, md: 2 }, borderRadius: 3, fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 'bold' }}
            >
              {loading ? t('converting') : t('convert')}
            </Button>

          </Card>
        </Grid>

        {/* Sağ Taraf: Numpad (gizli varsayılan) */}
        {showNumpad && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Numpad layout="simple" onKeyPress={handleKeyPress} />
          </Grid>
        )}
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  )
}