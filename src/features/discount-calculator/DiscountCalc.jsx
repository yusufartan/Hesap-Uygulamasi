import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CompactInput from '../../components/common/CompactInput'
import PrimaryButton from '../../components/common/PrimaryButton'
import ResultCard from '../../components/common/ResultCard'
import SimilarToolsCard from '../../components/common/SimilarToolsCard'
import { calculateDiscountResults } from './discountUtils'
import { useTranslation } from '../../hooks/useTranslation'

const PRESET_RATES = [5, 10, 20, 25, 50]
const QUICK_PREVIEW_RATES = [10, 20, 25]

export default function DiscountCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  const [price, setPrice] = useState(() => localStorage.getItem('discount_price') || '')
  const [rate, setRate] = useState(() => localStorage.getItem('discount_rate') || '')
  const [activeField, setActiveField] = useState('price')
  const [result, setResult] = useState({ finalPrice: '0', savedAmount: '0' })

  useEffect(() => {
    setResult(calculateDiscountResults(price, rate))
  }, [price, rate])

  useEffect(() => {
    localStorage.setItem('discount_price', price)
    localStorage.setItem('discount_rate', rate)
  }, [price, rate])

  const handleClear = () => {
    setPrice('')
    setRate('')
    setResult({ finalPrice: '0', savedAmount: '0' })
    setActiveField('price')
  }

  const handlePriceChange = (e) => {
    const val = e.target.value
    if (val.startsWith('.')) return
    if (/^\d*\.?\d*$/.test(val)) setPrice(val)
  }

  const handleRateChange = (e) => {
    const val = e.target.value
    if (val.startsWith('.')) return
    if (/^\d*\.?\d*$/.test(val)) {
      if (val && parseFloat(val) > 100) return
      setRate(val)
    }
  }

  const applyPreset = (r) => setRate(String(r))

  const accentColor = theme.palette.primary.main
  const priceNum = parseFloat(price)
  const hasValidPrice = !isNaN(priceNum) && priceNum > 0

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 2, textAlign: 'center', position: 'relative' }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#f50057'} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          {t('discount')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480, mx: 'auto' }}>
          {t('discountDesc')}
        </Typography>
        <PrimaryButton
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
        </PrimaryButton>
      </Box>

      <Grid container spacing={0.1} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 7 }} sx={{ alignSelf: 'flex-start', minWidth: 0 }}>
          <Box sx={{ maxWidth: 480, mx: { xs: 'auto', md: 0 } }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              <Box onClick={() => setActiveField('price')} sx={{ cursor: 'pointer' }}>
                <Typography variant="caption" sx={{ color: activeField === 'price' ? accentColor : 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  {t('originalPrice')}
                </Typography>
                <CompactInput
                  fullWidth
                  value={price}
                  onChange={handlePriceChange}
                  onFocus={() => setActiveField('price')}
                  placeholder="0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalOfferIcon sx={{ color: activeField === 'price' ? accentColor : 'text.disabled', fontSize: 'small' }} />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ 'aria-label': t('originalPrice') }}
                />
              </Box>

              <Box onClick={() => setActiveField('rate')} sx={{ cursor: 'pointer' }}>
                <Typography variant="caption" sx={{ color: activeField === 'rate' ? accentColor : 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  {t('discountRate')}
                </Typography>
                <CompactInput
                  fullWidth
                  value={rate}
                  onChange={handleRateChange}
                  onFocus={() => setActiveField('rate')}
                  placeholder="0"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">%</Typography>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ 'aria-label': t('discountRate') }}
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                  {t('quickSelect')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {PRESET_RATES.map((r) => (
                    <Button
                      key={r}
                      size="small"
                      variant={rate === String(r) ? 'contained' : 'outlined'}
                      onClick={() => applyPreset(r)}
                      sx={{ minWidth: 64 }}
                    >
                      %{r}
                    </Button>
                  ))}
                </Box>
              </Box>

              <ResultCard sx={{ textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {t('finalPrice')}
                </Typography>
                <Typography variant="h5" fontWeight="700" color="primary.main">
                  {result.finalPrice}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {t('savedAmount')}: {result.savedAmount}
                </Typography>
              </ResultCard>

              {hasValidPrice && (
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                    {t('quickPreview')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {QUICK_PREVIEW_RATES.map((r) => {
                      const res = calculateDiscountResults(price, String(r))
                      return (
                        <Box
                          key={r}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 0.5,
                            px: 1.25,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {t('discountAt', { rate: r })}
                          </Typography>
                          <Typography variant="body2" fontWeight="600" color="primary.main">
                            {res.finalPrice}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ alignSelf: 'flex-start', minWidth: 0, display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' } }}>
          <SimilarToolsCard />
        </Grid>
      </Grid>
    </Container>
  )
}
