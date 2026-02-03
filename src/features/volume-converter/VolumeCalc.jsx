import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, useTheme, alpha } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Helmet } from 'react-helmet-async'
import { unitOptions, convertVolume, safeEvaluate } from './volumeUtils'
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

export default function VolumeCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State
  const [val1, setVal1] = useState(() => localStorage.getItem('volume_val1') || '')
  const [unit1, setUnit1] = useState(() => {
    const saved = localStorage.getItem('volume_unit1')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[0] // Default: Litre
  })
  const [val2, setVal2] = useState(() => localStorage.getItem('volume_val2') || '')
  const [unit2, setUnit2] = useState(() => {
    const saved = localStorage.getItem('volume_unit2')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[1] // Default: Mililitre
  })
  const [focusedInput, setFocusedInput] = useState(1)

  // Hesaplama Fonksiyonu
  const calculate = (val, u1, u2, setTarget) => {
    const cleanVal = unformatNumber(val)
    const result = convertVolume(cleanVal, u1.factor, u2.factor)
    setTarget(formatNumber(result))
  }

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('volume_val1', val1)
    localStorage.setItem('volume_unit1', unit1.shortName)
    localStorage.setItem('volume_val2', val2)
    localStorage.setItem('volume_unit2', unit2.shortName)
  }, [val1, unit1, val2, unit2])

  // Input Değişiklikleri
  const handleVal1Change = (e) => {
    const val = e.target.value
    if (/^[0-9+\-*/., ]*$/.test(val)) {
      if (/(\.\.|[+\-*/]{2,})/.test(val)) return
      if (val.startsWith('.')) return
      setVal1(val)
      calculate(val, unit1, unit2, setVal2)
    }
  }

  const handleVal2Change = (e) => {
    const val = e.target.value
    if (/^[0-9+\-*/., ]*$/.test(val)) {
      if (/(\.\.|[+\-*/]{2,})/.test(val)) return
      if (val.startsWith('.')) return
      setVal2(val)
      calculate(val, unit2, unit1, setVal1)
    }
  }

  // Birim Değişiklikleri
  const handleUnit1Change = (e) => {
    const newUnit = unitOptions.find(u => u.shortName === e.target.value)
    setUnit1(newUnit)
    calculate(val1, newUnit, unit2, setVal2)
  }

  const handleUnit2Change = (e) => {
    const newUnit = unitOptions.find(u => u.shortName === e.target.value)
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
    if (key === '=') {
      const result = safeEvaluate(unformatNumber(currentVal))
      const resultStr = result.toString()
      setVal(resultStr)
      calculate(resultStr, u1, u2, otherSetVal)
      return
    }

    const lastChar = currentVal.toString().slice(-1)
    const isOperator = ['+', '-', '*', '/', '%'].includes(key)

    if (isOperator) {
      if (currentVal === '') return
      if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        const newVal = currentVal.toString().slice(0, -1) + key
        setVal(newVal)
        calculate(newVal, u1, u2, otherSetVal)
        return
      }
      if (lastChar === '.') return
    }

    if (key === '.') {
      if (currentVal === '' || ['+', '-', '*', '/', '%'].includes(lastChar)) return
      const parts = currentVal.toString().split(/[+\-*/%]/)
      const currentNumber = parts[parts.length - 1]
      if (currentNumber.includes('.')) return
    }

    const newVal = currentVal.toString() + key
    setVal(newVal)
    calculate(newVal, u1, u2, otherSetVal)
  }

  // Stiller
  const accentColor = '#ff9800'
  const darkBg = '#1e1e1e'
  const cardBg = '#252525'

  const cardStyle = { p: 3, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? cardBg : '#fff', color: theme.palette.mode === 'dark' ? '#fff' : 'text.primary', boxShadow: theme.shadows[4], height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }
  const btnStyle = { height: { xs: 50, sm: 60, md: 70 }, borderRadius: 3, fontSize: '1.5rem', fontWeight: 'bold', color: theme.palette.text.primary, bgcolor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#444' : '#d5d5d5' } }
  const operatorBtnStyle = { ...btnStyle, bgcolor: theme.palette.mode === 'dark' ? '#424242' : alpha(accentColor, 0.1), color: accentColor, '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#525252' : alpha(accentColor, 0.2) } }
  const equalBtnStyle = { ...btnStyle, bgcolor: accentColor, color: '#fff', '&:hover': { bgcolor: alpha(accentColor, 0.8) } }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('volume')} | {t('appTitle')}</title>
        <meta name="description" content={t('volumeDesc')} />
        <meta name="keywords" content="hacim çevirici, litre hesaplama, galon çevirme, metreküp hesaplama, sıvı ölçüleri, birim dönüştürücü" />
        <link rel="canonical" href="https://site-adresi.com/volume" />
        <meta property="og:title" content={`${t('volume')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('volumeDesc')} />
        <meta property="og:url" content="https://site-adresi.com/volume" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h3" fontWeight="800" sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '3rem' } }}>{t('volume')}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>{t('volumeDesc')}</Typography>
        <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClear} sx={{ position: { md: 'absolute' }, right: 0, top: '50%', transform: { md: 'translateY(-50%)' }, mt: { xs: 2, md: 0 } }}>{t('reset')}</Button>
      </Box>
      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ ...cardStyle, gap: 3 }}>
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('inputUnit')}</Typography>
              <Select value={unit1.shortName} onChange={handleUnit1Change} fullWidth displayEmpty variant="standard" disableUnderline renderValue={(selected) => { const unit = unitOptions.find(u => u.shortName === selected); return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: accentColor }}>{unit?.shortName}</Box> }} sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}>{unitOptions.map((u) => (<MenuItem key={u.shortName} value={u.shortName}><Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>{u.longName}</span><Typography variant="caption" color="text.secondary">{u.shortName}</Typography></Box></MenuItem>))}</Select>
              <TextField fullWidth value={val1} onChange={handleVal1Change} onFocus={() => setFocusedInput(1)} placeholder={t('enterValue')} variant="standard" InputProps={{ disableUnderline: true, sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 1 ? accentColor : 'text.primary' } }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><IconButton onClick={() => { const tempUnit = unit1; setUnit1(unit2); setUnit2(tempUnit); const tempVal = val1; setVal1(val2); setVal2(tempVal); }} sx={{ bgcolor: alpha(accentColor, 0.1), color: accentColor, '&:hover': { bgcolor: accentColor, color: 'white', transform: 'rotate(180deg)' }, transition: 'all 0.3s ease' }}><SwapVertIcon /></IconButton></Box>
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('outputUnit')}</Typography>
              <Select value={unit2.shortName} onChange={handleUnit2Change} fullWidth displayEmpty variant="standard" disableUnderline renderValue={(selected) => { const unit = unitOptions.find(u => u.shortName === selected); return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'text.secondary' }}>{unit?.shortName}</Box> }} sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}>{unitOptions.map((u) => (<MenuItem key={u.shortName} value={u.shortName}><Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>{u.longName}</span><Typography variant="caption" color="text.secondary">{u.shortName}</Typography></Box></MenuItem>))}</Select>
              <TextField fullWidth value={val2} onChange={handleVal2Change} onFocus={() => setFocusedInput(2)} placeholder={t('resultPlaceholder')} variant="standard" InputProps={{ disableUnderline: true, sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 2 ? accentColor : 'text.primary' } }} />
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ ...cardStyle, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha('#fff', 0.6) }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, height: '100%', p: 1 }}>
              <Button onClick={() => handleKeyPress('C')} sx={{ ...operatorBtnStyle, color: accentColor }}>C</Button><Button onClick={() => handleKeyPress('DEL')} sx={{ ...operatorBtnStyle, color: accentColor }}><BackspaceIcon /></Button><Button onClick={() => handleKeyPress('%')} sx={operatorBtnStyle}>%</Button><Button onClick={() => handleKeyPress('/')} sx={operatorBtnStyle}>÷</Button>
              <Button onClick={() => handleKeyPress('7')} sx={btnStyle}>7</Button><Button onClick={() => handleKeyPress('8')} sx={btnStyle}>8</Button><Button onClick={() => handleKeyPress('9')} sx={btnStyle}>9</Button><Button onClick={() => handleKeyPress('*')} sx={operatorBtnStyle}>×</Button>
              <Button onClick={() => handleKeyPress('4')} sx={btnStyle}>4</Button><Button onClick={() => handleKeyPress('5')} sx={btnStyle}>5</Button><Button onClick={() => handleKeyPress('6')} sx={btnStyle}>6</Button><Button onClick={() => handleKeyPress('-')} sx={operatorBtnStyle}>-</Button>
              <Button onClick={() => handleKeyPress('1')} sx={btnStyle}>1</Button><Button onClick={() => handleKeyPress('2')} sx={btnStyle}>2</Button><Button onClick={() => handleKeyPress('3')} sx={btnStyle}>3</Button><Button onClick={() => handleKeyPress('+')} sx={operatorBtnStyle}>+</Button>
              <Button onClick={() => handleKeyPress('00')} sx={btnStyle}>00</Button><Button onClick={() => handleKeyPress('0')} sx={btnStyle}>0</Button><Button onClick={() => handleKeyPress('.')} sx={btnStyle}>.</Button><Button onClick={() => handleKeyPress('=')} sx={equalBtnStyle}>=</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}