import React from 'react'
import { Typography, Button, Container } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  return (
    <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 10 }}>
      <Helmet>
        <title>Sayfa Bulunamadı | Hesap Uzmanı</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <Typography variant="h1" fontWeight="900" color="primary" sx={{ fontSize: { xs: '6rem', md: '10rem' }, opacity: 0.2, lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: -2 }}>
        Aradığınız Sayfa Bulunamadı
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4 }}>
        Gitmek istediğiniz sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.
      </Typography>
      
      <Button 
        component={RouterLink} 
        to="/" 
        variant="contained" 
        size="large" 
        startIcon={<HomeIcon />}
        sx={{ borderRadius: 3, px: 4, py: 1.5 }}
      >
        Ana Sayfaya Dön
      </Button>
    </Container>
  )
}