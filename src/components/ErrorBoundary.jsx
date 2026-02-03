import React from 'react'
import { Box, Typography, Button, Container, Paper } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Bir sonraki render'da fallback UI göstermek için state'i güncelle
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Hatayı loglama servisine gönderebilirsiniz
    console.error("Uygulama hatası:", error, errorInfo)
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Hata durumunda gösterilecek yedek arayüz (Fallback UI)
      return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 4,
              border: '1px solid rgba(255, 0, 0, 0.1)',
              bgcolor: 'background.paper'
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold" color="error">
              Bir Hata Oluştu
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Beklenmedik bir sorunla karşılaştık. Bu durum geçici olabilir.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<HomeIcon />} 
              onClick={this.handleGoHome}
              sx={{ mt: 2, borderRadius: 2, px: 4 }}
            >
              Ana Menüye Dön
            </Button>
          </Paper>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary