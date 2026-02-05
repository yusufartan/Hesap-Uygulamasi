import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
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

const CATEGORY_TITLE_KEYS = {
  genel: 'categoryGenel',
  finance: 'categoryFinance',
  health: 'categoryHealth',
  time: 'categoryTime',
  'unit-converters': 'categoryUnitConverters',
  'math-data': 'categoryMathData',
}

/** Masaüstü navbar yüksekliği */
export const desktopNavbarHeight = 64
/** Masaüstü ikincil kategori çubuğu yüksekliği */
export const secondaryBarHeight = 48
/** Mobil navbar yüksekliği (logo satırı + arama satırı) */
export const mobileNavbarHeight = 56 + 52

export default function Navbar({ mobileMenuOpen, onMenuClick, rightOffset = 0 }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchPopoverAnchor, setSearchPopoverAnchor] = useState(null)
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null)
  const [categoryMenuId, setCategoryMenuId] = useState(null)

  const openCategoryMenu = (e, catId) => {
    setCategoryMenuAnchor(e.currentTarget)
    setCategoryMenuId(catId)
  }
  const closeCategoryMenu = () => {
    setCategoryMenuAnchor(null)
    setCategoryMenuId(null)
  }
  const categoryForMenu = categoryMenuId ? toolsConfig.find((c) => c.id === categoryMenuId) : null

  // Ekran daralıp tablet/mobil moda geçince açık kategori menüsünü kapat (anchor DOM'dan kalkmasın diye)
  useEffect(() => {
    if (!isDesktop) {
      setCategoryMenuAnchor(null)
      setCategoryMenuId(null)
    }
  }, [isDesktop])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return allItems.filter(
      (item) =>
        t(item.id).toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q))
    )
  }, [searchQuery, t])

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
                  <span>{t(item.id) || item.title}</span>
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
                  <span>{t(item.id) || item.title}</span>
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
                    <span>{t(item.id) || item.title}</span>
                  </Box>
                ))
              ) : (
                searchQuery.trim() && (
                  <Box sx={{ px: 2, py: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                    {t('noResults') || 'Sonuç bulunamadı'}
                  </Box>
                )
              )}
            </Box>
          </Popover>
        </>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {generalItems.map((item) => (
          <Box
            key={item.id}
            component={Link}
            to={item.path}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {t(item.id) || item.title}
          </Box>
        ))}
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
        sx={{
          position: 'fixed',
          top: desktopNavbarHeight,
          left: 0,
          right: 0,
          height: secondaryBarHeight,
          zIndex: 1090,
          display: 'flex',
          alignItems: 'center',
          pl: 4,
          pr: 2,
          gap: 0.5,
          bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {toolsConfig
          .filter((c) => c.id !== 'genel')
          .map((cat) => (
            <Button
              key={cat.id}
              onClick={(e) => openCategoryMenu(e, cat.id)}
              endIcon={<ExpandMoreIcon />}
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {t(CATEGORY_TITLE_KEYS[cat.id] ?? cat.id)}
            </Button>
          ))}
      </Box>
    )}

    <Menu
      anchorEl={isDesktop ? categoryMenuAnchor : null}
      open={isDesktop && Boolean(categoryMenuAnchor)}
      onClose={closeCategoryMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
    >
      {categoryForMenu?.items.map((item) => (
        <MenuItem
          key={item.id}
          component={Link}
          to={item.path}
          onClick={closeCategoryMenu}
        >
          {item.icon}
          <Box component="span" sx={{ ml: 1.5 }}>
            {t(item.id) || item.title}
          </Box>
        </MenuItem>
      ))}
    </Menu>
    </>
  )
}
