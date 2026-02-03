import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, TextField, Button, Grid, Paper, useTheme, Alert, Snackbar } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import EmailIcon from '@mui/icons-material/Email'
import { Helmet } from 'react-helmet-async'
import { useForm, ValidationError } from '@formspree/react'
import { useTranslation } from '../hooks/useTranslation'

export default function ContactPage() {
  const theme = useTheme()
  const { t } = useTranslation()
  
  // Formspree Hook'u: 'YOUR_CONTACT_FORM_ID' yerine kendi ID'ni yaz (örn: "mdoqkjlv")
  const [state, handleSubmit, reset] = useForm("xvzqyeng")
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    if (state.succeeded) {
      setOpenSnackbar(true)

      // 3 saniye sonra formu sıfırla ve tekrar göster
      const timer = setTimeout(() => {
        reset()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [state.succeeded, reset])

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false)
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Helmet>
        <title>{t('contact')} | {t('appTitle')}</title>
        <meta name="description" content={t('contactMetaDesc')} />
        <meta name="keywords" content="iletişim, destek, hesap uzmanı iletişim, öneri formu" />
        <link rel="canonical" href="https://site-adresi.com/contact" />
        <meta property="og:title" content={`${t('contact')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('contactMetaDesc')} />
        <meta property="og:url" content="https://site-adresi.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mb: 2 }}>
            <Typography variant="h3" fontWeight="800" gutterBottom sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary?.main || '#ff4081'})`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('contactUs')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('contactHeroDesc')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, color: 'text.primary' }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">2173mushap@gmail.com</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
            {state.succeeded ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" color="primary.main" gutterBottom fontWeight="bold">{t('thankYou')}</Typography>
                <Typography variant="body1" color="text.secondary">{t('messageReceived')} {t('weWillReturn')}</Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth id="name" name="name" label={t('name')} variant="outlined" required />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth id="email" name="email" label={t('email')} type="email" variant="outlined" required />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth id="subject" name="_subject" label={t('subject')} variant="outlined" required />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 12 }}>
                    <TextField fullWidth id="message" name="message" label={t('message')} multiline rows={6} variant="outlined" required />
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" size="large" endIcon={<SendIcon />} disabled={state.submitting} sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold' }}>
                      {state.submitting ? t('sending') : t('send')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Başarı Bildirimi (Snackbar) */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('messageSent')}
        </Alert>
      </Snackbar>
    </Container>
  )
}