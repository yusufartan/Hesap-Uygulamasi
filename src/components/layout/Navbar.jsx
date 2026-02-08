import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme, alpha } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import ToggleButton from '@mui/material/ToggleButton'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
// i18n: useTranslation provides t('key') from react-i18next (see hooks/useTranslation.js)
import { useTranslation } from '../../hooks/useTranslation'
import LanguageSwitcher from '../LanguageSwitcher'
import { toolsConfig } from '../../config/toolsConfig'

import logoImg from '../../assets/icons/HesapMerkez.png'

const genelCategory = toolsConfig.find((c) => c.id === 'genel')
const generalItems = genelCategory ? genelCategory.items : []
const allItems = toolsConfig.flatMap((cat) => cat.items.map((item) => ({ ...item, categoryId: cat.id })))

/** Masaüstü navbar yüksekliği */
export const desktopNavbarHeight = 64
/** Masaüstü ikincil kategori çubuğu yüksekliği */
export const secondaryBarHeight = 48
/** Mobil navbar yüksekliği (logo satırı + arama satırı) */
export const mobileNavbarHeight = 56 + 52

export default function Navbar({ mobileMenuOpen, onMenuClick, rightOffset = 0 }) {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t, getToolTitle, getCategoryTitle } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchPopoverAnchor, setSearchPopoverAnchor] = useState(null)
  const [activeMenuId, setActiveMenuId] = useState(null)

  // Ekran daralıp tablet/mobil moda geçince açık kategori menüsünü kapat
  useEffect(() => {
    if (!isDesktop) setActiveMenuId(null)
  }, [isDesktop])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return allItems.filter(
      (item) =>
        getToolTitle(item.id).toLowerCase().includes(q)
    )
  }, [searchQuery, getToolTitle])

  const handleSearchSelect = (path) => {
    navigate(path)
    setSearchQuery('')
    setSearchFocused(false)
  }

  if (isMobile) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Satır 1: Logo + Hamburger + Tema + Dil */}
        <Box
          sx={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pl: 4,
            pr: 2,
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box
              component="img"
              src={logoImg}
              alt="Hesap Merkez"
              sx={{
                height: 56,
                width: 'auto',
                ...(theme.palette.mode === 'dark' && { filter: 'invert(1)' }),
              }}
            />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={theme.palette.mode === 'dark' ? t('lightMode') : t('darkMode')}>
              <ToggleButton
                value="theme"
                selected={theme.palette.mode === 'dark'}
                onChange={() => dispatch(toggleTheme())}
                size="small"
                sx={{
                  border: 'none',
                  borderRadius: 2,
                  p: 0.75,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'action.selected',
                    color: theme.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.main',
                    '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'action.hover' },
                  },
                }}
              >
                {theme.palette.mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
              </ToggleButton>
            </Tooltip>
            <LanguageSwitcher />
            <IconButton onClick={onMenuClick} aria-label="menu" color="inherit" size="large">
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
        {/* Satır 2: Uzun arama çubuğu */}
        <Box sx={{ position: 'relative', pl: 4, pr: 2, pb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              bgcolor: theme.palette.action.hover,
              px: 1.5,
              py: 0.75,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 22 }} />
            <InputBase
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              inputProps={{ 'aria-label': 'search' }}
              sx={{ flex: 1, fontSize: '0.95rem' }}
            />
          </Box>
          {searchFocused && searchResults.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                left: 16,
                right: 16,
                mt: 0.5,
                maxHeight: 280,
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                zIndex: 1400,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {searchResults.slice(0, 8).map((item) => (
                <Box
                  key={item.id}
                  component={Link}
                  to={item.path}
                  onClick={() => handleSearchSelect(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  {item.icon}
                  <span>{getToolTitle(item.id)}</span>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  // Masaüstü: Logo | Arama | Genel araçlar | [Tablet: Hamburger] | Theme | Dil + isDesktop: Secondary Category Bar
  return (
    <>
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: rightOffset || 0,
        height: desktopNavbarHeight,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        pl: 4,
        pr: 2,
        gap: 2,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark'
          ? `0 1px 0 0 ${alpha(theme.palette.common.white, 0.06)}`
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
        <Box
        component="img"
        src={logoImg}
        alt="Hesap Merkez"
        sx={{
          height: 60,
          width: 'auto',
          ...(theme.palette.mode === 'dark' && { filter: 'invert(1)' }),
        }}
      />
      </Link>

      {isDesktop ? (
        <Box sx={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              bgcolor: theme.palette.action.hover,
              px: 1.5,
              py: 0.75,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              inputProps={{ 'aria-label': 'search' }}
              sx={{ flex: 1 }}
            />
          </Box>
          {searchFocused && searchResults.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 0.5,
                maxHeight: 320,
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                zIndex: 1200,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {searchResults.slice(0, 10).map((item) => (
                <Box
                  key={item.id}
                  component={Link}
                  to={item.path}
                  onClick={() => handleSearchSelect(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  {item.icon}
                  <span>{getToolTitle(item.id)}</span>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <>
          <Tooltip title={t('search')}>
            <IconButton
              onClick={(e) => setSearchPopoverAnchor(e.currentTarget)}
              color="inherit"
              size="medium"
              aria-label={t('search')}
              sx={{ flexShrink: 0 }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(searchPopoverAnchor)}
            anchorEl={searchPopoverAnchor}
            onClose={() => { setSearchPopoverAnchor(null); setSearchFocused(false) }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  width: 320,
                  maxWidth: `min(320px, calc(100vw - 32px))`,
                  maxHeight: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2,
                  bgcolor: theme.palette.action.hover,
                  px: 1.5,
                  py: 0.75,
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                <InputBase
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  inputProps={{ 'aria-label': 'search' }}
                  sx={{ flex: 1, fontSize: '0.95rem' }}
                  autoFocus
                />
              </Box>
            </Box>
            <Box sx={{ overflow: 'auto', flex: 1, maxHeight: 320 }}>
              {searchResults.length > 0 ? (
                searchResults.slice(0, 10).map((item) => (
                  <Box
                    key={item.id}
                    component={Link}
                    to={item.path}
                    onClick={() => { handleSearchSelect(item.path); setSearchPopoverAnchor(null) }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      textDecoration: 'none',
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {item.icon}
                    <span>{getToolTitle(item.id)}</span>
                  </Box>
                ))
              ) : (
                searchQuery.trim() && (
                  <Box sx={{ px: 2, py: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                    {t('noResults')}
                  </Box>
                )
              )}
            </Box>
          </Popover>
        </>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {generalItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <Box
              key={item.id}
              component={Link}
              to={item.path}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                textDecoration: 'none',
                color: isActive ? 'primary.main' : 'text.primary',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                bgcolor: isActive ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1) : 'transparent',
                transition: 'color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.16)
                    : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
                  color: 'primary.main',
                },
              }}
            >
              {getToolTitle(item.id)}
            </Box>
          )
        })}
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 16 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Tooltip title={theme.palette.mode === 'dark' ? t('lightMode') : t('darkMode')}>
          <ToggleButton
            value="theme"
            selected={theme.palette.mode === 'dark'}
            onChange={() => dispatch(toggleTheme())}
            size="small"
            sx={{
              border: 'none',
              borderRadius: 2,
              p: 0.75,
              '&.Mui-selected': {
                bgcolor: (th) => (th.palette.mode === 'dark' ? 'primary.main' : 'action.selected'),
                color: (th) => (th.palette.mode === 'dark' ? 'primary.contrastText' : 'primary.main'),
                '&:hover': { bgcolor: (th) => (th.palette.mode === 'dark' ? 'primary.dark' : 'action.hover') },
              },
            }}
          >
            {theme.palette.mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </ToggleButton>
        </Tooltip>
        <LanguageSwitcher />
      </Box>
    </Box>

    {isDesktop && (
      <Box
        onMouseLeave={() => setActiveMenuId(null)}
        sx={{
          position: 'fixed',
          top: desktopNavbarHeight,
          left: 0,
          right: 0,
          zIndex: 1090,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 0.5,
          pl: 4,
          pr: 4,
          pt: 0,
          pb: 0,
          minHeight: secondaryBarHeight,
          bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {toolsConfig
          .filter((c) => c.id !== 'genel')
          .map((cat) => (
            <Box
              key={cat.id}
              onMouseEnter={() => setActiveMenuId(cat.id)}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: secondaryBarHeight,
              }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveMenuId(activeMenuId === cat.id ? null : cat.id)
                }}
                endIcon={<ExpandMoreIcon />}
                sx={{
                  color: activeMenuId === cat.id ? 'primary.main' : 'text.primary',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.75,
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'action.selected' : 'grey.200',
                    color: 'primary.main',
                  },
                }}
              >
                {getCategoryTitle(cat.id)}
              </Button>
              {activeMenuId === cat.id && (
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: 200,
                    mt: 0,
                    py: 0.5,
                    overflow: 'hidden',
                    zIndex: 1200,
                    bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100',
                  }}
                >
                  {cat.items.map((item) => (
                    <MenuItem
                      key={item.id}
                      component={Link}
                      to={item.path}
                      onClick={() => setActiveMenuId(null)}
                    >
                      {item.icon}
                      <Box component="span" sx={{ ml: 1.5 }}>
                        {getToolTitle(item.id)}
                      </Box>
                    </MenuItem>
                  ))}
                </Paper>
              )}
            </Box>
          ))}
      </Box>
    )}
    </>
  )
}
