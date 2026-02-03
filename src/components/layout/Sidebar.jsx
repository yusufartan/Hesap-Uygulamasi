// c:\VS Code\Projects\Calculator-App\src\components\layout\Sidebar.jsx
// Sidebar Component
import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { menuItems } from '../../utils/menuItems'
import { useTranslation } from '../../hooks/useTranslation'

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
import InputBase from '@mui/material/InputBase'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import SearchIcon from '@mui/icons-material/Search'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import CalculateIcon from '@mui/icons-material/Calculate'

export const drawerWidth = 280

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(11)} + 1px)` },
})

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    position: 'fixed',
    height: '100vh',
    zIndex: theme.zIndex.drawer + 1,
    ...(open && { ...openedMixin(theme), '& .MuiDrawer-paper': { ...openedMixin(theme), display: 'flex', flexDirection: 'column' } }),
    ...(!open && { ...closedMixin(theme), '& .MuiDrawer-paper': { ...closedMixin(theme), display: 'flex', flexDirection: 'column' } }),
  }),
)

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.hover,
  '&:hover': { backgroundColor: theme.palette.action.selected },
  margin: theme.spacing(0, 2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  transition: theme.transitions.create(['background-color', 'margin'], { duration: theme.transitions.duration.standard }),
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

export default function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation() // Çeviri kancası
  
  const [searchQuery, setSearchQuery] = React.useState('')
  const listRef = React.useRef(null)

  const activeItem = React.useMemo(() => {
    const currentPath = location.pathname
    const item = menuItems.find(i => i.path === currentPath)
    return item ? item.id : 'dashboard'
  }, [location])

  React.useEffect(() => {
    const savedScroll = localStorage.getItem('navbarScroll')
    if (listRef.current && savedScroll) listRef.current.scrollTop = parseInt(savedScroll, 10)
  }, [])

  const handleScroll = () => { if (listRef.current) localStorage.setItem('navbarScroll', listRef.current.scrollTop) }
  const toggleColorMode = () => dispatch(toggleTheme())

  // Arama yaparken de çevrilmiş metin üzerinden ara
  const filteredMenuItems = menuItems.filter((item) => t(item.id).toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflow: 'hidden', opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}>
          <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            <CalculateIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" noWrap>{t('calculatorTools')}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" noWrap>{t('tools')}</Typography>
          </Box>
        </Box>
        <IconButton onClick={toggleDrawer} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, position: open ? 'relative' : 'absolute', left: open ? 'auto' : { xs: '20px', sm: '28px' }, transform: open ? 'none' : 'rotate(180deg)', transition: 'all 0.3s ease', width: 32, height: 32 }}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider sx={{ my: 1, opacity: 0.5 }} />
      <Tooltip title={!open ? t('search') : ''} placement="right">
        <Search onClick={() => !open && toggleDrawer()} sx={{ mx: open ? 2 : 'auto', width: open ? 'auto' : 48, justifyContent: open ? 'flex-start' : 'center', px: open ? 0 : 0, cursor: !open ? 'pointer' : 'default' }}>
          <SearchIconWrapper sx={{ px: open ? 2 : 1.5 }}><SearchIcon /></SearchIconWrapper>
          <StyledInputBase placeholder={t('search')} inputProps={{ 'aria-label': 'search' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ display: open ? 'block' : 'none' }} />
        </Search>
      </Tooltip>
      <List ref={listRef} onScroll={handleScroll} sx={{ flexGrow: 1, px: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? t(item.id) : ''} placement="right">
              <ListItemButton selected={activeItem === item.id} onClick={() => navigate(item.path)} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, '&.Mui-selected': { backgroundColor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' }, '&:hover': { backgroundColor: 'primary.dark' } } }}>
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto', justifyContent: 'center', color: activeItem === item.id ? 'inherit' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.id)} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ opacity: 0.5 }} />
      <List sx={{ px: 1 }}>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2, p: open ? '8px 16px' : '8px 0', mx: 1, mb: 1, minHeight: 48 }}>
            {open && (<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{theme.palette.mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}<Typography variant="body2" fontWeight="medium">{theme.palette.mode === 'dark' ? t('darkMode') : t('lightMode')}</Typography></Box>)}
            {open ? (<Switch checked={theme.palette.mode === 'dark'} onChange={toggleColorMode} size="small" />) : (<IconButton onClick={toggleColorMode} size="small">{theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>)}
          </Box>
        </ListItem>
      </List>
    </Drawer>
  )
}
