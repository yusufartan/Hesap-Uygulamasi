import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, useTheme, alpha } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Helmet } from 'react-helmet-async'
import { unitOptions, convertData } from './dataUtils'
import DragHandleIcon from '@mui/icons-material/DragHandle' // For double line icon
import { useTranslation } from '../../hooks/useTranslation'

export default function DataCalc() {
  const theme = useTheme()
  const { t } = useTranslation()

  // State tanımlamaları
  const [val1, setVal1] = useState(() => localStorage.getItem('data_val1') || '')
  const [unit1, setUnit1] = useState(() => {
    const saved = localStorage.getItem('data_unit1')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[5] // Default MB
  })

  const [val2, setVal2] = useState(() => localStorage.getItem('data_val2') || '')
  const [unit2, setUnit2] = useState(() => {
    const saved = localStorage.getItem('data_unit2')
    return unitOptions.find(u => u.shortName === saved) || unitOptions[7] // Default GB
  })

  const [focusedInput, setFocusedInput] = useState(1)

  // Değerleri kaydet
  useEffect(() => {
    localStorage.setItem('data_val1', val1)
    localStorage.setItem('data_unit1', unit1.shortName)
    localStorage.setItem('data_val2', val2)
    localStorage.setItem('data_unit2', unit2.shortName)
  }, [val1, unit1, val2, unit2])

  const handleVal1Change = (newValue) => {
    if (!/^\d*\.?\d*$/.test(newValue)) return
    if (newValue.startsWith('.')) return 
    setVal1(newValue)
    setVal2(convertData(newValue, unit1.factor, unit2.factor))
  }

  const handleVal2Change = (newValue) => {
    if (!/^\d*\.?\d*$/.test(newValue)) return
    if (newValue.startsWith('.')) return
    setVal2(newValue)
    setVal1(convertData(newValue, unit2.factor, unit1.factor))
  }

  const handleUnit1Change = (newUnitShort) => {
    const newUnit = unitOptions.find(u => u.shortName === newUnitShort)
    setUnit1(newUnit)
    setVal2(convertData(val1, newUnit.factor, unit2.factor))
  }

  const handleUnit2Change = (newUnitShort) => {
    const newUnit = unitOptions.find(u => u.shortName === newUnitShort)
    setUnit2(newUnit)
    setVal2(convertData(val1, unit1.factor, newUnit.factor))
  }

  const handleClear = () => {
    setVal1('')
    setVal2('')
    setFocusedInput(1)
  }

  const handleKeyPress = (key) => {
    const isInput1 = focusedInput === 1
    const currentVal = isInput1 ? val1 : val2
    const setVal = isInput1 ? handleVal1Change : handleVal2Change

    // Operator logic for DataCalc (if needed, or just ignore operators)
    // The prompt asks for a numpad with C and Equals.
    // Since DataCalc updates automatically, Equals might just be visual or force a refresh.
    if (key === '=') {
        return // Auto-calc handles it
    }

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

  const keyStyle = {
    height: { xs: 64, sm: 80, md: 90 },
    borderRadius: { xs: 2, md: 4 },
    fontSize: '2rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : '#fff',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: theme.palette.mode === 'dark' ? '0 4px 0 0 rgba(0,0,0,0.5)' : '0 4px 0 0 #e0e0e0',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.2)}`
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  }

  const equalsBtnStyle = {
    ...keyStyle,
    bgcolor: '#FF8C00',
    color: '#fff',
    '&:hover': {
      bgcolor: '#e67e00',
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 20px ${alpha('#FF8C00', 0.4)}`
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('data')} | {t('appTitle')}</title>
        <meta name="description" content={t('dataDesc')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/data" />
        <meta property="og:title" content={`${t('data')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('dataDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/data" />
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
          {t('data')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          {t('dataDesc')}
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
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            
            {/* Input 1 */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Select
                value={unit1.shortName}
                onChange={(e) => handleUnit1Change(e.target.value)}
                variant="standard"
                disableUnderline // width: '200px' yerine responsive değerler
                sx={{ width: { xs: '120px', sm: '150px', md: '200px' }, '& .MuiSelect-select': { fontWeight: 'bold', color: '#FF8C00' } }}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.shortName} value={option.shortName}>
                    {option.shortName} ({option.longName})
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val1}
                onChange={(e) => handleVal1Change(e.target.value)}
                onFocus={() => setFocusedInput(1)}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: focusedInput === 1 ? '#FF8C00' : 'text.primary', textAlign: 'right' }
                }}
                sx={{ '& input': { textAlign: 'right' } }}
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
                  color: '#FF8C00',
                  '&:hover': { bgcolor: '#FF8C00', color: 'white', transform: 'rotate(180deg)' },
                  transition: 'all 0.3s ease'
                }}
              >
                <SwapVertIcon />
              </IconButton>
            </Box>

            {/* Input 2 */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Select
                value={unit2.shortName}
                onChange={(e) => handleUnit2Change(e.target.value)}
                variant="standard"
                disableUnderline // width: '200px' yerine responsive değerler
                sx={{ width: { xs: '120px', sm: '150px', md: '200px' }, '& .MuiSelect-select': { fontWeight: 'bold', color: '#FF8C00' } }}
              >
                {unitOptions.map((option) => (
                  <MenuItem key={option.shortName} value={option.shortName}>
                    {option.shortName} ({option.longName})
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                value={val2}
                onChange={(e) => handleVal2Change(e.target.value)}
                onFocus={() => setFocusedInput(2)}
                placeholder="0"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: focusedInput === 2 ? '#FF8C00' : 'text.primary', textAlign: 'right' }
                }}
                sx={{ '& input': { textAlign: 'right' } }}
              />
            </Box>

          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.4) : alpha('#fff', 0.6) }}>
            <Box sx={{
              width: '100%',
              maxWidth: 420,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2
            }}>
              {/* Row 1 */}
              <Button onClick={() => handleKeyPress('AC')} sx={{ ...keyStyle, color: '#FF8C00' }}>C</Button>
              <Button onClick={() => handleKeyPress('DEL')} sx={{ ...keyStyle, color: '#FF8C00' }}><BackspaceIcon /></Button>
              <Button onClick={() => handleKeyPress('%')} sx={keyStyle}>%</Button>
              <Button onClick={() => handleKeyPress('/')} sx={keyStyle}>÷</Button>
              {/* Row 2 */}
              <Button onClick={() => handleKeyPress('7')} sx={keyStyle}>7</Button>
              <Button onClick={() => handleKeyPress('8')} sx={keyStyle}>8</Button>
              <Button onClick={() => handleKeyPress('9')} sx={keyStyle}>9</Button>
              <Button onClick={() => handleKeyPress('*')} sx={keyStyle}>×</Button>
              {/* Row 3 */}
              <Button onClick={() => handleKeyPress('4')} sx={keyStyle}>4</Button>
              <Button onClick={() => handleKeyPress('5')} sx={keyStyle}>5</Button>
              <Button onClick={() => handleKeyPress('6')} sx={keyStyle}>6</Button>
              <Button onClick={() => handleKeyPress('-')} sx={keyStyle}>-</Button>
              {/* Row 4 */}
              <Button onClick={() => handleKeyPress('1')} sx={keyStyle}>1</Button>
              <Button onClick={() => handleKeyPress('2')} sx={keyStyle}>2</Button>
              <Button onClick={() => handleKeyPress('3')} sx={keyStyle}>3</Button>
              <Button onClick={() => handleKeyPress('+')} sx={keyStyle}>+</Button>
              {/* Row 5 */}
              <Button onClick={() => handleKeyPress('00')} sx={keyStyle}>00</Button>
              <Button onClick={() => handleKeyPress('0')} sx={keyStyle}>0</Button>
              <Button onClick={() => handleKeyPress('.')} sx={keyStyle}>.</Button>
              <Button onClick={() => handleKeyPress('=')} sx={equalsBtnStyle}><DragHandleIcon /></Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
