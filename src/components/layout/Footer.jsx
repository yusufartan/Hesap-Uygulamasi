import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  useTheme,
  alpha,
  Divider,
  IconButton,
} from '@mui/material'
import { useTranslation } from '../../hooks/useTranslation'
import { toolsConfig } from '../../config/toolsConfig'
import CalculateIcon from '@mui/icons-material/Calculate'

const linkSx = (theme) => ({
  color: 'text.secondary',
  textDecoration: 'none',
  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
  display: 'block',
  py: { xs: 0.25, sm: 0.5 },
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
})

export default function Footer() {
  const theme = useTheme()
  const { t, getCategoryTitle } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        flexShrink: 0,
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        pt: { xs: 4, sm: 5, md: 8 },
        pb: { xs: 2.5, sm: 3, md: 4 },
        background: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <Container 
        maxWidth="xl" 
        disableGutters={false}
        sx={{ 
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        <Grid 
          container 
          spacing={{ xs: 2.5, sm: 4, md: 6 }} 
          alignItems="flex-start"
        >
          {/* Marka & Açıklama - Mobil/tablette üstte tam genişlik, masaüstünde solda */}
          <Grid item xs={12} sm={12} md={3}>
            <Link
              component={RouterLink}
              to="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: { xs: 0.75, sm: 1 },
                textDecoration: 'none',
                color: 'text.primary',
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalculateIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{ fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } }}
              >
                {t('appTitle')}
              </Typography>
            </Link>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                maxWidth: { xs: '100%', sm: 280 },
                lineHeight: 1.6,
                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              }}
            >
              {t('footerTagline')}
            </Typography>
          </Grid>

          {/* Hızlı Erişim - Mobilde tam genişlik, tablet+ aynı hizada */}
          <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-start' } }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              color="text.primary" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: 'text.secondary',
              }}
            >
              {t('quickAccess')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.25, sm: 0.5 } }}>
              <Link component={RouterLink} to="/" sx={linkSx(theme)}>
                {t('dashboard')}
              </Link>
              <Link component={RouterLink} to="/tum-araclar" sx={linkSx(theme)}>
                {t('all-tools')}
              </Link>
            </Box>
          </Grid>

          {/* Kurumsal */}
          <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              color="text.primary" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: 'text.secondary',
              }}
            >
              {t('corporate')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.25, sm: 0.5 } }}>
              <Link component={RouterLink} to="/about" sx={linkSx(theme)}>
                {t('about')}
              </Link>
              <Link component={RouterLink} to="/contact" sx={linkSx(theme)}>
                {t('contact')}
              </Link>
            </Box>
          </Grid>

          {/* Kategoriler */}
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              color="text.primary" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: 'text.secondary',
              }}
            >
              {t('categories')}
            </Typography>
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: '1fr' },
                gap: { xs: '0.5rem 1rem', sm: 0.5 },
              }}
            >
              {toolsConfig.map((category) => (
                <Link
                  key={category.id}
                  component={RouterLink}
                  to={`/tum-araclar#${category.id}`}
                  sx={linkSx(theme)}
                >
                  {getCategoryTitle(category.id)}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Yasal */}
          <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={700} 
              color="text.primary" 
              sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: 'text.secondary',
              }}
            >
              {t('footerLegal')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.25, sm: 0.5 } }}>
              <Link component={RouterLink} to="/privacy" sx={linkSx(theme)}>
                {t('privacy')}
              </Link>
              <Link component={RouterLink} to="/terms" sx={linkSx(theme)}>
                {t('terms')}
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 2.5, sm: 3, md: 4 }, borderColor: theme.palette.divider }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1.5, sm: 2, md: 3 },
            pt: { xs: 0.5, sm: 1 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              component="a"
              href="https://github.com/yusufartan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              size="small"
              sx={{
                color: 'text.secondary',
                padding: { xs: 0.5, sm: 0.75 },
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/yusuf-artan-6a3b8b276/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              size="small"
              sx={{
                color: 'text.secondary',
                padding: { xs: 0.5, sm: 0.75 },
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </IconButton>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              textAlign: { xs: 'center', sm: 'center' },
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            © {currentYear} {t('appTitle')}. {t('rightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
