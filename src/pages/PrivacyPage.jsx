import React from 'react'
import { Container, Typography, Box, Paper, useTheme } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '../hooks/useTranslation'

export default function PrivacyPage() {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Helmet>
        <title>{t('privacy')} | {t('appTitle')}</title>
        <meta name="description" content={t('privacy')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/privacy" />
        <meta property="og:title" content={`${t('privacy')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('privacy')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/privacy" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.primary.main }}>
          {t('privacy')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>1. {t('dataCollection')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('dataCollectionDesc')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>2. {t('cookies')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('cookiesDesc')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>3. {t('contact')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('privacyContactDesc')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
