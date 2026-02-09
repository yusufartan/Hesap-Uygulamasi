import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import { toolsConfig } from '../config/toolsConfig'

// Araç id'leri → sayfa bileşenleri (lazy). Yeni araç eklediğinizde buraya ekleyin.
const COMPONENT_MAP = {
  dashboard: React.lazy(() => import('../pages/DashboardPage')),
  'all-tools': React.lazy(() => import('../pages/DashboardPage')),
  calculator: React.lazy(() => import('../pages/CalculatorPage')),
  age: React.lazy(() => import('../pages/AgePage')),
  area: React.lazy(() => import('../pages/AreaPage')),
  bmi: React.lazy(() => import('../pages/BmiPage')),
  data: React.lazy(() => import('../pages/DataPage')),
  date: React.lazy(() => import('../pages/DatePage')),
  discount: React.lazy(() => import('../pages/DiscountPage')),
  finance: React.lazy(() => import('../pages/FinancePage')),
  currency: React.lazy(() => import('../pages/CurrencyPage')),
  length: React.lazy(() => import('../pages/LengthPage')),
  mass: React.lazy(() => import('../pages/MassPage')),
  numeral: React.lazy(() => import('../pages/NumeralPage')),
  speed: React.lazy(() => import('../pages/SpeedPage')),
  temp: React.lazy(() => import('../pages/TempPage')),
  time: React.lazy(() => import('../pages/TimePage')),
  volume: React.lazy(() => import('../pages/VolumePage')),
}

// Sabit sayfalar (araç değil)
const LandingPage = React.lazy(() => import('../pages/LandingPage'))
const PrivacyPage = React.lazy(() => import('../pages/PrivacyPage'))
const ContactPage = React.lazy(() => import('../pages/ContactPage'))
const AboutPage = React.lazy(() => import('../pages/AboutPage'))
const TermsPage = React.lazy(() => import('../pages/TermsPage'))
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'))

/** /tools veya /tools/* → /tum-araclar (hash korunur) */
function ToolsRedirect() {
  const { hash } = useLocation()
  return <Navigate to={`/tum-araclar${hash || ''}`} replace />
}

// toolsConfig'den tüm araçları düzleştir (path + id)
const toolRoutes = toolsConfig.flatMap((category) =>
  category.items.map((item) => ({ id: item.id, path: item.path }))
)

// Tek bir bileşen: içeriği HER ZAMAN güncel URL'den (pathname) türetir.
// Böylece route eşleşmesi takılsa bile gösterilen sayfa URL ile senkron kalır.
function ToolContentFromUrl() {
  const { pathname } = useLocation()
  const route = toolRoutes.find((r) => r.path === pathname)
  const toolId = route?.id
  const Component = toolId ? COMPONENT_MAP[toolId] : null
  if (!Component) return <NotFoundPage />
  return <Component key={pathname} />
}

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Yükleniyor...</div>}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Ana sayfa: / — Landing Page */}
          <Route index element={<LandingPage />} />
          {/* /tools veya /tools/* → /tum-araclar yönlendirmesi (hash korunur) */}
          <Route path="tools" element={<ToolsRedirect />} />
          <Route path="tools/*" element={<ToolsRedirect />} />
          {/* Sabit sayfalar (önce eşlensin) */}
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />
          {/* Tüm araç sayfaları (age, date, calculator, ...): tek route, içerik pathname'den */}
          <Route path="*" element={<ToolContentFromUrl />} />
        </Route>
      </Routes>
    </React.Suspense>
  )
}
