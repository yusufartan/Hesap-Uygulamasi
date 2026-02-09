// Dashboard Layout
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Sidebar, { sidebarMiniWidth } from './Sidebar'
import Navbar, { desktopNavbarHeight, mobileNavbarHeight, secondaryBarHeight } from './Navbar'
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
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [showScrollTop, setShowScrollTop] = React.useState(false)
  const mainRef = React.useRef(null)
  
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved !== null ? saved === 'true' : window.innerWidth > 900
  })

  React.useEffect(() => { localStorage.setItem('sidebarOpen', sidebarOpen) }, [sidebarOpen])
  React.useEffect(() => {
    if (window.innerWidth < 900) setSidebarOpen(false)
    setMobileMenuOpen(false)
  }, [location])

  // Sayfa değiştiğinde scroll: hash varsa ilgili kategoriye, yoksa en üste
  React.useEffect(() => {
    if (!mainRef.current) return
    if (location.hash) {
      const id = location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        const t = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
        return () => clearTimeout(t)
      }
    }
    mainRef.current.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  // Breakpoint değişince tek menü kaynağı: mobilde dropdown, tablette sidebar, masaüstünde ikincil bar. Diğerleri kapalı.
  React.useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false)
  }, [isMobile])
  React.useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  const toggleMobileMenu = () => setMobileMenuOpen((o) => !o)
  const toggleSidebar = () => setSidebarOpen((o) => !o)

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

  const navbarHeight = isMobile
    ? mobileNavbarHeight
    : desktopNavbarHeight + (isDesktop ? secondaryBarHeight : 0)

  const isTablet = !isMobile && !isDesktop
  const navbarRightOffset = isTablet ? sidebarMiniWidth : 0

  return (
    <Box sx={{ display: 'block', height: '100vh', position: 'relative' }}>
      <SEOUpdater />
      <Navbar mobileMenuOpen={mobileMenuOpen} onMenuClick={toggleMobileMenu} rightOffset={navbarRightOffset} />
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Box
        component="main"
        ref={mainRef}
        onScroll={handleScroll}
        onClick={() => {
          if (mobileMenuOpen) toggleMobileMenu()
          if (sidebarOpen) toggleSidebar()
        }}
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
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box sx={{ width: '100%', flex: 1 }}>
            <CustomBreadcrumbs />
            {/* Hata Kalkanı: Sadece içerik alanı çökerse burası devreye girer */}
            <ErrorBoundary>
              <React.Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>}><Outlet key={location.pathname} /></React.Suspense>
            </ErrorBoundary>
          </Box>
        </Box>
        <Footer />
      </Box>

      {/* Yukarı Çık Butonu — main dışında, sidebar üstünde görünsün */}
      <Zoom in={showScrollTop}>
        <Fab 
          color="primary" 
          size="small" 
          onClick={scrollToTop}
          sx={{ position: 'fixed', bottom: 32, left: 32, zIndex: 1400 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  )
}