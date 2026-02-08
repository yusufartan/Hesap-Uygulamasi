import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#695CFE',
    },
    background: {
      default: mode === 'light' ? '#F2F5F9' : '#121212',
      paper: mode === 'light' ? '#fff' : '#242526',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.75rem' },
    h2: { fontSize: '1.5rem' },
    h3: { fontSize: '1.25rem' },
    h4: { fontSize: '1.125rem' },
    h5: { fontSize: '1rem' },
    h6: { fontSize: '0.9375rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    button: { fontSize: '0.8125rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@keyframes gradientBG': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        body: {
          background: mode === 'light'
            ? 'linear-gradient(-45deg, #ffffff, #f5f3ff, #ede9fe, #f0fdf4)'
            : 'linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #0f172a)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite',
          minHeight: '100vh',
          scrollbarColor: mode === 'dark' ? '#6b6b6b #2b2b2b' : '#b0b0b0 #f5f5f5',
        },
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: mode === 'dark' ? '#6b6b6b' : '#b0b0b0',
          minHeight: 24,
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: mode === 'dark' ? '#959595' : '#808080',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          textTransform: 'none',
          [theme.breakpoints.down('sm')]: {
            padding: '6px 14px',
            fontSize: '0.8125rem',
            minHeight: 36,
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            padding: 6,
            '& .MuiSvgIcon-root': { fontSize: '1.2rem' },
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            '& .MuiInputBase-root': { fontSize: '0.875rem' },
            '& .MuiInputBase-input': { padding: '10px 14px' },
            '& .MuiOutlinedInput-input': { padding: '10px 14px' },
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem',
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            '& .MuiCardContent-root': { padding: 12 },
            '& .MuiCardActionArea-root': { padding: 12 },
          },
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            padding: 12,
            '&:last-child': { paddingBottom: 12 },
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          margin: '4px 8px',
          minHeight: 48,
          [theme.breakpoints.down('sm')]: {
            minHeight: 44,
            margin: '2px 6px',
            paddingLeft: 10,
            paddingRight: 10,
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: 40,
          [theme.breakpoints.down('sm')]: {
            minWidth: 36,
            '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
          },
        }),
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            width: 40,
            height: 40,
            right: 16,
            bottom: 24,
            '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '1.5rem' } }),
        h2: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '1.25rem' } }),
        h3: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '1.125rem' } }),
        h4: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '1rem' } }),
        h5: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.9375rem' } }),
        h6: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' } }),
        body1: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.8125rem' } }),
        body2: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.75rem' } }),
        subtitle1: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.8125rem' } }),
        subtitle2: ({ theme }) => ({ [theme.breakpoints.down('sm')]: { fontSize: '0.75rem' } }),
      },
    },
  },
})