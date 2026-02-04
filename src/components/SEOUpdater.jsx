import React from 'react'
import { useLocation } from 'react-router-dom'
import { toolsConfig } from '../config/toolsConfig'
import { useTranslation } from '../hooks/useTranslation'

const SITE_NAME = 'Hesap Uzmanı'
const DEFAULT_TITLE = SITE_NAME
const HOME_TITLE = `${SITE_NAME} - Hayatınızı Kolaylaştıran Araçlar`

function findToolByPath(pathname) {
  const pathSegment = pathname.replace(/^\//, '') || ''
  const normalized = pathSegment === '' ? '/' : `/${pathSegment}`
  for (const category of toolsConfig) {
    const item = category.items.find((i) => i.path === normalized)
    if (item) return { category, item }
  }
  return null
}

export default function SEOUpdater() {
  const location = useLocation()
  const { t } = useTranslation()
  const pathname = location.pathname

  const found = React.useMemo(() => findToolByPath(pathname), [pathname])

  React.useEffect(() => {
    let title = DEFAULT_TITLE
    if (pathname === '/' || pathname === '') {
      title = HOME_TITLE
    } else if (found?.item) {
      const toolName = t(found.item.id) || found.item.title
      title = `${toolName} - ${SITE_NAME}`
    }
    document.title = title
  }, [pathname, found, t])

  React.useEffect(() => {
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && found?.item?.description) {
      metaDesc.setAttribute('content', found.item.description)
    }
  }, [pathname, found])

  return null
}
