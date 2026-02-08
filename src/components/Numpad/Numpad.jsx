import React from 'react'
import { Box, Card, Button, useTheme, alpha } from '@mui/material'
import BackspaceIcon from '@mui/icons-material/Backspace'
import DragHandleIcon from '@mui/icons-material/DragHandle'

/**
 * Ortak numpad bileşeni — tüm hesaplama araçlarında aynı MUI tabanlı tasarım.
 * layout: 'simple' | 'calculator' | 'temp' | 'hex'
 * onKeyPress: (key: string) => void
 * isKeyDisabled: (key: string) => boolean — sadece hex layout için (opsiyonel)
 */
const KEY_HEIGHT = { xs: 48, sm: 52, md: 56 }
const KEY_FONT = { xs: '1.1rem', md: '1.25rem' }
const KEY_BORDER_RADIUS = 2
const GRID_GAP = 1.5

function useNumpadStyles() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const digit = {
    minHeight: KEY_HEIGHT,
    borderRadius: KEY_BORDER_RADIUS,
    fontSize: KEY_FONT,
    fontWeight: 600,
    color: theme.palette.text.primary,
    bgcolor: isDark ? alpha(theme.palette.background.paper, 0.9) : theme.palette.grey[100],
    border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
    boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      color: theme.palette.primary.main,
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    '&:active': { transform: 'scale(0.98)' },
  }

  const operator = {
    ...digit,
    bgcolor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.2),
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.18),
      color: theme.palette.primary.main,
      borderColor: alpha(theme.palette.primary.main, 0.4),
    },
  }

  const action = {
    ...digit,
    color: theme.palette.error.main,
    bgcolor: alpha(theme.palette.error.main, 0.08),
    borderColor: alpha(theme.palette.error.main, 0.2),
    '&:hover': {
      bgcolor: alpha(theme.palette.error.main, 0.14),
      color: theme.palette.error.main,
      borderColor: alpha(theme.palette.error.main, 0.35),
    },
  }

  const equals = {
    ...digit,
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: 'none',
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`,
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
  }

  const card = {
    p: 2,
    borderRadius: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    bgcolor: isDark ? alpha(theme.palette.background.paper, 0.5) : alpha(theme.palette.background.paper, 0.8),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: theme.shadows[1],
  }

  const grid = (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: GRID_GAP,
    width: '100%',
    maxWidth: 400,
    mx: 'auto',
  })

  return { digit, operator, action, equals, card, grid }
}

export function NumpadSimple({ onKeyPress }) {
  const { digit, action, card, grid } = useNumpadStyles()
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', 'DEL']

  return (
    <Card elevation={0} sx={card}>
      <Box sx={grid(3)}>
        {keys.map((key) => (
          <Button
            key={key}
            fullWidth
            disableRipple
            variant="text"
            onClick={() => onKeyPress(key)}
            sx={key === 'DEL' ? { ...action, minHeight: KEY_HEIGHT, borderRadius: KEY_BORDER_RADIUS, fontSize: KEY_FONT } : { ...digit }}
          >
            {key === 'DEL' ? <BackspaceIcon fontSize="small" /> : key}
          </Button>
        ))}
      </Box>
    </Card>
  )
}

export function NumpadCalculator({ onKeyPress }) {
  const { digit, operator, action, equals, card, grid } = useNumpadStyles()

  const row1 = [
    { key: 'C', style: action, label: 'C' },
    { key: 'DEL', style: action, icon: <BackspaceIcon fontSize="small" /> },
    { key: '%', style: operator, label: '%' },
    { key: '/', style: operator, label: '÷' },
  ]
  const row2 = [
    { key: '7', style: digit }, { key: '8', style: digit }, { key: '9', style: digit },
    { key: '*', style: operator, label: '×' },
  ]
  const row3 = [
    { key: '4', style: digit }, { key: '5', style: digit }, { key: '6', style: digit },
    { key: '-', style: operator, label: '−' },
  ]
  const row4 = [
    { key: '1', style: digit }, { key: '2', style: digit }, { key: '3', style: digit },
    { key: '+', style: operator, label: '+' },
  ]
  const row5 = [
    { key: '00', style: digit }, { key: '0', style: digit }, { key: '.', style: digit },
    { key: '=', style: equals, icon: <DragHandleIcon fontSize="small" /> },
  ]

  const renderBtn = (item) => (
    <Button
      key={item.key}
      fullWidth
      disableRipple
      variant="text"
      onClick={() => onKeyPress(item.key)}
      sx={{ ...item.style, minHeight: KEY_HEIGHT, borderRadius: KEY_BORDER_RADIUS, fontSize: KEY_FONT }}
    >
      {item.icon ?? (item.label ?? item.key)}
    </Button>
  )

  return (
    <Card elevation={0} sx={card}>
      <Box sx={grid(4)}>
        {row1.map(renderBtn)}
        {row2.map(renderBtn)}
        {row3.map(renderBtn)}
        {row4.map(renderBtn)}
        {row5.map(renderBtn)}
      </Box>
    </Card>
  )
}

export function NumpadTemp({ onKeyPress }) {
  const { digit, action, card, grid } = useNumpadStyles()

  return (
    <Card elevation={0} sx={card}>
      <Box sx={{ ...grid(3), gridTemplateColumns: '1fr 1fr 1fr' }}>
        <Button fullWidth disableRipple variant="text" onClick={() => onKeyPress('C')} sx={{ ...action, minHeight: KEY_HEIGHT, borderRadius: KEY_BORDER_RADIUS, fontSize: KEY_FONT }}>C</Button>
        <Button fullWidth disableRipple variant="text" onClick={() => onKeyPress('DEL')} sx={{ ...action, minHeight: KEY_HEIGHT, borderRadius: KEY_BORDER_RADIUS, fontSize: KEY_FONT, gridColumn: 'span 2' }}><BackspaceIcon fontSize="small" /></Button>
        {['7', '8', '9'].map((k) => <Button key={k} fullWidth disableRipple variant="text" onClick={() => onKeyPress(k)} sx={{ ...digit }}>{k}</Button>)}
        {['4', '5', '6'].map((k) => <Button key={k} fullWidth disableRipple variant="text" onClick={() => onKeyPress(k)} sx={{ ...digit }}>{k}</Button>)}
        {['1', '2', '3'].map((k) => <Button key={k} fullWidth disableRipple variant="text" onClick={() => onKeyPress(k)} sx={{ ...digit }}>{k}</Button>)}
        <Button fullWidth disableRipple variant="text" onClick={() => onKeyPress('+/-')} sx={{ ...digit }}>+/-</Button>
        <Button fullWidth disableRipple variant="text" onClick={() => onKeyPress('0')} sx={{ ...digit }}>0</Button>
        <Button fullWidth disableRipple variant="text" onClick={() => onKeyPress('.')} sx={{ ...digit }}>.</Button>
      </Box>
    </Card>
  )
}

export function NumpadHex({ onKeyPress, isKeyDisabled }) {
  const { digit, action, card } = useNumpadStyles()
  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: GRID_GAP, width: '100%', maxWidth: 360, mx: 'auto' }

  const renderKey = (key, style = digit, label = key) => (
    <Button
      key={key}
      fullWidth
      disableRipple
      variant="text"
      disabled={typeof isKeyDisabled === 'function' && isKeyDisabled(key)}
      onClick={() => onKeyPress(key)}
      sx={{ ...style, minHeight: KEY_HEIGHT, borderRadius: KEY_BORDER_RADIUS, fontSize: KEY_FONT }}
    >
      {label}
    </Button>
  )

  return (
    <Card elevation={0} sx={card}>
      <Box sx={grid4}>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((k) => renderKey(k))}
        <Box sx={{ gridColumn: 'span 2' }} />
        {['7', '8', '9'].map((k) => renderKey(k))}
        {renderKey('C', action, 'C')}
        {['4', '5', '6'].map((k) => renderKey(k))}
        {renderKey('DEL', action, <BackspaceIcon fontSize="small" />)}
        {['1', '2', '3', '0'].map((k) => renderKey(k))}
      </Box>
    </Card>
  )
}

export default function Numpad({ layout = 'simple', onKeyPress, isKeyDisabled }) {
  if (layout === 'calculator') return <NumpadCalculator onKeyPress={onKeyPress} />
  if (layout === 'temp') return <NumpadTemp onKeyPress={onKeyPress} />
  if (layout === 'hex') return <NumpadHex onKeyPress={onKeyPress} isKeyDisabled={isKeyDisabled} />
  return <NumpadSimple onKeyPress={onKeyPress} />
}
