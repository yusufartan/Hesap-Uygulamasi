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
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from '../../hooks/useTranslation'
import { toolsConfig } from '../../config/toolsConfig'

const heroTitle = 'Hesaplamalarınızı Hızlandırın'
const heroSubtitle =
  'Finanstan sağlığa, eğitimden mühendisliğe kadar ihtiyacınız olan tüm araçlar.'
const searchPlaceholder = 'Hesaplamak istediğiniz aracı arayın...'
const noResultsText = 'Sonuç bulunamadı'

function ToolCard({ item, theme, t }) {
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
            {t(item.id) || item.title}
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
            {t(`${item.id}Desc`) || item.description}
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
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = React.useState('')

  const query = searchQuery.trim().toLowerCase()
  const hasSearch = query.length > 0

  const filteredBySearch = React.useMemo(() => {
    if (!hasSearch) return []
    return toolsConfig.flatMap((category) =>
      category.items.filter(
        (item) =>
          item.id !== 'dashboard' &&
          item.id !== 'all-tools' &&
          ((item.title && item.title.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (t(item.id) && t(item.id).toLowerCase().includes(query)) ||
            (t(`${item.id}Desc`) && t(`${item.id}Desc`).toLowerCase().includes(query)))
      )
    )
  }, [query, hasSearch, t])

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
          <TextField
            fullWidth
            variant="outlined"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 560,
              mx: 'auto',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'grey.50',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'action.selected' : 'grey.100',
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper',
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
          />
        </Box>

        {/* ——— İçerik: Kategorili veya Arama Sonuçları ——— */}
        {hasSearch ? (
          <>
            {filteredBySearch.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  px: 2,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <SearchOffIcon sx={{ fontSize: { xs: 48, sm: 64 }, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  {noResultsText}
                </Typography>
                <Typography variant="body2">
                  Farklı anahtar kelimelerle tekrar deneyin.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {filteredBySearch.length} araç bulundu
                </Typography>
              </Box>
            )}
            {filteredBySearch.length > 0 && (
              <Grid container spacing={2}>
                {filteredBySearch.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} sx={{ display: 'flex' }}>
                    <ToolCard item={item} theme={theme} t={t} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <Box>
            {categoriesToShow.map((category) => {
              const items = category.items.filter(
                (item) => item.id !== 'dashboard' && item.id !== 'all-tools'
              )
              if (items.length === 0) return null
              return (
                <Box key={category.id} sx={{ mb: 4 }}>
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
                      {category.title}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={item.id}
                        sx={{ display: 'flex' }}
                      >
                        <ToolCard item={item} theme={theme} t={t} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
            })}
          </Box>
        )}
      </Container>
    </Box>
  )
}
