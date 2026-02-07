import React from 'react'
import { Container, Typography, Box, Paper, useTheme } from '@mui/material'
import CalculateIcon from '@mui/icons-material/Calculate'
import { useTranslation } from '../hooks/useTranslation'

export default function AboutPage() {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CalculateIcon sx={{ fontSize: { xs: 40, md: 60 }, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h3" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
          {t('about')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          {t('footerDesc')}
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
          {t('aboutIntro')}
        </Typography>
        
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4, color: theme.palette.primary.main, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          {t('mission')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('missionDesc')}
        </Typography>

        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4, color: theme.palette.primary.main, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
          {t('whyUs')}
        </Typography>
        <Typography variant="body1">
          {t('whyUsDesc')}
        </Typography>
      </Paper>
    </Container>
  )
}
