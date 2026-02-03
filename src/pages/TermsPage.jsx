import React from 'react'
import { Container, Typography, Box, Paper, useTheme } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '../hooks/useTranslation'

export default function TermsPage() {
  const theme = useTheme()
  const { t, language } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Helmet>
        <title>{t('terms')} | {t('appTitle')}</title>
        <meta name="description" content={t('termsMetaDesc')} />
        <meta name="keywords" content={t('termsKeywords')} />
        <link rel="canonical" href="https://www.hesapmerkez.com/terms" />
        <meta property="og:title" content={`${t('terms')} | ${t('appTitle')}`} />
        <meta property="og:description" content={t('termsMetaDesc')} />
        <meta property="og:url" content="https://www.hesapmerkez.com/terms" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.primary.main }}>
          {t('terms')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {t('lastUpdate')}: {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>1. {t('acceptance')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('acceptanceDesc')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>2. {t('serviceNature')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('serviceNatureDesc')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>3. {t('disclaimer')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('disclaimerDesc')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>4. {t('changes')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('changesDesc')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}