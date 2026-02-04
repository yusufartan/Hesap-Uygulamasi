import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { useTranslation } from '../../hooks/useTranslation'
import LanguageSwitcher from '../LanguageSwitcher'
import { toolsConfig } from '../../config/toolsConfig'

import logoImg from '../../assets/icons/HesapMerkez.png'

const genelCategory = toolsConfig.find((c) => c.id === 'genel')
const generalItems = genelCategory ? genelCategory.items : []
const allItems = toolsConfig.flatMap((cat) => cat.items.map((item) => ({ ...item, categoryId: cat.id })))

/** Masaüstü navbar yüksekliği */
export const desktopNavbarHeight = 64
/** Mobil navbar yüksekliği (logo satırı + arama satırı) */
export const mobileNavbarHeight = 56 + 52

export default function Navbar({ open, onMenuClick }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

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
            px: 2,
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box component="img" src={logoImg} alt="Hesap Merkez" sx={{ height: 36, width: 'auto' }} />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={theme.palette.mode === 'dark' ? t('lightMode') : t('darkMode')}>
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={() => dispatch(toggleTheme())}
                size="small"
                color="primary"
              />
            </Tooltip>
            <LanguageSwitcher />
            <IconButton onClick={onMenuClick} aria-label="menu" color="inherit" size="large">
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
        {/* Satır 2: Uzun arama çubuğu */}
        <Box sx={{ position: 'relative', px: 2, pb: 1.5 }}>
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
              placeholder={t('search')}
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

  // Masaüstü: Logo | Arama | Genel araçlar | Theme | Dil
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: desktopNavbarHeight,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
        <Box component="img" src={logoImg} alt="Hesap Merkez" sx={{ height: 40, width: 'auto' }} />
      </Link>

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
            placeholder={t('search')}
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Tooltip title={theme.palette.mode === 'dark' ? t('lightMode') : t('darkMode')}>
          <Switch
            checked={theme.palette.mode === 'dark'}
            onChange={() => dispatch(toggleTheme())}
            size="small"
            color="primary"
          />
        </Tooltip>
        <LanguageSwitcher />
      </Box>
    </Box>
  )
}
