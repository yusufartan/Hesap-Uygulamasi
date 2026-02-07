import React from 'react'
import { Container, Typography, Box, Paper, useTheme } from '@mui/material'
import { useTranslation } from '../hooks/useTranslation'

export default function TermsPage() {
  const theme = useTheme()
  const { t, language } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: theme.palette.primary.main, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          {t('terms')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {t('lastUpdate')}: {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>1. {t('acceptance')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('acceptanceDesc')} {/* responsive font size */}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>2. {t('serviceNature')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('serviceNatureDesc')} {/* responsive font size */}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>3. {t('disclaimer')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('disclaimerDesc')} {/* responsive font size */}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>4. {t('changes')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t('changesDesc')} {/* responsive font size */}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}