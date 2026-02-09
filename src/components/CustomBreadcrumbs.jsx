import React from 'react'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { toolsConfig } from '../config/toolsConfig'
import { useTranslation } from '../hooks/useTranslation'

// Config'te olmayan sayfaların başlıkları (path segment -> çeviri anahtarı)
const STATIC_PAGE_NAMES = {
  about: 'about',
  contact: 'contact',
  privacy: 'privacy',
  terms: 'terms',
  tools: 'all-tools', // /tools → Tüm Araçlar (redirect ile /tum-araclar'a gider)
  'tum-araclar': 'all-tools',
}

function findToolByPath(path) {
  const normalized = path === '' ? '/' : `/${path}`
  for (const category of toolsConfig) {
    const item = category.items.find((i) => i.path === normalized)
    if (item) return { category, item }
  }
  return null
}

export default function CustomBreadcrumbs() {
  const location = useLocation()
  const { t, getToolTitle, getCategoryTitle } = useTranslation()
  const pathname = location.pathname
  const pathSegment = pathname.replace(/^\//, '').split('/')[0] || ''

  // Ana sayfadaysak breadcrumb gösterme
  if (pathname === '/' || pathname === '') return null

  // /tools → /tum-araclar'a yönlendiriliyor; breadcrumb'da "Tüm Araçlar" göster
  const effectivePath = pathSegment === 'tools' ? 'tum-araclar' : pathSegment
  const found = findToolByPath(effectivePath)
  const isStaticPage = STATIC_PAGE_NAMES[pathSegment] || STATIC_PAGE_NAMES[effectivePath]

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.8 }} />}
        aria-label="breadcrumb"
        sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}
      >
        {/* 1. Adım: Ana Sayfa */}
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.875rem',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <HomeIcon sx={{ fontSize: 18 }} />
          {t('dashboard')}
        </Link>

        {found ? (
          <>
            {/* 2. Adım: Kategori başlığı */}
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {getCategoryTitle(found.category.id)}
            </Typography>
            {/* 3. Adım: Araç başlığı (aktif sayfa) */}
            <Typography variant="body2" color="text.primary" fontWeight="600" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {getToolTitle(found.item.id)}
            </Typography>
          </>
        ) : (
          /* Config'te yok: sadece sayfa adı (örn. Hakkımızda) */
          <Typography variant="body2" color="text.primary" fontWeight="600" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isStaticPage ? t(STATIC_PAGE_NAMES[pathSegment]) : pathSegment}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  )
}
