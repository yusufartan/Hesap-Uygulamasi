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
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: -2, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        Aradığınız Sayfa Bulunamadı
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4, fontSize: { xs: '0.9rem', md: '1rem' } }}>
        Gitmek istediğiniz sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.
      </Typography>
      
      <Button 
        component={RouterLink} 
        to="/" 
        variant="contained" // responsive size
        size="medium" 
        startIcon={<HomeIcon />}
        sx={{ borderRadius: 3, px: { xs: 2, md: 4 }, py: { xs: 1, md: 1.5 }, fontSize: { xs: '0.9rem', md: '1rem' } }}
      >
        Ana Sayfaya Dön
      </Button>
    </Container>
  )
}