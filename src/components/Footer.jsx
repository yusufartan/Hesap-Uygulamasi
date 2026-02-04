import React, { useState, useEffect } from 'react'
import { Box, Container, Grid, Typography, Link, IconButton, useTheme, alpha, Divider, TextField, Button, InputAdornment, Snackbar, Alert } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import CalculateIcon from '@mui/icons-material/Calculate'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useForm } from '@formspree/react'
import { useTranslation } from '../hooks/useTranslation'

export default function Footer() {
  const theme = useTheme()
  const { t } = useTranslation()
  
  // Formspree Hook'u: 'YOUR_NEWSLETTER_FORM_ID' yerine kendi ID'ni yaz
  const [state, handleSubmit] = useForm("xwvqzggv")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    if (state.succeeded) {
      setOpenSnackbar(true)
    }
  }, [state.succeeded])

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false)
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
        color: theme.palette.text.secondary,
        py: 6,
        mt: 'auto', // İçerik azsa footer'ı en alta iter
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sol Taraf: Logo ve Açıklama */}
          <Grid size={{ xs: 12, md: 3 }}> {/* responsive padding */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalculateIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                {t('appTitle')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
              {t('footerDesc')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="inherit" href="https://github.com/yusufartan" target="_blank">
                <GitHubIcon />
              </IconButton>
              <IconButton size="small" color="inherit" href="https://twitter.com/artn_yusuf" target="_blank">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="inherit" href="https://www.linkedin.com/in/yusuf-artan-6a3b8b276" target="_blank">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Orta: Hızlı Linkler */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {t('quickAccess')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover">{t('dashboard')}</Link>
              <Link component={RouterLink} to="/finance" color="inherit" underline="hover">{t('finance')}</Link>
              <Link component={RouterLink} to="/bmi" color="inherit" underline="hover">{t('bmi')}</Link>
              <Link component={RouterLink} to="/time" color="inherit" underline="hover">{t('time')}</Link>
            </Box>
          </Grid>

          {/* Sağ: Yasal & İletişim */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {t('corporate')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link component={RouterLink} to="/about" color="inherit" underline="hover">{t('about')}</Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">{t('contact')}</Link>
              <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">{t('privacy')}</Link>
              <Link component={RouterLink} to="/terms" color="inherit" underline="hover">{t('terms')}</Link>
            </Box>
          </Grid>

          {/* Yeni: E-Bülten Aboneliği */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" color="text.primary" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
              {t('newsletterTitle')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t('newsletterDesc')}
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder={t('emailPlaceholder')}
                variant="outlined"
                size="small"
                required
                disabled={state.succeeded}
                sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff', borderRadius: 1, mb: 1 }}
              />
              <Button fullWidth type="submit" variant="contained" size="small" disabled={state.submitting || state.succeeded} startIcon={<MailOutlineIcon />}>
                {state.succeeded ? t('subscribed') : (state.submitting ? '...' : t('subscribe'))}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t('appTitle')}. {t('rightsReserved')}
          </Typography>
        </Box>

        {/* Bülten Başarı Bildirimi */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
            Bültenimize başarıyla abone oldunuz!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}
