import React from 'react'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { menuItems } from '../utils/menuItems'
import { useTranslation } from '../hooks/useTranslation'

export default function CustomBreadcrumbs() {
  const location = useLocation()
  const { t } = useTranslation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  if (pathnames.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          {t('dashboard')}
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          
          // URL'den sayfa ismini bul (örn: /age -> Yaş)
          const menuItem = menuItems.find(item => item.path === to)
          // Eğer menüde varsa id'sini çevir, yoksa (örn: about) direkt value'yu çevirmeyi dene
          const name = menuItem ? t(menuItem.id) : t(value)

          return last ? (
            <Typography color="text.primary" key={to} fontWeight="medium">
              {name}
            </Typography>
          ) : (
            <Link component={RouterLink} to={to} underline="hover" color="inherit" key={to}>
              {name}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}