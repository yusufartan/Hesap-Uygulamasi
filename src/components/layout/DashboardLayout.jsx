// Dashboard Layout
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar, { DrawerHeader } from './Sidebar'
import Footer from '../Footer'
import ErrorBoundary from '../ErrorBoundary'
import LanguageSwitcher from '../LanguageSwitcher'
import CustomBreadcrumbs from '../CustomBreadcrumbs'
import Fab from '@mui/material/Fab'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Zoom from '@mui/material/Zoom'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export default function DashboardLayout() {
  const location = useLocation()
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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <Box 
        component="main" 
        ref={mainRef}
        onScroll={handleScroll}
        onClick={() => { if (open) setOpen(false) }} 
        sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', display: 'flex', flexDirection: 'column', ml: (theme) => ({ xs: `calc(${theme.spacing(9)} + 1px)`, sm: `calc(${theme.spacing(11)} + 1px)` }) }}
      >
        <DrawerHeader />
        
        {/* SAĞ ÜST DİL DEĞİŞTİRİCİ */}
        <Box sx={{ position: 'absolute', top: 16, right: 24, zIndex: 1200 }}>
          <LanguageSwitcher />
        </Box>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <CustomBreadcrumbs />
          {/* Hata Kalkanı: Sadece içerik alanı çökerse burası devreye girer, Menü sabit kalır */}
          <ErrorBoundary>
            <React.Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}><Outlet /></React.Suspense>
          </ErrorBoundary>
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