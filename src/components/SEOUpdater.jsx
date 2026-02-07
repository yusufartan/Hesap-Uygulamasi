import React from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { toolsConfig } from '../config/toolsConfig'
import { useTranslation } from '../hooks/useTranslation'

// Statik sayfa path → SEO tipi eşlemesi
const STATIC_PAGES = {
  '/': 'home',
  '/tools': 'all-tools',
  '/privacy': 'privacy',
  '/contact': 'contact',
  '/about': 'about',
  '/terms': 'terms',
}

const toolPaths = new Set(
  toolsConfig.flatMap((c) => c.items.map((i) => i.path))
)

function findToolByPath(pathname) {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '') || '/'
  for (const category of toolsConfig) {
    const item = category.items.find((i) => i.path === normalized)
    if (item) return { category, item }
  }
  return null
}

function getPageType(pathname) {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (STATIC_PAGES[normalized]) return STATIC_PAGES[normalized]
  if (normalized === '/' || toolPaths.has(normalized)) return 'tool'
  return 'not-found'
}

export default function SEOUpdater() {
  const { pathname } = useLocation()
  const { t, getToolTitle, getToolDescription, language } = useTranslation()

  const pageType = React.useMemo(() => getPageType(pathname), [pathname])
  const found = React.useMemo(() => findToolByPath(pathname), [pathname])

  const seo = React.useMemo(() => {
    const siteName = t('appTitle')
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://hesapuzmani.com'
    const canonicalPath = pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname
    const canonicalUrl = `${baseUrl}${canonicalPath}`
    const ogImage = `${baseUrl}/HesapMerkezLogo.png`
    const locale = language === 'tr' ? 'tr_TR' : 'en_US'
    const altLocale = language === 'tr' ? 'en_US' : 'tr_TR'

    let title = siteName
    let description = ''
    let keywords = t('seo.defaultKeywords')

    if (pageType === 'home') {
      title = t('seo.homeTitle')
      description = t('seo.homeDesc')
      keywords = t('seo.homeKeywords')
    } else if (pageType === 'all-tools') {
      title = t('seo.allToolsTitle')
      description = t('seo.allToolsDesc')
      keywords = t('seo.allToolsKeywords')
    } else if (pageType === 'about') {
      title = t('seo.aboutTitle')
      description = t('seo.aboutDesc')
      keywords = t('seo.aboutKeywords')
    } else if (pageType === 'contact') {
      title = t('seo.contactTitle')
      description = t('seo.contactDesc')
      keywords = t('seo.contactKeywords')
    } else if (pageType === 'privacy') {
      title = t('seo.privacyTitle')
      description = t('seo.privacyDesc')
      keywords = t('seo.privacyKeywords')
    } else if (pageType === 'terms') {
      title = t('seo.termsTitle')
      description = t('seo.termsDesc')
      keywords = t('seo.termsKeywords')
    } else if (pageType === 'not-found') {
      title = t('seo.notFoundTitle')
      description = t('seo.notFoundDesc')
    } else if (found?.item) {
      const toolId = found.item.id
      const toolName = getToolTitle(toolId)
      const toolDescKey = `seo.tool${toolId.charAt(0).toUpperCase() + toolId.slice(1)}Desc`
      const toolKwKey = `seo.tool${toolId.charAt(0).toUpperCase() + toolId.slice(1)}Keywords`
      const suffix = t('seo.toolTitleSuffix')
      title = `${toolName} | ${suffix} - ${siteName}`
      description = t(toolDescKey) !== toolDescKey ? t(toolDescKey) : (getToolDescription(toolId) || t('seo.defaultKeywords'))
      keywords = t(toolKwKey) !== toolKwKey ? t(toolKwKey) : `${toolName}, ${t('seo.defaultKeywords')}`
    }

    return {
      title,
      description: description || t('seo.homeDesc'),
      keywords,
      canonicalUrl,
      ogImage,
      siteName,
      locale,
      altLocale,
      baseUrl,
    }
  }, [
    pathname,
    pageType,
    found,
    language,
    t,
    getToolTitle,
    getToolDescription,
  ])

  // html lang güncelle (i18n ile uyum)
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'tr' ? 'tr' : 'en'
    }
  }, [language])

  const jsonLd = React.useMemo(() => {
    const website = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: seo.siteName,
      url: seo.baseUrl,
      description: seo.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${seo.baseUrl}/tools?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    }
    const items = []
    const pageName = pageType === 'home' ? seo.siteName
      : pageType === 'all-tools' ? t('all-tools')
      : pageType === 'about' ? t('about')
      : pageType === 'contact' ? t('contact')
      : pageType === 'privacy' ? t('privacy')
      : pageType === 'terms' ? t('terms')
      : found?.item ? getToolTitle(found.item.id) : null

    if (pageName && pathname !== '/') {
      items.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: seo.siteName, item: seo.baseUrl },
          { '@type': 'ListItem', position: 2, name: pageName, item: seo.canonicalUrl },
        ],
      })
    }
    if (found?.item) {
      items.push({
        '@type': 'SoftwareApplication',
        name: getToolTitle(found.item.id),
        applicationCategory: 'UtilitiesApplication',
        description: seo.description,
        url: seo.canonicalUrl,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      })
    }
    return items.length > 0 ? [website, ...items] : website
  }, [seo, found, pathname, pageType, t, getToolTitle])

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:locale" content={seo.locale} />
      <meta property="og:locale:alternate" content={seo.altLocale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />

      {/* Hreflang (çok dilli destek) */}
      <link rel="alternate" hrefLang="tr" href={seo.canonicalUrl} />
      <link rel="alternate" hrefLang="en" href={seo.canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={seo.canonicalUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
