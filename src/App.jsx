import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import { Helmet } from 'react-helmet-async'

// Config & Utils
import { createAppTheme } from './utils/theme'
import { toggleTheme } from './features/theme/themeSlice'

// Components & Routes
import AppRoutes from './routes/AppRoutes.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import CookieConsent from './components/CookieConsent.jsx'

export default function App() {
  const mode = useSelector((state) => state.theme?.mode || 'light')
  const dispatch = useDispatch()
  
  // Temayı oluştur
  const theme = React.useMemo(() => createAppTheme(mode), [mode])

  // Tema modunu localStorage'dan yükle (Sayfa yenilendiğinde)
  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode')
    if (savedMode && savedMode !== mode) {
      dispatch(toggleTheme())
    }
  }, [])

  // Tema modunu localStorage'a kaydet
  React.useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        {/* XSS Koruması ve Güvenlik Başlıkları */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        {/* Sadece kendi domaininden ve güvenli kaynaklardan script çalıştır */}
        {/* Not: Google Analytics veya Adsense eklersen burayı güncellemen gerekir */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://www.googletagmanager.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://formspree.io https://api.frankfurter.app https://www.google-analytics.com https://*.ingest.sentry.io; img-src 'self' data: https: https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;" />
      </Helmet>
      <CssBaseline />
      <ErrorBoundary>
        <AppRoutes />
        <CookieConsent />
      </ErrorBoundary>
    </ThemeProvider>
  )
}
