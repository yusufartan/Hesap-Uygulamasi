import React from 'react'
import { Container, Typography, Box, Paper, useTheme } from '@mui/material'
import { useTranslation } from '../hooks/useTranslation'

export default function PrivacyPage() {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.primary.main, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          {t('privacy')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>1. {t('dataCollection')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('dataCollectionDesc')} {/* responsive font size */}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>2. {t('cookies')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('cookiesDesc')} {/* responsive font size */}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>3. {t('contact')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('privacyContactDesc')} {/* responsive font size */}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
