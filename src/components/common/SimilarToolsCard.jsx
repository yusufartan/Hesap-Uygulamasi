import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getToolById } from '../../utils/similarToolsUtils'
import { useTranslation } from '../../hooks/useTranslation'
import { useSimilarTools } from '../../hooks/useSimilarTools'

/**
 * "Benzer Hesaplama Araçları" kutusu
 * 
 * Kullanım:
 * 1. Otomatik (önerilen): <SimilarToolsCard /> - URL'den otomatik bulur
 * 2. Manuel override: <SimilarToolsCard toolIds={['finance', 'discount']} />
 * 3. Hook ile: const toolIds = useSimilarTools(); <SimilarToolsCard toolIds={toolIds} />
 * 
 * @param {Array<string>} toolIds - Gösterilecek araç ID'leri (opsiyonel, boşsa otomatik)
 * @param {Object} sx - Material-UI sx prop'u
 */
export default function SimilarToolsCard({ toolIds = null, sx = {} }) {
  const theme = useTheme()
  const { t, getToolTitle } = useTranslation()
  
  // toolIds null/undefined ise hook ile otomatik bul
  const autoToolIds = useSimilarTools()
  const finalToolIds = toolIds || autoToolIds
  
  const tools = finalToolIds.map((id) => getToolById(id)).filter(Boolean)
  if (tools.length === 0) return null

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1, // Alt katmanda olsun (sidebar'ın altında)
        width: '100%',
        mr: { md: 3 }, // Sidebar ile arasında boşluk (sağdan margin)
        ...sx,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3.5,
          borderColor: alpha(theme.palette.divider, 0.15),
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          maxWidth: 480,
          width: '100%',
          minWidth: 0,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 8px rgba(0, 0, 0, 0.2)'
            : '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle1" fontWeight="700" color="text.primary" gutterBottom>
          {t('similarTools')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('similarToolsDesc')}
        </Typography>
        <List disablePadding>
          {tools.map((tool) => (
            <ListItem key={tool.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={tool.path}
                sx={{
                  borderRadius: 2.5,
                  px: 2,
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-5px)',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0, 0, 0, 0.4)'
                      : '0 8px 24px rgba(0, 0, 0, 0.12)',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{tool.icon}</ListItemIcon>
                <ListItemText primary={getToolTitle(tool.id)} primaryTypographyProps={{ fontWeight: 500 }} />
                <ArrowForwardIcon 
                  fontSize="small" 
                  sx={{ 
                    color: 'text.disabled',
                    transition: 'transform 0.3s ease',
                    '.MuiListItemButton-root:hover &': {
                      transform: 'translateX(4px)',
                      color: 'primary.main',
                    },
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
    </Box>
  )
}
