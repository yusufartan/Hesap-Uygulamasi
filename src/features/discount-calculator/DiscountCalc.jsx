import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, Button, IconButton, Tooltip, useTheme, alpha, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import Numpad from '../../components/Numpad/Numpad'
import { Helmet } from 'react-helmet-async'
import { calculateDiscountResults } from './discountUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function DiscountCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State Tanımlamaları
  const [price, setPrice] = useState(() => localStorage.getItem('discount_price') || '')
  const [rate, setRate] = useState(() => localStorage.getItem('discount_rate') || '')
  const [activeField, setActiveField] = useState('price') // 'price' | 'rate'
  const [result, setResult] = useState({ finalPrice: '0', savedAmount: '0' })
  const [showNumpad, setShowNumpad] = useState(false)

  // Hesaplama Effect'i
  useEffect(() => {
    setResult(calculateDiscountResults(price, rate))
  }, [price, rate])

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('discount_price', price)
    localStorage.setItem('discount_rate', rate)
  }, [price, rate])

  // Temizleme
  const handleClear = () => {
    setPrice('')
    setRate('')
    setResult({ finalPrice: '0', savedAmount: '0' })
    setActiveField('price')
  }

  // Tuş Takımı İşlemleri
  const handleKeyPress = (key) => {
    const currentVal = activeField === 'price' ? price : rate
    const setVal = activeField === 'price' ? setPrice : setRate

    if (key === 'C') {
      handleClear()
      return
    }
    if (key === 'DEL') {
      setVal(currentVal.toString().slice(0, -1))
      return
    }
    if (key === '.') {
      if (currentVal === '' || currentVal.toString().includes('.')) return
      setVal(currentVal + '.')
      return
    }
    
    // İndirim oranı 100'den büyük olamaz kontrolü (basit UX)
    if (activeField === 'rate') {
      const nextVal = parseFloat(currentVal + key)
      if (nextVal > 100) return
    }

    setVal(currentVal.toString() + key)
  }

  // Klavye Girişi İçin Handlerlar
  const handlePriceChange = (e) => {
    const val = e.target.value
    if (val.startsWith('.')) return
    if (/^\d*\.?\d*$/.test(val)) {
      setPrice(val)
    }
  }

  const handleRateChange = (e) => {
    const val = e.target.value
    if (val.startsWith('.')) return
    if (/^\d*\.?\d*$/.test(val)) {
      if (val && parseFloat(val) > 100) return
      setRate(val)
    }
  }

  // Stiller
  const orangeColor = '#ff9800'
  const darkGrey = '#333'

  const cardStyle = {
    p: { xs: 2, md: 4 },
    borderRadius: 5,
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    height: '100%',
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('discount')} | {t('appTitle')}</title>
        <meta name="description" content={t('discountDesc')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/discount" />
        <meta property="og:title" content={`${t('discount')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('discountDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/discount" />
        <meta property="og:type" content="website" />
      </Helmet>
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
          {t('discount')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('discountDesc')}
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
        {/* Sol Taraf: Girişler ve Sonuç */}
        <Grid size={{ xs: 12, md: showNumpad ? 6 : 12 }}>
          <Card elevation={0} sx={{ ...cardStyle, position: 'relative', display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton
                onClick={() => setShowNumpad((v) => !v)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}
              >
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            {/* Orijinal Fiyat */}
            <Box onClick={() => setActiveField('price')} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" sx={{ color: activeField === 'price' ? orangeColor : 'text.secondary', fontWeight: 'bold', ml: 1 }}>
                {t('originalPrice')}
              </Typography>
              <TextField
                fullWidth
                value={price}
                onChange={handlePriceChange}
                onFocus={() => setActiveField('price')}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <InputAdornment position="start"><LocalOfferIcon sx={{ color: activeField === 'price' ? orangeColor : 'text.disabled' }} /></InputAdornment>,
                  sx: { 
                    fontSize: { xs: '1.8rem', md: '2.5rem' }, 
                    fontWeight: 700, 
                    color: activeField === 'price' ? orangeColor : 'text.primary',
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 3,
                    p: 1,
                    border: activeField === 'price' ? `2px solid ${alpha(orangeColor, 0.5)}` : '1px solid transparent'
                  }
                }}
              />
            </Box>

            {/* İndirim Oranı */}
            <Box onClick={() => setActiveField('rate')} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" sx={{ color: activeField === 'rate' ? 'primary.main' : 'text.secondary', fontWeight: 'bold', ml: 1 }}>
                {t('discountRate')}
              </Typography>
              <TextField
                fullWidth
                value={rate}
                onChange={handleRateChange}
                onFocus={() => setActiveField('rate')}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: <InputAdornment position="end"><Typography variant="h5" color="text.secondary">%</Typography></InputAdornment>,
                  sx: { 
                    fontSize: { xs: '1.5rem', md: '2rem' }, 
                    fontWeight: 700, 
                    color: activeField === 'rate' ? 'primary.main' : 'text.primary',
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 3,
                    p: 1,
                    border: activeField === 'rate' ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}` : '1px solid transparent'
                  }
                }}
              />
            </Box>

            {/* Sonuç Alanı */}
            <Box sx={{ 
              mt: 2, 
              p: { xs: 2, md: 3 }, 
              borderRadius: 4, 
              bgcolor: theme.palette.mode === 'dark' ? '#263238' : alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
              textAlign: 'center',
              boxShadow: theme.shadows[4]
            }}>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{t('finalPrice')}</Typography>
              <Typography variant="h2" fontWeight="800" sx={{ color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' } }}>
                {result.finalPrice}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.6, fontSize: '0.9rem' }}>
                {t('savedAmount')}: {result.savedAmount}
              </Typography>
            </Box>

          </Card>
        </Grid>

        {/* Sağ Taraf: Numpad (gizli varsayılan) */}
        {showNumpad && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Numpad layout="simple" onKeyPress={handleKeyPress} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}