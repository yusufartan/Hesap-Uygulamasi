import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, Tooltip, useTheme, alpha } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Numpad from '../../components/Numpad/Numpad'
import { unitOptions, convertArea } from './areaUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function AreaCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State tanımlamaları (LocalStorage entegrasyonlu)
  const [val1, setVal1] = useState(() => localStorage.getItem('area_val1') || '')
  const [unit1, setUnit1] = useState(() => {
    const saved = localStorage.getItem('area_unit1')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[3] // Default m²
  })

  const [val2, setVal2] = useState(() => localStorage.getItem('area_val2') || '')
  const [unit2, setUnit2] = useState(() => {
    const saved = localStorage.getItem('area_unit2')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[0] // Default km²
  })

  const [focusedInput, setFocusedInput] = useState(1) // Hangi input aktif? (1 veya 2)
  const [showNumpad, setShowNumpad] = useState(false)

  // Değerleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('area_val1', val1)
    localStorage.setItem('area_unit1', unit1.shortName)
    localStorage.setItem('area_val2', val2)
    localStorage.setItem('area_unit2', unit2.shortName)
  }, [val1, unit1, val2, unit2])

  const handleVal1Change = (newValue) => {
    if (!/^\d*\.?\d*$/.test(newValue)) return
    setVal1(newValue)
    setVal2(convertArea(newValue, unit1.factor, unit2.factor))
  }

  const handleVal2Change = (newValue) => {
    if (!/^\d*\.?\d*$/.test(newValue)) return
    setVal2(newValue)
    setVal1(convertArea(newValue, unit2.factor, unit1.factor))
  }

  const handleUnit1Change = (newUnitShort) => {
    const newUnit = unitOptions.find(u => u.shortName === newUnitShort)
    setUnit1(newUnit)
    setVal2(convertArea(val1, newUnit.factor, unit2.factor))
  }

  const handleUnit2Change = (newUnitShort) => {
    const newUnit = unitOptions.find(u => u.shortName === newUnitShort)
    setUnit2(newUnit)
    setVal2(convertArea(val1, unit1.factor, newUnit.factor))
  }

  const handleClear = () => {
    setVal1('')
    setVal2('')
    setFocusedInput(1)
  }

  // Tuş Takımı İşlemleri
  const handleKeyPress = (key) => {
    const isInput1 = focusedInput === 1
    const currentVal = isInput1 ? val1 : val2
    const setVal = isInput1 ? handleVal1Change : handleVal2Change

    if (key === 'AC') {
      handleClear()
      return
    }
    if (key === 'DEL') {
      setVal(currentVal.toString().slice(0, -1))
      return
    }
    if (key === '.') {
      if (!currentVal.toString().includes('.')) {
        setVal(currentVal + '.')
      }
      return
    }
    setVal(currentVal.toString() + key)
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
    width: '100%', // Mobilde taşmayı önlemek için
    transition: 'transform 0.3s ease',
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{ // Responsive font boyutu
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            fontSize: { xs: '1.8rem', md: '3rem' }
          }}
        >
          {t('area')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('areaDesc')}
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
        {/* Sol Taraf: Inputlar */}
        <Grid size={{ xs: 12, md: showNumpad ? 7 : 12 }}>
          <Card elevation={0} sx={{ ...cardStyle, position: 'relative', display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton onClick={() => setShowNumpad((v) => !v)} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            {/* 1. Alan */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('inputUnit')}</Typography>
              <Select // responsive font size
                value={unit1.shortName}
                onChange={(e) => handleUnit1Change(e.target.value)}
                fullWidth
                displayEmpty
                variant="standard"
                disableUnderline
                renderValue={(selected) => {
                  const unit = unitOptions.find(u => u.shortName === selected)
                  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1rem', md: '1.1rem' } }}>{unit?.shortName}</Box>
                }}
                sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.shortName} value={option.shortName}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{option.longName}</span>
                      <Typography variant="caption" color="text.secondary">{option.shortName}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val1}
                onChange={(e) => handleVal1Change(e.target.value)}
                onFocus={() => setFocusedInput(1)}
                placeholder={t('enterValue')}
                variant="standard"
                InputProps={{
                  disableUnderline: true, // responsive font size
                  sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 1 ? 'primary.main' : 'text.primary' }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={() => {
                  const tempUnit = unit1; setUnit1(unit2); setUnit2(tempUnit);
                  const tempVal = val1; setVal1(val2); setVal2(tempVal);
                }}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'rotate(180deg)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <SwapVertIcon />
              </IconButton>
            </Box>

            {/* 2. Alan */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('outputUnit')}</Typography>
              <Select // responsive font size
                value={unit2.shortName}
                onChange={(e) => handleUnit2Change(e.target.value)}
                fullWidth
                displayEmpty
                variant="standard"
                disableUnderline
                renderValue={(selected) => {
                  const unit = unitOptions.find(u => u.shortName === selected)
                  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'secondary.main', fontSize: { xs: '1rem', md: '1.1rem' } }}>{unit?.shortName}</Box>
                }}
                sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.shortName} value={option.shortName}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{option.longName}</span>
                      <Typography variant="caption" color="text.secondary">{option.shortName}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val2}
                onChange={(e) => handleVal2Change(e.target.value)}
                onFocus={() => setFocusedInput(2)}
                placeholder={t('resultPlaceholder')}
                variant="standard"
                InputProps={{
                  disableUnderline: true, // responsive font size
                  sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 2 ? 'primary.main' : 'text.primary' }
                }}
              />
            </Box>

          </Card>
        </Grid>

        {/* Sağ Taraf: Klavye (gizli varsayılan) */}
        {showNumpad && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Numpad layout="simple" onKeyPress={handleKeyPress} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}