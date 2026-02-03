import React from 'react'
import { Box, Typography, Grid, Card, CardActionArea, useTheme, alpha, Container } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '../../hooks/useTranslation'

export default function Dashboard({ onNavigate, menuItems }) {
  const theme = useTheme()
  const { t } = useTranslation()

  const tools = menuItems ? menuItems.filter((item) => item.id !== 'dashboard') : []

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', zIndex: 1 }}>
      <Helmet>
        <title>Hesap Uzmanı | Tüm Hesaplama Araçları Tek Yerde</title>
        <meta name="description" content="Yaş, VKE, Finans, Tarih ve daha birçok hesaplama aracı ile günlük işlemlerinizi hızlandırın." />
      </Helmet>
      {/* --- Arka Plan Efektleri --- */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '10%', right: '-5%', width: '30%', height: '30%', borderRadius: '50%', background: `radial-gradient(circle, ${alpha(theme.palette.secondary?.main || theme.palette.primary.light, 0.1)} 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: { xs: 4, md: 8 }, textAlign: 'left', maxWidth: 800 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2, mb: 1, display: 'block' }}>{t('toolsAndCalculators')}</Typography>
          <Typography variant="h2" component="h1" fontWeight="800" sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' }, mb: { xs: 1, md: 2 }, background: theme.palette.mode === 'dark' ? `linear-gradient(90deg, #fff 0%, ${alpha('#fff', 0.7)} 100%)` : `linear-gradient(90deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`, backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            {t('accelerateYour')}<br /><Box component="span" sx={{ color: 'primary.main', WebkitTextFillColor: 'initial' }}>{t('calculations')}</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>{t('dashboardHeroDesc')}</Typography>
        </Box>

        {/* --- GRID YAPISI (GÜNCELLENDİ) --- */}
        {/* alignItems="stretch": Satırdaki en uzun karta göre diğerlerini uzatır */}
        <Grid container spacing={3} alignItems="stretch">
          {tools.map((tool) => (
            
            // GÜNCELLEME: Grid v2 syntax (item prop kalktı, size prop geldi)
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tool.id} sx={{ display: 'flex' }}>
              
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  height: '100%', // Grid hücresine tam otur
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 5,
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    '& .icon-bg': { transform: 'scale(1.2)', opacity: 0.2 },
                    '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                <CardActionArea
                  onClick={() => onNavigate && onNavigate(tool.id)}
                  sx={{
                    flexGrow: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between', // İçeriği uçlara yasla
                    p: 3,
                  }}
                >
                  <Box className="icon-bg" sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.05, transform: 'rotate(-15deg)', transition: 'all 0.4s ease', color: 'primary.main', zIndex: 0 }}>
                    {tool.icon && React.cloneElement(tool.icon, { sx: { fontSize: 120 } })}
                  </Box>

                  {/* Üst Kısım: İkon + Başlık + Açıklama */}
                  <Box sx={{ zIndex: 1, width: '100%' }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: 3, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {tool.icon && React.cloneElement(tool.icon, { sx: { fontSize: 28 } })}
                    </Box>
                    
                    <Typography variant="h6" fontWeight="700" gutterBottom noWrap>
                      {t(tool.id)}
                    </Typography>
                    
                    {/* HİZALAMA GARANTİSİ */}
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      minHeight: '4.5em', // Kısa yazı olsa bile 3 satır yer tut
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}>
                      {t(`${tool.id}Desc`)}
                    </Typography>
                  </Box>

                  {/* Alt Kısım: Buton (Her zaman en altta) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', gap: 1, zIndex: 1, mt: 'auto' }}>
                    <Typography variant="subtitle2" fontWeight="600">{t('openTool')}</Typography>
                    <ArrowForwardIcon className="arrow-icon" sx={{ fontSize: 18, opacity: 0, transform: 'translateX(-10px)', transition: 'all 0.3s ease' }} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}