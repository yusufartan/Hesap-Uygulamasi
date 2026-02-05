import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  useTheme,
  alpha,
  Container,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '../../hooks/useTranslation'
import { toolsConfig } from '../../config/toolsConfig'

const heroTitle = 'Hesaplamalarınızı Hızlandırın'
const heroSubtitle =
  'Finanstan sağlığa, eğitimden mühendisliğe kadar ihtiyacınız olan tüm araçlar.'

function ToolCard({ item, theme, t, getToolTitle, getToolDescription }) {
  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : '#fff',
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
        component={Link}
        to={item.path}
        sx={{
          flexGrow: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: { xs: 1.5, sm: 2.5 },
        }}
      >
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
            '& .MuiSvgIcon-root': { fontSize: { xs: 56, sm: 80 } },
          }}
        >
          {item.icon}
        </Box>
        <Box sx={{ zIndex: 1, width: '100%' }}>
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: 2,
              mb: { xs: 1.5, sm: 2 },
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiSvgIcon-root': { fontSize: { xs: 22, sm: 26 } },
            }}
          >
            {item.icon}
          </Box>
          <Typography variant="h6" fontWeight="700" gutterBottom noWrap>
            {getToolTitle(item.id)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              minHeight: '3.6em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {getToolDescription(item.id)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            gap: 0.5,
            zIndex: 1,
            mt: 'auto',
            pt: 1.5,
          }}
        >
          <Typography variant="subtitle2" fontWeight="600">
            {t('openTool')}
          </Typography>
          <ArrowForwardIcon
            className="arrow-icon"
            sx={{
              fontSize: 18,
              opacity: 0,
              transform: 'translateX(-8px)',
              transition: 'all 0.25s ease',
            }}
          />
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default function Dashboard() {
  const theme = useTheme()
  const { t, getToolTitle, getToolDescription, getCategoryTitle } = useTranslation()
  const categoriesToShow = toolsConfig

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', zIndex: 1 }}>
      <Helmet>
        <title>Hesap Uzmanı | Tüm Hesaplama Araçları Tek Yerde</title>
        <meta
          name="description"
          content="Yaş, VKE, Finans, Tarih ve daha birçok hesaplama aracı ile günlük işlemlerinizi hızlandırın."
        />
      </Helmet>
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.secondary?.main || theme.palette.primary.light,
            0.08
          )} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
        {/* ——— Hero ——— */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="700"
            gutterBottom
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: 'text.primary',
            }}
          >
            {heroTitle}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 560,
              mx: 'auto',
              mb: 3,
              lineHeight: 1.6,
              fontSize: { xs: '0.95rem', md: '1rem' },
            }}
          >
            {heroSubtitle}
          </Typography>
        </Box>

        {/* ——— İçerik: Kategoriler ——— */}
        <Box>
            {categoriesToShow.map((category) => {
              const items = category.items.filter(
                (item) => item.id !== 'dashboard' && item.id !== 'all-tools'
              )
              if (items.length === 0) return null
              return (
                <Box
                  key={category.id}
                  id={category.id}
                  sx={{ mb: 4, scrollMarginTop: 120 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2,
                      color: 'text.primary',
                    }}
                  >
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {category.icon &&
                        React.cloneElement(category.icon, {
                          sx: { fontSize: 28 },
                        })}
                    </Box>
                    <Typography variant="h6" fontWeight="700">
                      {getCategoryTitle(category.id)}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={item.id}
                        sx={{ display: 'flex' }}
                      >
                        <ToolCard item={item} theme={theme} t={t} getToolTitle={getToolTitle} getToolDescription={getToolDescription} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
            })}
          </Box>
      </Container>
    </Box>
  )
}
