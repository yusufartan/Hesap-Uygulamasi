import { Box, Button, useTheme, alpha } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ClearIcon from '@mui/icons-material/Clear';

const ROW_GAP = 6;
const COL_GAP = 8;

const LAYOUT = [
  [
    { key: 'C', type: 'action', icon: true },
    { key: 'DEL', type: 'action', icon: true },
    { key: '%', type: 'operator' },
    { key: '/', type: 'operator', label: '÷' },
  ],
  [
    { key: '7', type: 'digit' },
    { key: '8', type: 'digit' },
    { key: '9', type: 'digit' },
    { key: '*', type: 'operator', label: '×' },
  ],
  [
    { key: '4', type: 'digit' },
    { key: '5', type: 'digit' },
    { key: '6', type: 'digit' },
    { key: '-', type: 'operator', label: '−' },
  ],
  [
    { key: '1', type: 'digit' },
    { key: '2', type: 'digit' },
    { key: '3', type: 'digit' },
    { key: '+', type: 'operator' },
  ],
  [
    { key: '00', type: 'digit' },
    { key: '0', type: 'digit' },
    { key: '.', type: 'digit' },
    { key: '=', type: 'equals' },
  ],
];

/**
 * Sanal numpad — CSS Grid ile sabit 4 sütun, boşluklar piksel.
 * compact: küçük tuşlar (indirim sayfası vb.)
 */
function VirtualNumpad({ onKeyPress, compact = false, ...boxProps }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const keyMinHeight = compact ? 36 : 44;
  const keyFontSize = compact ? '0.9rem' : '1.1rem';
  const borderRadius = compact ? 2 : 4;

  const baseSx = {
    minHeight: keyMinHeight,
    borderRadius,
    fontSize: keyFontSize,
    fontWeight: 600,
    boxShadow: compact ? 0 : 1,
    transition: 'transform 0.1s ease, box-shadow 0.2s ease',
    '&:active': { transform: 'scale(0.96)' },
  };

  const digitSx = {
    ...baseSx,
    color: theme.palette.text.primary,
    bgcolor: isDark ? alpha(theme.palette.grey[800], 0.8) : theme.palette.grey[100],
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    '&:hover': {
      bgcolor: isDark ? theme.palette.grey[700] : theme.palette.grey[200],
      boxShadow: 2,
    },
  };

  const operatorSx = {
    ...baseSx,
    color: theme.palette.primary.main,
    bgcolor: alpha(theme.palette.primary.main, 0.12),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, 0.2),
      boxShadow: 2,
    },
  };

  const actionSx = {
    ...baseSx,
    color: theme.palette.error.main,
    bgcolor: alpha(theme.palette.error.main, 0.1),
    border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
    '&:hover': {
      bgcolor: alpha(theme.palette.error.main, 0.18),
      boxShadow: 2,
    },
  };

  const equalsSx = {
    ...baseSx,
    color: theme.palette.primary.contrastText,
    bgcolor: theme.palette.primary.main,
    border: 'none',
    boxShadow: 2,
    '&:hover': {
      bgcolor: theme.palette.primary.dark,
      boxShadow: 4,
    },
  };

  const getStyle = (type) => {
    switch (type) {
      case 'operator':
        return operatorSx;
      case 'action':
        return actionSx;
      case 'equals':
        return equalsSx;
      default:
        return digitSx;
    }
  };

  const renderCell = (item, index) => {
    const sx = getStyle(item.type);
    const label = item.label ?? item.key;
    const icon =
      item.key === 'C' ? (
        <ClearIcon fontSize="small" aria-label="Temizle" />
      ) : item.key === 'DEL' ? (
        <BackspaceIcon fontSize="small" aria-label="Sil" />
      ) : null;

    return (
      <Button
        key={`${index}-${item.key}`}
        fullWidth
        disableRipple
        variant="text"
        onClick={() => onKeyPress(item.key)}
        sx={{ ...sx }}
      >
        {icon ?? label}
      </Button>
    );
  };

  const flatKeys = LAYOUT.flat();

  return (
    <Box
      sx={{
        width: compact ? 320 : '100%',
        maxWidth: compact ? 320 : 400,
        flexShrink: 0,
        mx: compact ? 0 : 'auto',
        p: compact ? 1.25 : 2,
        boxSizing: 'border-box',
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
      {...boxProps}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: `${ROW_GAP}px ${COL_GAP}px`,
          width: '100%',
        }}
      >
        {flatKeys.map(renderCell)}
      </Box>
    </Box>
  );
}

export default VirtualNumpad;
