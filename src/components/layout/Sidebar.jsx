import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { useLocation, Link } from 'react-router-dom'
import { toolsConfig } from '../../config/toolsConfig'
import { useTranslation } from '../../hooks/useTranslation'
import { mobileNavbarHeight as mobileNavHeight, desktopNavbarHeight } from './Navbar'

import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import CalculateIcon from '@mui/icons-material/Calculate'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

/** Açık sidebar genişliği */
export const drawerWidth = 280
/** Kapalı (mini) sidebar genişliği — Main marginLeft ile aynı (sabit 65px) */
export const sidebarMiniWidth = 65
/** Mobil navbar yüksekliği (px) — main content paddingTop ile eşleşmeli */
export const mobileNavbarHeight = 56

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  [theme.breakpoints.down('sm')]: {
    minHeight: 52,
    padding: theme.spacing(0, 1.5),
  },
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: open ? drawerWidth : sidebarMiniWidth,
    height: '100vh',
    zIndex: 1300,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    pointerEvents: 'auto',
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      position: 'fixed',
      right: 0,
      left: 'auto',
      zIndex: 1300,
      top: 0,
      bottom: 0,
      height: '100vh',
      width: open ? drawerWidth : sidebarMiniWidth,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      display: 'flex',
      flexDirection: 'column',
      borderLeft: `1px solid ${theme.palette.divider}`,
      boxSizing: 'border-box',
      margin: 0,
      ...(open && {
        boxShadow: theme.shadows[8],
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
      }),
    },
  })
)

const allItems = toolsConfig.flatMap((category) =>
  category.items.map((item) => ({ ...item, categoryId: category.id }))
)

const CATEGORY_TITLE_KEYS = {
  genel: 'categoryGenel',
  finance: 'categoryFinance',
  health: 'categoryHealth',
  time: 'categoryTime',
  'unit-converters': 'categoryUnitConverters',
  'math-data': 'categoryMathData',
}

