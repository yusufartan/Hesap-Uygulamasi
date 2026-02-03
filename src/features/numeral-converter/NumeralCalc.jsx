import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, useTheme, alpha } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Helmet } from 'react-helmet-async'
import { unitOptions, convertNumeral, isValidInput } from './numeralUtils'
import { useTranslation } from '../../hooks/useTranslation'

export default function NumeralCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State
  const [val1, setVal1] = useState(() => localStorage.getItem('numeral_val1') || '')
  const [unit1, setUnit1] = useState(() => {
    const saved = localStorage.getItem('numeral_unit1')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[2] // Default: Decimal
  })
  const [val2, setVal2] = useState(() => localStorage.getItem('numeral_val2') || '')
  const [unit2, setUnit2] = useState(() => {
    const saved = localStorage.getItem('numeral_unit2')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[0] // Default: Binary
  })
  const [focusedInput, setFocusedInput] = useState(1)

  // Hesaplama Fonksiyonu
  const calculate = (val, u1, u2, setTarget) => {
    const result = convertNumeral(val, u1.base, u2.base)
    setTarget(result)
  }

  // LocalStorage Kayıt
  useEffect(() => {
    localStorage.setItem('numeral_val1', val1)
    localStorage.setItem('numeral_unit1', unit1.shortName)
    localStorage.setItem('numeral_val2', val2)
    localStorage.setItem('numeral_unit2', unit2.shortName)
  }, [val1, unit1, val2, unit2])

  // Input Değişiklikleri
  const handleVal1Change = (e) => {
    const val = e.target.value.toUpperCase()
    if (isValidInput(val, unit1.base)) {
      setVal1(val)
      calculate(val, unit1, unit2, setVal2)
    }
  }

  const handleVal2Change = (e) => {
    const val = e.target.value.toUpperCase()
    if (isValidInput(val, unit2.base)) {
      setVal2(val)
      calculate(val, unit2, unit1, setVal1)
    }
  }

  // Birim Değişiklikleri
  const handleUnit1Change = (e) => {
    const newUnit = unitOptions.find(u => u.shortName === e.target.value)
    setUnit1(newUnit)
    // Mevcut değer yeni tabana uygun değilse temizle, uygunsa dönüştür
    if (!isValidInput(val1, newUnit.base)) {
        setVal1('')
        setVal2('')
    } else {
        calculate(val1, newUnit, unit2, setVal2)
    }
  }

  const handleUnit2Change = (e) => {
    const newUnit = unitOptions.find(u => u.shortName === e.target.value)
    setUnit2(newUnit)
    // Mevcut değer yeni tabana uygun değilse temizle, uygunsa dönüştür
    if (!isValidInput(val2, newUnit.base)) {
        setVal2('')
        setVal1('') // Diğer tarafı da temizle çünkü kaynak değişti
    } else {
        calculate(val1, unit1, newUnit, setVal2)
    }
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

    // Geçerlilik kontrolü
    if (isValidInput(key, u1.base)) {
        const newVal = currentVal.toString() + key
        setVal(newVal)
        calculate(newVal, u1, u2, otherSetVal)
    }
  }

  // Stiller
  const accentColor = '#ff9800'
  const darkBg = '#1e1e1e'
  const cardBg = '#252525'

  const cardStyle = {
    p: 3,
    borderRadius: 4,
    bgcolor: theme.palette.mode === 'dark' ? cardBg : '#fff',
    color: theme.palette.mode === 'dark' ? '#fff' : 'text.primary',
    boxShadow: theme.shadows[4],
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }

  const btnStyle = {
    height: { xs: 40, sm: 50, md: 60 }, // Hex tuşları için biraz daha küçük
    borderRadius: 2,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    bgcolor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#444' : '#d5d5d5' },
    '&.Mui-disabled': { opacity: 0.3 }
  }

  const operatorBtnStyle = {
    ...btnStyle,
    bgcolor: theme.palette.mode === 'dark' ? '#424242' : alpha(accentColor, 0.1),
    color: accentColor,
    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#525252' : alpha(accentColor, 0.2) }
  }

  // Aktif tabana göre tuşun devre dışı olup olmadığını belirle
  const isKeyDisabled = (key) => {
      const activeBase = focusedInput === 1 ? unit1.base : unit2.base
      
      // Rakamlar ve Harfler için kontrol
      if (/^[0-9A-F]$/.test(key)) {
          // Hexadecimal (16) ise A-F arası harfler 10-15 değerindedir
          const value = parseInt(key, 16)
          return value >= activeBase
      }
      return false
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('numeral')} | {t('appTitle')}</title>
        <meta name="description" content={t('numeralDesc')} />
        <meta name="keywords" content="sayı sistemleri, binary çevirici, hex hesaplama, onluk taban, ikilik taban, decimal to binary, taban aritmetiği" />
        <link rel="canonical" href="https://site-adresi.com/numeral" />
        <meta property="og:title" content={`${t('numeral')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('numeralDesc')} />
        <meta property="og:url" content="https://site-adresi.com/numeral" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Typography 
          variant="h3" 
          fontWeight="800" 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || '#ff4081'} 100%)`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          {t('numeral')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('numeralDesc')}
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
        {/* Sol Taraf: Girişler */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ ...cardStyle, gap: 3 }}>
            
            {/* 1. Alan */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('inputBase')}</Typography>
              <Select
                value={unit1.shortName}
                onChange={handleUnit1Change}
                fullWidth
                displayEmpty
                variant="standard"
                disableUnderline
                renderValue={(selected) => {
                  const unit = unitOptions.find(u => u.shortName === selected)
                  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: accentColor }}>{unit?.shortName}</Box>
                }}
                sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}
              >
                {unitOptions.map((u) => (
                  <MenuItem key={u.shortName} value={u.shortName}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{u.longName}</span>
                      <Typography variant="caption" color="text.secondary">Base-{u.base}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val1}
                onChange={handleVal1Change}
                onFocus={() => setFocusedInput(1)}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 1 ? accentColor : 'text.primary' }
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
                  bgcolor: alpha(accentColor, 0.1),
                  color: accentColor,
                  '&:hover': { bgcolor: accentColor, color: 'white', transform: 'rotate(180deg)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <SwapVertIcon />
              </IconButton>
            </Box>

            {/* 2. Alan */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1, mb: 1, display: 'block' }}>{t('outputBase')}</Typography>
              <Select
                value={unit2.shortName}
                onChange={handleUnit2Change}
                fullWidth
                displayEmpty
                variant="standard"
                disableUnderline
                renderValue={(selected) => {
                  const unit = unitOptions.find(u => u.shortName === selected)
                  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'text.secondary' }}>{unit?.shortName}</Box>
                }}
                sx={{ mb: 1, '& .MuiSelect-select': { py: 0.5 } }}
              >
                {unitOptions.map((u) => (
                  <MenuItem key={u.shortName} value={u.shortName}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{u.longName}</span>
                      <Typography variant="caption" color="text.secondary">Base-{u.base}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val2}
                onChange={handleVal2Change}
                onFocus={() => setFocusedInput(2)}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '2rem', fontWeight: 700, color: focusedInput === 2 ? accentColor : 'text.primary' }
                }}
              />
            </Box>

          </Card>
        </Grid>

        {/* Sağ Taraf: Hex Numpad */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ ...cardStyle, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha('#fff', 0.6) }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1.5,
              height: '100%',
              p: 1
            }}>
              {/* Hex Harfler */}
              {['A', 'B', 'C', 'D', 'E', 'F'].map((key) => (
                  <Button 
                    key={key} 
                    onClick={() => handleKeyPress(key)} 
                    disabled={isKeyDisabled(key)}
                    sx={btnStyle}
                  >
                    {key}
                  </Button>
              ))}
              
              {/* Boşlukları doldurmak için */}
              <Box sx={{ gridColumn: 'span 2' }} /> 

              {/* Rakamlar */}
              {['7', '8', '9', 'C'].map((key) => (
                 key === 'C' ? 
                 <Button key={key} onClick={() => handleKeyPress('C')} sx={{ ...operatorBtnStyle, color: accentColor }}>C</Button> :
                 <Button key={key} onClick={() => handleKeyPress(key)} disabled={isKeyDisabled(key)} sx={btnStyle}>{key}</Button>
              ))}

              {['4', '5', '6', 'DEL'].map((key) => (
                 key === 'DEL' ? 
                 <Button key={key} onClick={() => handleKeyPress('DEL')} sx={{ ...operatorBtnStyle, color: accentColor }}><BackspaceIcon /></Button> :
                 <Button key={key} onClick={() => handleKeyPress(key)} disabled={isKeyDisabled(key)} sx={btnStyle}>{key}</Button>
              ))}

              {['1', '2', '3', '0'].map((key) => (
                 <Button key={key} onClick={() => handleKeyPress(key)} disabled={isKeyDisabled(key)} sx={btnStyle}>{key}</Button>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
