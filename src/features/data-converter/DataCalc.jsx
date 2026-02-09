import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, TextField, Typography, Card, MenuItem, Select, Button, IconButton, Tooltip, useTheme, alpha } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Numpad from '../../components/Numpad/Numpad'
import { unitOptions, convertData } from './dataUtils'
import { useTranslation } from '../../hooks/useTranslation'
import { SELECT_MENU_PROPS } from '../../utils/selectMenuProps'

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
  const [showNumpad, setShowNumpad] = useState(false)

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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
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
        <Grid size={{ xs: 12, md: showNumpad ? 7 : 12 }}>
          <Card elevation={0} sx={{ ...cardStyle, position: 'relative', display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            <Tooltip title={showNumpad ? t('hideKeyboard') : t('showKeyboard')}>
              <IconButton onClick={() => setShowNumpad((v) => !v)} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) } }}>
                {showNumpad ? <KeyboardHideIcon fontSize="small" /> : <KeyboardIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            
            {/* Input 1 */}
            <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Select
                value={unit1.shortName}
                onChange={(e) => handleUnit1Change(e.target.value)}
                variant="standard"
                disableUnderline // width: '200px' yerine responsive değerler
                MenuProps={SELECT_MENU_PROPS}
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
                MenuProps={SELECT_MENU_PROPS}
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

        {showNumpad && (
          <Grid size={{ xs: 12, md: 5 }}>
            <Numpad layout="calculator" onKeyPress={(key) => handleKeyPress(key === 'C' ? 'AC' : key)} />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}