export default function Sidebar({ mobileMenuOpen, toggleMobileMenu, sidebarOpen, toggleSidebar }) {
  const theme = useTheme()
  const location = useLocation()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const [openCategories, setOpenCategories] = React.useState(() => ({
    genel: true,
    finance: false,
    health: false,
    time: false,
    'unit-converters': false,
    'math-data': false,
  }))
  const listRef = React.useRef(null)
  const categoryJustOpenedRef = React.useRef(null)

  const currentPath = location.pathname
  const activeItemId = React.useMemo(() => {
    const item = allItems.find((i) => i.path === currentPath)
    return item ? item.id : 'dashboard'
  }, [currentPath])

  React.useEffect(() => {
    const savedScroll = localStorage.getItem('navbarScroll')
    if (listRef.current && savedScroll) listRef.current.scrollTop = parseInt(savedScroll, 10)
  }, [])

  const handleScroll = () => {
    if (listRef.current) localStorage.setItem('navbarScroll', String(listRef.current.scrollTop))
  }

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => {
      const willBeOpen = !prev[categoryId]
      if (willBeOpen) {
        categoryJustOpenedRef.current = categoryId
        const next = {}
        toolsConfig.forEach((cat) => { next[cat.id] = cat.id === categoryId })
        return next
      }
      return { ...prev, [categoryId]: false }
    })
  }

  const handleCategoryClick = (categoryId) => {
    if (!sidebarOpen) {
      toggleSidebar()
      categoryJustOpenedRef.current = categoryId
      const next = {}
      toolsConfig.forEach((cat) => { next[cat.id] = cat.id === categoryId })
      setOpenCategories(next)
    } else {
      toggleCategory(categoryId)
    }
  }

  // Açılan kategori + içeriğini görünür yap: animasyon bittikten sonra başlığı en üste kaydır
  const COLLAPSE_DURATION_MS = 400
  React.useEffect(() => {
    const id = categoryJustOpenedRef.current
    if (!id || !listRef.current) return
    categoryJustOpenedRef.current = null
    const list = listRef.current
    const el = list.querySelector(`[data-category-id="${id}"]`)
    if (!el) return
    const scrollToCategory = () => {
      const listRect = list.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const relativeTop = elRect.top - listRect.top
      const targetScroll = list.scrollTop + relativeTop
      list.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' })
    }
    const t = setTimeout(scrollToCategory, COLLAPSE_DURATION_MS)
    return () => clearTimeout(t)
  }, [openCategories])

  const selectedStyles = {
    backgroundColor: 'primary.main',
    color: '#fff',
    '& .MuiListItemIcon-root': { color: '#fff' },
    '&:hover': { backgroundColor: 'primary.dark' },
  }

  /** Mobilde menü her zaman geniş; tablette sidebar open state'e bağlı */
  const menuExpanded = isMobile ? true : sidebarOpen

  // Masaüstünde sidebar gösterme (sadece tablet/mobil). Hook'lar hep aynı sırada çağrılsın diye tüm hook'lardan sonra return.
  if (isDesktop) return null

  // Mobil: Sadece dropdown (navbar Navbar.jsx'te; dropdown navbar altında, arama yok)
  if (isMobile) {
    return (
      <MuiDrawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{ zIndex: 1200 }}
        PaperProps={{
          sx: (theme) => ({
            height: '75vh',
            maxHeight: '75vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            top: mobileNavHeight,
            left: 12,
            right: 12,
            width: 'auto',
            maxWidth: 420,
            margin: '0 auto',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 24px 48px rgba(0,0,0,0.4)'
              : '0 24px 48px rgba(0,0,0,0.12)',
          }),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">{t('menu') || 'Menü'}</Typography>
          <IconButton onClick={toggleMobileMenu} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List ref={listRef} onScroll={handleScroll} sx={{ flexGrow: 1, px: 1.5, py: 1, overflowY: 'auto' }}>
            {toolsConfig.map((category) => {
                const isCategoryOpen = openCategories[category.id] ?? false
                const hasItems = category.items.length > 0
                return (
                  <React.Fragment key={category.id}>
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        data-category-id={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        sx={{ minHeight: 48, px: 2.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: 'text.secondary' }}>
                          {category.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={t(CATEGORY_TITLE_KEYS[category.id]) || category.title}
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            },
                          }}
                        />
                        {hasItems && (isCategoryOpen ? <ExpandLess sx={{ color: 'primary.main' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />)}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={isCategoryOpen} timeout={400} unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 1, pb: 0.5 }}>
                        {category.items.map((item) => {
                          const isSelected = activeItemId === item.id
                          return (
                            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                              <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={toggleMobileMenu}
                                selected={isSelected}
                                sx={{ minHeight: 44, pl: 4, pr: 2.5, borderRadius: 2, '&.Mui-selected': selectedStyles }}
                              >
                                <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: isSelected ? 'inherit' : 'text.secondary' }}>
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={t(item.id) || item.title}
                                  primaryTypographyProps={{
                                    sx: { color: isSelected ? 'inherit' : (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800') },
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          )
                        })}
                      </List>
                    </Collapse>
                  </React.Fragment>
                )
              })}
          </List>
        </MuiDrawer>
    )
  }

  // Tablet: Hamburger ile açılan üst dropdown + sağda kalıcı sidebar
  const topDrawerContent = (
    <MuiDrawer
      anchor="top"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{ zIndex: 1200 }}
      PaperProps={{
        sx: (theme) => ({
          height: '75vh',
          maxHeight: '75vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          top: desktopNavbarHeight,
          left: 12,
          right: 12,
          width: 'auto',
          maxWidth: 420,
          margin: '0 auto',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 48px rgba(0,0,0,0.4)'
            : '0 24px 48px rgba(0,0,0,0.12)',
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">{t('menu') || 'Menü'}</Typography>
        <IconButton onClick={toggleMobileMenu} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 1, overflowY: 'auto' }}>
        {toolsConfig.map((category) => {
            const isCategoryOpen = openCategories[category.id] ?? false
            const hasItems = category.items.length > 0
            return (
              <React.Fragment key={category.id}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton data-category-id={category.id} onClick={() => handleCategoryClick(category.id)} sx={{ minHeight: 48, px: 2.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: 'text.secondary' }}>{category.icon}</ListItemIcon>
                    <ListItemText primary={t(CATEGORY_TITLE_KEYS[category.id]) || category.title} primaryTypographyProps={{ sx: { fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.08em', textTransform: 'uppercase' } }} />
                    {hasItems && (isCategoryOpen ? <ExpandLess sx={{ color: 'primary.main' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />)}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isCategoryOpen} timeout={400} unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 1, pb: 0.5 }}>
                    {category.items.map((item) => {
                      const isSelected = activeItemId === item.id
                      return (
                        <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemButton component={Link} to={item.path} onClick={toggleMobileMenu} selected={isSelected} sx={{ minHeight: 44, pl: 4, pr: 2.5, borderRadius: 2, '&.Mui-selected': selectedStyles }}>
                            <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center', color: isSelected ? 'inherit' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(item.id) || item.title} primaryTypographyProps={{ sx: { color: isSelected ? 'inherit' : (th) => (th.palette.mode === 'dark' ? 'grey.300' : 'grey.800') } }} />
                          </ListItemButton>
                        </ListItem>
                      )
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            )
          })}
      </List>
    </MuiDrawer>
  )

  return (
    <>
      {mobileMenuOpen && topDrawerContent}
      <Drawer variant="permanent" open={sidebarOpen}>
      <DrawerHeader>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            position: sidebarOpen ? 'relative' : 'absolute',
            left: sidebarOpen ? 'auto' : { xs: '10px', sm: '14px' },
            transition: 'all 0.3s ease',
            width: 32,
            height: 32,
            zIndex: sidebarOpen ? 'auto' : 1,
          }}
        >
          {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflow: 'hidden',
            opacity: sidebarOpen ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: sidebarOpen ? 'auto' : 'none',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}
          >
            <CalculateIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>
              {t('calculatorTools')}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>
              {t('tools')}
            </Typography>
          </Box>
        </Box>
      </DrawerHeader>
      <Divider sx={{ my: 1, opacity: 0.5 }} />
      <List
        ref={listRef}
        onScroll={handleScroll}
        sx={{ flexGrow: 1, px: 1, overflowY: 'auto', overflowX: 'hidden' }}
      >
        {toolsConfig.map((category) => {
            const isCategoryOpen = openCategories[category.id] ?? false
            const hasItems = category.items.length > 0
            const showExpand = menuExpanded && hasItems

            return (
              <React.Fragment key={category.id}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <Tooltip
                    title={!menuExpanded ? (t(CATEGORY_TITLE_KEYS[category.id]) || category.title) : ''}
                    placement="left"
                  >
                    <ListItemButton
                      data-category-id={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      sx={{
                        minHeight: 48,
                        justifyContent: menuExpanded ? 'initial' : 'center',
                        px: 2.5,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: menuExpanded ? 2 : 'auto',
                          justifyContent: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        {category.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={t(CATEGORY_TITLE_KEYS[category.id]) || category.title}
                        sx={{ opacity: menuExpanded ? 1 : 0 }}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                        }}
                      />
                      {showExpand && (isCategoryOpen ? <ExpandLess sx={{ color: 'primary.main' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />)}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                {menuExpanded && (
                  <Collapse in={isCategoryOpen} timeout={400} unmountOnExit>
                    <List component="div" disablePadding>
                      {category.items.map((item) => {
                        const isSelected = activeItemId === item.id
                        return (
                          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
                            <Tooltip title={!menuExpanded ? (t(item.id) || item.title) : ''} placement="left">
                              <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={isSelected}
                                sx={{
                                  minHeight: 44,
                                  justifyContent: menuExpanded ? 'initial' : 'center',
                                  pl: menuExpanded ? 4 : 2.5,
                                  pr: 2.5,
                                  '&.Mui-selected': selectedStyles,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: menuExpanded ? 2 : 'auto',
                                    justifyContent: 'center',
                                    color: isSelected ? 'inherit' : 'text.secondary',
                                  }}
                                >
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={t(item.id) || item.title}
                                  sx={{ opacity: menuExpanded ? 1 : 0 }}
                                  primaryTypographyProps={{
                                    sx: { color: isSelected ? 'inherit' : (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800') },
                                  }}
                                />
                              </ListItemButton>
                            </Tooltip>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            )
          })}
      </List>
    </Drawer>
    </>
  )
}
