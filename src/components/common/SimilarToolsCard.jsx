import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
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
import { getToolById } from '../../config/similarToolsConfig'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * "Benzer Hesaplama Araçları" kutusu. toolIds ile hangi araçların gösterileceği
 * config/similarToolsConfig.js içindeki similarToolsByPageId'den gelir;
 * her sayfada sadece toolIds={similarToolsByPageId[pageId]} geçin.
 */
export default function SimilarToolsCard({ toolIds = [], sx = {} }) {
  const theme = useTheme()
  const { t, getToolTitle } = useTranslation()
  const tools = toolIds.map((id) => getToolById(id)).filter(Boolean)
  if (tools.length === 0) return null

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: alpha(theme.palette.divider, 0.2),
        bgcolor: alpha(theme.palette.background.paper, 0.4),
        maxWidth: 480,
        width: '100%',
        minWidth: 0,
        ...sx,
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
            <ListItem key={tool.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={tool.path}
                sx={{
                  borderRadius: 2,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>{tool.icon}</ListItemIcon>
                <ListItemText primary={getToolTitle(tool.id)} primaryTypographyProps={{ fontWeight: 500 }} />
                <ArrowForwardIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
