// Dashboard Layout
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import Sidebar, { DrawerHeader, mobileNavbarHeight } from './Sidebar'
import Footer from '../Footer'
import ErrorBoundary from '../ErrorBoundary'
import LanguageSwitcher from '../LanguageSwitcher'
import CustomBreadcrumbs from '../CustomBreadcrumbs'
import SEOUpdater from '../SEOUpdater'
import { toggleTheme } from '../../features/theme/themeSlice'
import { useTranslation } from '../../hooks/useTranslation'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Zoom from '@mui/material/Zoom'
import CircularProgress from '@mui/material/CircularProgress'

export default function DashboardLayout() {
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const mainRef = React.useRef(null)
  
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('navbarOpen')
    return saved !== null ? saved === 'true' : window.innerWidth > 900
  })

  React.useEffect(() => { localStorage.setItem('navbarOpen', open) }, [open])
  React.useEffect(() => { if (window.innerWidth < 900) setOpen(false) }, [location])

  const toggleDrawer = () => setOpen(!open)

  // Scroll olayını dinle
  const handleScroll = (event) => {
    const scrollTop = event.target.scrollTop
    setShowScrollTop(scrollTop > 300)
  }

  // En yukarı çık
  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Box sx={{ display: 'block', height: '100vh', position: 'relative' }}>
      <SEOUpdater />
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        ref={mainRef}
        onScroll={handleScroll}
        onClick={() => open && toggleDrawer()}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 0,
          pt: { xs: `${mobileNavbarHeight}px`, md: 0 },
        }}
      >
        <DrawerHeader />

        {/* SAĞ ÜST: Tema toggle + Dil değiştirici — mobilde navbar altında görünsün */}
        <Box sx={{ position: 'absolute', top: { xs: `${mobileNavbarHeight + 8}px`, md: 2 }, right: { xs: 12, sm: 24 }, zIndex: 1200, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={theme.palette.mode === 'dark' ? t('lightMode') : t('darkMode')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {theme.palette.mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={() => dispatch(toggleTheme())}
                size="small"
                color="primary"
              />
            </Box>
          </Tooltip>
          <LanguageSwitcher />
        </Box>

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
            <CustomBreadcrumbs />
            {/* Hata Kalkanı: Sadece içerik alanı çökerse burası devreye girer */}
            <ErrorBoundary>
              <React.Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}><Outlet key={location.pathname} /></React.Suspense>
            </ErrorBoundary>
          </Box>
        </Box>
        <Footer />
        
        {/* Yukarı Çık Butonu */}
        <Zoom in={showScrollTop}>
          <Fab 
            color="primary" 
            size="small" 
            onClick={scrollToTop}
            sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>
      </Box>
    </Box>
  )
}