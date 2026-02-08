import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Slide, useTheme, alpha } from '@mui/material'
import CookieIcon from '@mui/icons-material/Cookie'

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Sayfa yüklendikten 1 saniye sonra açılması daha şık durur
      const timer = setTimeout(() => setOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true')
    setOpen(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'false') // Reddetme seçimini de hatırla
    setOpen(false)
  }

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          p: 3,
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CookieIcon color="primary" sx={{ fontSize: 40 }} />
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, maxWidth: 800 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Çerez Politikası
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. Sitemizi kullanmaya devam ederek çerez politikamızı kabul etmiş sayılırsınız.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={handleReject}>
            Reddet
          </Button>
          <Button variant="contained" onClick={handleAccept} sx={{ px: 4 }}>
            Kabul Et
          </Button>
        </Box>
      </Box>
    </Slide>
  )
}