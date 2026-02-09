import React from 'react'
import { Box, Container, Typography, Button, Grid, useTheme, alpha, Card, CardActionArea } from '@mui/material'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { toolsConfig } from '../config/toolsConfig'

// İkonlar
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalculateIcon from '@mui/icons-material/Calculate'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BoltIcon from '@mui/icons-material/Bolt'
import VerifiedIcon from '@mui/icons-material/Verified'
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast'

export default function LandingPage() {
  const theme = useTheme()
  const { t, getCategoryTitle } = useTranslation()

  // --- Animasyon Varyasyonları ---

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  }

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <Box
      sx={{
        mx: { xs: -2, sm: -3 }, 
        mt: { xs: -2, sm: -3 },
        mb: { xs: -2, sm: -3 },
        width: 'auto',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflowX: 'hidden',
      }}
    >
      {/* ========================================
        1. HERO SECTION
        ========================================
      */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 15 },
          pb: { xs: 12, md: 20 },
          px: { xs: 2, md: 6 },
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.4)} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideInLeft}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mb: 3,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary?.main || '#8b5cf6'})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('heroTitle')}
                </Typography>
                
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6, maxWidth: '90%', fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  {t('heroDescription')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/tum-araclar"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5, px: 5,
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      textTransform: 'none',
                      boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                  >
                    {t('getStarted')}
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  component={motion.div}
                  animate={floatingAnimation}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    p: 4,
                    borderRadius: 4,
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: theme.shadows[20],
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e' }} />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        <CalculateIcon color="primary" sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>1,234</Typography>
                        <Typography variant="body2" color="text.secondary">İşlem</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                        <TrendingUpIcon color="success" sx={{ fontSize: 32 }} />
                        <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>%99</Typography>
                        <Typography variant="body2" color="text.secondary">Doğruluk</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, height: 120, borderRadius: 2, bgcolor: alpha(theme.palette.text.primary, 0.05), display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                         {[40, 70, 50, 90, 60, 80, 50, 85].map((h, i) => (
                           <motion.div
                             key={i}
                             animate={{ height: [`${h}%`, `${h - 15}%`, `${h}%`] }}
                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                             style={{
                               flex: 1,
                               background: theme.palette.primary.main,
                               borderRadius: 4,
                               opacity: 0.7
                             }}
                           />
                         ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ========================================
        2. FEATURES (Özellikler)
        ========================================
      */}
      <Container maxWidth="xl" sx={{ py: 12, px: { xs: 2, md: 8 } }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 12, fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}
        >
          {t('whyChooseUs')}
        </Typography>

        <Grid container spacing={6} alignItems="center" sx={{ mb: 16 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <Box
                sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  height: 350,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <BoltIcon sx={{ fontSize: 120, color: 'primary.main' }} />
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {t('highSpeed')}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.8, fontWeight: 400 }}>
                {t('highSpeedDesc')}
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={6} alignItems="center" sx={{ mb: 16, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom align="right" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                {t('reliableResults')}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.8, textAlign: { xs: 'left', md: 'right' }, fontWeight: 400 }}>
                {t('reliableResultsDesc')}
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <Box
                sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  height: 350,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary?.main || '#8b5cf6', 0.1)} 0%, transparent 100%)`,
                  borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
                  border: `2px solid ${alpha(theme.palette.secondary?.main || '#8b5cf6', 0.2)}`
                }}
              >
                <VerifiedIcon sx={{ fontSize: 120, color: theme.palette.secondary?.main || '#8b5cf6' }} />
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <Box
                sx={{
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  height: 350,
                  background: `linear-gradient(135deg, ${alpha('#10b981', 0.1)} 0%, transparent 100%)`,
                  borderRadius: '40% 60% 60% 40% / 40% 60% 40% 60%',
                  border: `2px solid ${alpha('#10b981', 0.2)}`
                }}
              >
                <FreeBreakfastIcon sx={{ fontSize: 120, color: '#10b981' }} />
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {t('completelyFree')}
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.8, fontWeight: 400 }}>
                {t('completelyFreeDesc')}
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
        </Box>
      </Container>

      {/* ========================================
        3. CATEGORIES (Kategoriler) - FİXLENMİŞ ALAN
        ========================================
      */}
      <Box sx={{ py: 12, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 }, width: '100%' }}>
          <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 800 }}>
            {t('exploreCategories')}
          </Typography>

          {/* Grid container ayarları:
            spacing={3}: Kartlar arası boşluk.
            justifyContent="center": Az kart varsa ortala.
            alignItems="stretch": Tüm kartların boyunu en uzuna eşitle.
          */}
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {toolsConfig.map((category, index) => (
              /* Grid item ayarları (RESPONSIVE ÇÖZÜMÜ BURASI):
                xs={12}: Mobil (Tek sütun - Tam genişlik)
                sm={6}: Tablet (2 sütun - %50 genişlik)
                md={4}: Laptop (3 sütun - %33.3 genişlik)
                lg={2}: Büyük Ekran (6 sütun - %16.6 genişlik)
              */
              <Grid item xs={12} sm={6} md={4} lg={2} key={category.id}>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1 }}
                  style={{ height: '100%' }} // Yükseklik %100, stretch için gerekli
                >
                  <Card
                    elevation={0}
                    sx={{
                      width: '100%', // ARTIK 220PX DEĞİL, %100! KUTU YAZIYA GÖRE DEĞİL, EKRANA GÖRE ŞEKİL ALIR.
                      height: '100%', // Tüm kartlar eşit boyda
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 28px -8px ${alpha(theme.palette.primary.main, 0.25)}`,
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                        '& .icon-bg': { transform: 'scale(1.1)', opacity: 0.15 },
                        '& .arrow-icon': { opacity: 1, transform: 'translateX(0)' },
                      },
                    }}
                  >
                    <CardActionArea
                      component={RouterLink}
                      to={`/tum-araclar#${category.id}`}
                      sx={{
                        flexGrow: 1,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        p: { xs: 3, sm: 3 },
                      }}
                    >
                      {/* Arka plan ikonu */}
                      <Box
                        className="icon-bg"
                        sx={{
                          position: 'absolute',
                          right: -12,
                          bottom: -12,
                          opacity: 0.06,
                          transform: 'rotate(-12deg)',
                          transition: 'all 0.3s ease',
                          color: 'primary.main',
                          zIndex: 0,
                          '& .MuiSvgIcon-root': { fontSize: 100 },
                        }}
                      >
                        {category.icon}
                      </Box>

                      {/* Üst Kısım: İkon ve Başlık */}
                      <Box sx={{ zIndex: 1, width: '100%' }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            mb: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& .MuiSvgIcon-root': { fontSize: 30 },
                          }}
                        >
                          {category.icon && React.cloneElement(category.icon, {})}
                        </Box>
                        {/* noWrap: Yazı çok uzarsa tek satırda kalıp ... olsun mu? İstersen kaldırabilirsin */}
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                          {getCategoryTitle(category.id)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {category.items.length} {t('tools')}
                        </Typography>
                      </Box>

                      {/* Alt Kısım: Buton Yazısı */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'primary.main',
                          gap: 0.5,
                          zIndex: 1,
                          mt: 3,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="600">
                          {t('openTool')}
                        </Typography>
                        <ArrowForwardIcon
                          className="arrow-icon"
                          sx={{
                            fontSize: 20,
                            opacity: 0,
                            transform: 'translateX(-8px)',
                            transition: 'all 0.25s ease',
                          }}
                        />
                      </Box>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}