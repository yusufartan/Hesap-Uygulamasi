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
          width: '8px',
          height: '8px',
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
        },
      },
    },
  },
})