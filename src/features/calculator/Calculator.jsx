import React, { useState, useCallback } from 'react'
import { Box, Container, Typography, Card, Button, useTheme, alpha } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import CalculateIcon from '@mui/icons-material/Calculate'
import BackspaceIcon from '@mui/icons-material/Backspace'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useTranslation } from '../../hooks/useTranslation'
import {
  computeBinary,
  computeUnary,
  evalExpression,
  formatDisplay,
  getNextDisplayForInput,
  getDisplayAfterBackspace,
  isErrorResult,
} from './calculatorUtils'

export default function Calculator() {
  const theme = useTheme()
  const { t } = useTranslation()
  const [isProMode, setIsProMode] = useState(false)
  const [display, setDisplay] = useState('0')
  const [pendingOp, setPendingOp] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  const [nextReplacesDisplay, setNextReplacesDisplay] = useState(false)
  const [expression, setExpression] = useState('')
  const [lastBasicExpression, setLastBasicExpression] = useState('')
  const calcError = t('calcError')

  const applyInput = useCallback((key) => {
    setNextReplacesDisplay(false)
    setDisplay((cur) => getNextDisplayForInput(cur, key, nextReplacesDisplay))
  }, [nextReplacesDisplay])

  const handleOp = useCallback((op) => {
    setLastBasicExpression('')
    let resultOfCompute = null
    if (pendingOp !== null && prevValue !== null && !nextReplacesDisplay) {
      const result = computeBinary(prevValue, display, pendingOp, () => calcError)
      const isErr = isErrorResult(result, calcError)
      resultOfCompute = isErr ? null : result
      setDisplay(isErr ? '0' : result)
      setPrevValue(isErr ? null : result)
      if (isProMode && !isErr) setExpression((e) => `${e.replace(/\s+$/, '')} ${display} =`)
    } else {
      setPrevValue(display)
    }
    setPendingOp(op)
    setNextReplacesDisplay(true)
    if (isProMode) {
      setExpression((e) => {
        const afterEquals = e.trimEnd().endsWith('=')
        const val = resultOfCompute !== null ? resultOfCompute : (afterEquals ? display : null)
        if (val !== null) return `${val} ${op} `
        return `${e.replace(/\s+$/, '')}${display} ${op} `
      })
    }
  }, [display, pendingOp, prevValue, nextReplacesDisplay, calcError, isProMode])

  const handleEquals = useCallback(() => {
    if (isProMode && expression) {
      let fullExpr = expression.replace(/\s+$/, '').trim()
      const openCount = (fullExpr.match(/\(/g) || []).length
      const closeCount = (fullExpr.match(/\)/g) || []).length
      if (openCount > closeCount && display !== '0') fullExpr += ' ' + display + ' )'.repeat(openCount - closeCount)
      else if (display !== '0' && !fullExpr.endsWith(')') && !fullExpr.endsWith('=')) fullExpr += ' ' + display
      const result = evalExpression(fullExpr, () => calcError)
      const isErr = result === null || isErrorResult(result, calcError)
      setDisplay(isErr ? '0' : result)
      setPrevValue(null)
      setPendingOp(null)
      setNextReplacesDisplay(true)
      if (!isErr) setExpression((e) => `${e.replace(/\s+$/, '')} ${display} =`)
      return
    }
    if (pendingOp === null || prevValue === null) return
    const result = computeBinary(prevValue, display, pendingOp, () => calcError)
    const isErr = isErrorResult(result, calcError)
    setDisplay(isErr ? '0' : result)
    setPrevValue(null)
    setPendingOp(null)
    setNextReplacesDisplay(true)
    if (!isProMode) setLastBasicExpression(`${prevValue} ${pendingOp} ${display}`)
    if (isProMode) setExpression((e) => (isErr ? '' : `${e.replace(/\s+$/, '')} ${display} =`))
  }, [display, pendingOp, prevValue, expression, calcError, isProMode])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setPendingOp(null)
    setPrevValue(null)
    setExpression('')
    setLastBasicExpression('')
  }, [])

  const handleClearEntry = useCallback(() => {
    setDisplay('0')
    setNextReplacesDisplay(true)
  }, [])

  const handleBackspace = useCallback(() => {
    setDisplay((cur) => getDisplayAfterBackspace(cur))
  }, [])

  const handleUnary = useCallback((op) => {
    const result = computeUnary(display, op, () => calcError)
    const isErr = isErrorResult(result, calcError)
    setDisplay(isErr ? '0' : result)
    if (isProMode && !isErr) {
      const part = op === '√' ? `√(${display})` : op === 'x²' ? `${display}²` : op === '1/x' ? `1/(${display})` : `${display}%`
      setExpression((e) => `${e.replace(/\s+$/, '')} ${part} = `)
    }
  }, [display, calcError, isProMode])

  const handleParenOpen = useCallback(() => {
    setExpression((e) => `${e.replace(/\s+$/, '')} ( `)
    setNextReplacesDisplay(true)
  }, [])

  const handleParenClose = useCallback(() => {
    setExpression((e) => `${e.replace(/\s+$/, '')} ${display} ) `)
    setDisplay('0')
    setNextReplacesDisplay(true)
  }, [display])

  const cardStyle = {
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : 'rgba(255, 255, 255, 0.95)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  }

  const btnStyle = {
    height: { xs: 48, sm: 54 },
    minWidth: 0,
    fontSize: '1.1rem',
    fontWeight: 600,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
  }

  const opBtnStyle = { ...btnStyle, bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main }
  const fnBtnStyle = { ...btnStyle, bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main }

  const basicExpressionLine = (pendingOp && prevValue) ? `${prevValue} ${pendingOp} ` : lastBasicExpression
  const modeButton = (
    <Button
      key="mode"
      variant="outlined"
      onClick={() => { setIsProMode((v) => !v); if (isProMode) handleClear() }}
      sx={{ ...btnStyle, color: 'primary.main', borderColor: 'primary.main' }}
      title={isProMode ? t('switchToBasic') : t('switchToPro')}
    >
      <SwapHorizIcon fontSize="small" />
    </Button>
  )

  const renderBasic = () => (
    <>
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.black, 0.3) : alpha(theme.palette.grey[200], 0.8),
          textAlign: 'right',
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 0.5,
        }}
      >
        {basicExpressionLine ? (
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {basicExpressionLine}
          </Typography>
        ) : null}
        <Typography variant="h5" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
          {display}
        </Typography>
      </Box>
      {/* Basic: 4 columns. Numpad order: row1 7,8,9 | row2 4,5,6 | row3 1,2,3 | row4 0,. — operators ÷ × − + on right */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          gridTemplateAreas: `
            "clear backspace empty div"
            "n7 n8 n9 mul"
            "n4 n5 n6 sub"
            "n1 n2 n3 add"
            "mode n0 decimal equals"
          `,
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={handleClear} sx={{ gridArea: 'clear', ...btnStyle, color: 'error.main' }}>C</Button>
        <Button variant="outlined" onClick={handleBackspace} sx={{ gridArea: 'backspace', ...btnStyle, color: 'error.main' }}><BackspaceIcon /></Button>
        <Button variant="outlined" sx={{ gridArea: 'empty', ...btnStyle, visibility: 'hidden' }} />
        <Button variant="outlined" onClick={() => handleOp('÷')} sx={{ gridArea: 'div', ...opBtnStyle }}>÷</Button>
        {['7', '8', '9'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('×')} sx={{ gridArea: 'mul', ...opBtnStyle }}>×</Button>
        {['4', '5', '6'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('−')} sx={{ gridArea: 'sub', ...opBtnStyle }}>−</Button>
        {['1', '2', '3'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('+')} sx={{ gridArea: 'add', ...opBtnStyle }}>+</Button>
        <Box sx={{ gridArea: 'mode' }}>{modeButton}</Box>
        <Button variant="outlined" onClick={() => applyInput('0')} sx={{ gridArea: 'n0', ...btnStyle }}>0</Button>
        <Button variant="outlined" onClick={() => applyInput('.')} sx={{ gridArea: 'decimal', ...btnStyle }}>.</Button>
        <Button variant="contained" onClick={handleEquals} sx={{ gridArea: 'equals', ...btnStyle, bgcolor: 'primary.main', color: 'primary.contrastText' }}>=</Button>
      </Box>
    </>
  )

  const renderPro = () => (
    <>
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.black, 0.3) : alpha(theme.palette.grey[200], 0.8),
          textAlign: 'right',
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 0.5,
        }}
      >
        {expression ? (
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', overflow: 'hidden', maxWidth: '100%' }}>
            {expression}
          </Typography>
        ) : null}
        <Typography variant="h4" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
          {formatDisplay(display)}
        </Typography>
      </Box>

      {/* DÜZELTİLMİŞ GRID YAPISI:
        Sütun 1: Fonksiyonlar (CE, √, x², Mode)
        Sütun 2: Sol Rakamlar (7, 4, 1, 0)
        Sütun 3: Orta Rakamlar (8, 5, 2, .)
        Sütun 4: Sağ Rakamlar (9, 6, 3, 1/x) - (1/x buraya alındı veya yer değişebilir)
        Sütun 5: İşlemler (÷, ×, -, +)
      */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gridTemplateAreas: `
            "clear open close back pct"
            "ce    n7   n8    n9   div"
            "sqrt  n4   n5    n6   mul"
            "sq    n1   n2    n3   sub"
            "mode  n0   decimal inv  add"
            "equals equals equals equals equals"
          `,
          gap: 1,
        }}
      >
        {/* Satır 1 */}
        <Button variant="outlined" onClick={handleClear} sx={{ gridArea: 'clear', ...btnStyle, color: 'error.main' }}>C</Button>
        <Button variant="outlined" onClick={handleParenOpen} sx={{ gridArea: 'open', ...fnBtnStyle }}>(</Button>
        <Button variant="outlined" onClick={handleParenClose} sx={{ gridArea: 'close', ...fnBtnStyle }}>)</Button>
        <Button variant="outlined" onClick={handleBackspace} sx={{ gridArea: 'back', ...btnStyle, color: 'error.main' }}><BackspaceIcon fontSize="small" /></Button>
        <Button variant="outlined" onClick={() => handleUnary('%')} sx={{ gridArea: 'pct', ...fnBtnStyle }}>%</Button>

        {/* Satır 2 */}
        <Button variant="outlined" onClick={handleClearEntry} sx={{ gridArea: 'ce', ...btnStyle, color: 'error.main' }}>CE</Button>
        {['7', '8', '9'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('÷')} sx={{ gridArea: 'div', ...opBtnStyle }}>÷</Button>

        {/* Satır 3 - sqrt başa alındı */}
        <Button variant="outlined" onClick={() => handleUnary('√')} sx={{ gridArea: 'sqrt', ...fnBtnStyle }}>√</Button>
        {['4', '5', '6'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('×')} sx={{ gridArea: 'mul', ...opBtnStyle }}>×</Button>
        
        {/* Satır 4 - x² başa alındı */}
        <Button variant="outlined" onClick={() => handleUnary('x²')} sx={{ gridArea: 'sq', ...fnBtnStyle }}>x²</Button>
        {['1', '2', '3'].map((key) => (
          <Button key={key} variant="outlined" onClick={() => applyInput(key)} sx={{ gridArea: `n${key}`, ...btnStyle }}>{key}</Button>
        ))}
        <Button variant="outlined" onClick={() => handleOp('−')} sx={{ gridArea: 'sub', ...opBtnStyle }}>−</Button>

        {/* Satır 5 */}
        <Box sx={{ gridArea: 'mode' }}>{modeButton}</Box>
        <Button variant="outlined" onClick={() => applyInput('0')} sx={{ gridArea: 'n0', ...btnStyle }}>0</Button>
        <Button variant="outlined" onClick={() => applyInput('.')} sx={{ gridArea: 'decimal', ...btnStyle }}>.</Button>
        <Button variant="outlined" onClick={() => handleUnary('1/x')} sx={{ gridArea: 'inv', ...fnBtnStyle }}>1/x</Button>
        <Button variant="outlined" onClick={() => handleOp('+')} sx={{ gridArea: 'add', ...opBtnStyle }}>+</Button>

        {/* Satır 6 - Geniş Eşittir */}
        <Button variant="contained" onClick={handleEquals} sx={{ gridArea: 'equals', ...btnStyle, bgcolor: 'primary.main', color: 'primary.contrastText' }}>=</Button>
      </Box>
    </>
  )

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 } }}>
      <Helmet>
        <title>{t('calculator')} | {t('appTitle')}</title>
        <meta name="description" content={t('calculatorDesc')} />
      </Helmet>
      <Box sx={{ mb: 3, textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          <CalculateIcon color="primary" />
          {t('calculator')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('calculatorShortDesc')}
        </Typography>
      </Box>

      <Card elevation={0} sx={cardStyle}>
        {isProMode ? renderPro() : renderBasic()}
      </Card>
    </Container>
  )
}
