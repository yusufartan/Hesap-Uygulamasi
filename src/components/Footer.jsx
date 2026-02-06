import React from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import CalculateIcon from '@mui/icons-material/Calculate'
import { useTranslation } from '../hooks/useTranslation'
import { toolsConfig } from '../config/toolsConfig'

const POPULAR_TOOLS_COUNT = 5

// toolsConfig'den dashboard hariç tüm araçları düzleştir, ilk N tanesini al
function getPopularTools(config, n) {
  return config
    .flatMap((cat) => cat.items)
    .filter((item) => item.path !== '/')
    .slice(0, n)
}

export default function Footer() {
  const theme = useTheme()
  const location = useLocation()
  const { t, getToolTitle, getCategoryTitle } = useTranslation()

  const handleCategoryClick = (e, categoryId) => {
    if (location.pathname === '/tools' && location.hash === `#${categoryId}`) {
      e.preventDefault()
      document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const popularTools = React.useMemo(
    () => getPopularTools(toolsConfig, POPULAR_TOOLS_COUNT),
    []
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? theme.palette.grey[900]
      : theme.palette.primary.dark || theme.palette.primary.main
  const textPrimary = '#fff'
  const textSecondary = theme.palette.grey[400] || 'rgba(255,255,255,0.8)'

  const linkSx = {
    color: textSecondary,
    textDecoration: 'none',
    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
    '&:hover': { color: textPrimary, textDecoration: 'underline' },
  }

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        bgcolor: footerBg,
        color: textSecondary,
        py: { xs: 4, sm: 5, md: 6 },
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg" disableGutters={false} sx={{ width: '100%' }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* 1. Sütun: Marka */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: 2 }}>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.light',
                }}
              >
                <CalculateIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: textPrimary, fontWeight: 700, fontSize: '1.2rem' }}
              >
                {t('appTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: textSecondary, mb: 2, maxWidth: 280 }}>
              {t('footerSlogan')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                sx={{ color: textSecondary, '&:hover': { color: textPrimary } }}
                href="https://github.com/yusufartan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: textSecondary, '&:hover': { color: textPrimary } }}
                href="https://twitter.com/artn_yusuf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: textSecondary, '&:hover': { color: textPrimary } }}
                href="https://www.linkedin.com/in/yusuf-artan-6a3b8b276"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* 2. Sütun: Kategoriler */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: textPrimary, fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {t('categories')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {toolsConfig.map((category) => (
                <Link
                  key={category.id}
                  component={RouterLink}
                  to={`/tools#${category.id}`}
                  onClick={(e) => handleCategoryClick(e, category.id)}
                  sx={linkSx}
                >
                  {getCategoryTitle(category.id)}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* 3. Sütun: Popüler Hesaplamalar */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: textPrimary, fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {t('popularCalculations')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {popularTools.map((item) => (
                <Link
                  key={item.id}
                  component={RouterLink}
                  to={item.path}
                  sx={linkSx}
                >
                  {getToolTitle(item.id)}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* 4. Sütun: Hızlı Erişim (Kurumsal) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: textPrimary, fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {t('quickAccess')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/" sx={linkSx}>
                {t('dashboard')}
              </Link>
              <Link component={RouterLink} to="/about" sx={linkSx}>
                {t('about')}
              </Link>
              <Link component={RouterLink} to="/contact" sx={linkSx}>
                {t('contact')}
              </Link>
              <Link component={RouterLink} to="/privacy" sx={linkSx}>
                {t('privacy')}
              </Link>
              <Link component={RouterLink} to="/terms" sx={linkSx}>
                {t('terms')}
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: textSecondary }}>
            © 2026 {t('appTitle')}. {t('rightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
