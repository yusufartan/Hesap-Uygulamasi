import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, Tooltip, useTheme, alpha } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Numpad from '../../components/Numpad/Numpad'
import PlusOneIcon from '@mui/icons-material/PlusOne' // +/- ikonu yerine text kullanacağız ama import kalsın
import { unitOptions, convertTemp, safeEvaluate } from './tempUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function TempCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State
  const [val1, setVal1] = useState(() => localStorage.getItem('temp_val1') || '')
  const [unit1, setUnit1] = useState(() => {
    const saved = localStorage.getItem('temp_unit1')
    return unitOptions.find(u => u.id === saved) || unitOptions[0] // Default: Celsius
  })
  const [val2, setVal2] = useState(() => localStorage.getItem('temp_val2') || '')
  const [unit2, setUnit2] = useState(() => {
    const saved = localStorage.getItem('temp_unit2')
    return unitOptions.find(u => u.id === saved) || unitOptions[1] // Default: Fahrenheit
  })
  const [focusedInput, setFocusedInput] = useState(1)
  const [showNumpad, setShowNumpad] = useState(false)

  // Hesaplama Fonksiyonu
  const calculate = (val, u1, u2, setTarget) => {
    const result = convertTemp(val, u1.id, u2.id)
    setTarget(result)
  }

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('temp_val1', val1)
    localStorage.setItem('temp_unit1', unit1.id)
    localStorage.setItem('temp_val2', val2)
    localStorage.setItem('temp_unit2', unit2.id)
  }, [val1, unit1, val2, unit2])

  // Input Değişiklikleri
  const handleVal1Change = (e) => {
    const val = e.target.value
    // Sadece sayı, nokta ve başta eksi işaretine izin ver
    if (/^-?[0-9.]*$/.test(val)) {
      if (val.indexOf('.') !== val.lastIndexOf('.')) return // Birden fazla nokta engelle
      setVal1(val)
      calculate(val, unit1, unit2, setVal2)
    }
  }

  const handleVal2Change = (e) => {
    const val = e.target.value
    if (/^-?[0-9.]*$/.test(val)) {
      if (val.indexOf('.') !== val.lastIndexOf('.')) return
      setVal2(val)
      calculate(val, unit2, unit1, setVal1)
    }
  }

  // Birim Değişiklikleri
  const handleUnit1Change = (e) => {
    const newUnit = unitOptions.find(u => u.id === e.target.value)
    setUnit1(newUnit)
    calculate(val1, newUnit, unit2, setVal2)
  }

  const handleUnit2Change = (e) => {
    const newUnit = unitOptions.find(u => u.id === e.target.value)
    setUnit2(newUnit)
    calculate(val1, unit1, newUnit, setVal2)
  }

  // Temizle
  const handleClear = () => {
    setVal1('')
    setVal2('')
    setFocusedInput(1)
  }

  // Numpad İşlemleri
  const handleKeyPress = (key) => {
    const isInput1 = focusedInput === 1
    const currentVal = isInput1 ? val1 : val2
    const setVal = isInput1 ? setVal1 : setVal2
    const otherSetVal = isInput1 ? setVal2 : setVal1
    const u1 = isInput1 ? unit1 : unit2
    const u2 = isInput1 ? unit2 : unit1

    if (key === 'C') {
      handleClear()
      return
    }
    if (key === 'DEL') {
      const newVal = currentVal.toString().slice(0, -1)
      setVal(newVal)
      calculate(newVal, u1, u2, otherSetVal)
      return
    }
    
    // +/- Butonu Mantığı
    if (key === '+/-') {
      let newVal
      if (currentVal.startsWith('-')) {
        newVal = currentVal.substring(1) // Eksiyi kaldır
      } else {
        newVal = '-' + currentVal // Eksi ekle
      }
      setVal(newVal)
      calculate(newVal, u1, u2, otherSetVal)
      return
    }

    if (key === '.') {
      if (currentVal.toString().includes('.')) return
    }

    const newVal = currentVal.toString() + key
    setVal(newVal)
    calculate(newVal, u1, u2, otherSetVal)
  }

  const accentColor = theme.palette.primary.main
  const cardStyle = { p: { xs: 2, md: 3 }, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? '#252525' : '#fff', color: theme.palette.mode === 'dark' ? '#fff' : 'text.primary', boxShadow: theme.shadows[4], height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '3rem' } }}>{t('temp')}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', fontSize: { xs: '0.9rem', md: '1rem' } }}>{t('tempDesc')}</Typography>
        <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>{t('reset')}</Button>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: showNumpad ? 7 : 12 }}>
          <Card elevation={0} sx={{ ...cardStyle, position: 'relative', gap: 3 }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton onClick={() => setShowNumpad((v) => !v)} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>{t('inputUnit')}</Typography>
              <Select value={unit1.id} onChange={handleUnit1Change} fullWidth displayEmpty variant="standard" disableUnderline renderValue={(selected) => { const unit = unitOptions.find(u => u.id === selected); return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: accentColor }}>{unit?.shortName}</Box> }} sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5, fontSize: { xs: '1rem', md: '1.1rem' } } }}>{unitOptions.map((u) => (<MenuItem key={u.id} value={u.id}><Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>{u.longName}</span><Typography variant="caption" color="text.secondary">{u.shortName}</Typography></Box></MenuItem>))}</Select>
              <TextField fullWidth value={val1} onChange={handleVal1Change} onFocus={() => setFocusedInput(1)} placeholder={t('enterValue')} variant="standard" InputProps={{ disableUnderline: true, sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: focusedInput === 1 ? accentColor : 'text.primary' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><IconButton onClick={() => { const tempUnit = unit1; setUnit1(unit2); setUnit2(tempUnit); const tempVal = val1; setVal1(val2); setVal2(tempVal); }} sx={{ bgcolor: alpha(accentColor, 0.1), color: accentColor, '&:hover': { bgcolor: accentColor, color: 'white', transform: 'rotate(180deg)' }, transition: 'all 0.3s ease' }}><SwapVertIcon /></IconButton></Box>
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>{t('outputUnit')}</Typography>
              <Select value={unit2.id} onChange={handleUnit2Change} fullWidth displayEmpty variant="standard" disableUnderline renderValue={(selected) => { const unit = unitOptions.find(u => u.id === selected); return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'text.secondary' }}>{unit?.shortName}</Box> }} sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5, fontSize: { xs: '1rem', md: '1.1rem' } } }}>{unitOptions.map((u) => (<MenuItem key={u.id} value={u.id}><Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>{u.longName}</span><Typography variant="caption" color="text.secondary">{u.shortName}</Typography></Box></MenuItem>))}</Select>
              <TextField fullWidth value={val2} onChange={handleVal2Change} onFocus={() => setFocusedInput(2)} placeholder={t('resultPlaceholder')} variant="standard" InputProps={{ disableUnderline: true, sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: focusedInput === 2 ? accentColor : 'text.primary' } }} />
            </Box>
          </Card>
        </Grid>
        {showNumpad && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Numpad layout="temp" onKeyPress={handleKeyPress} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}