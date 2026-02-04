// Dashboard Layout
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Sidebar from './Sidebar'
import Navbar, { desktopNavbarHeight, mobileNavbarHeight } from './Navbar'
import Footer from '../Footer'
import ErrorBoundary from '../ErrorBoundary'
import CustomBreadcrumbs from '../CustomBreadcrumbs'
import SEOUpdater from '../SEOUpdater'
import Fab from '@mui/material/Fab'
import Box from '@mui/material/Box'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Zoom from '@mui/material/Zoom'
import CircularProgress from '@mui/material/CircularProgress'

export default function DashboardLayout() {
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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

  const navbarHeight = isMobile ? mobileNavbarHeight : desktopNavbarHeight

  return (
    <Box sx={{ display: 'block', height: '100vh', position: 'relative' }}>
      <SEOUpdater />
      <Navbar open={open} onMenuClick={toggleDrawer} />
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
          pt: `${navbarHeight}px`,
        }}
      >
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