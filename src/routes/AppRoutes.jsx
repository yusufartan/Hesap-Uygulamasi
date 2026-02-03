import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import NotFoundPage from '../pages/NotFoundPage'

// Lazy Loading
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'))
const AgePage = React.lazy(() => import('../pages/AgePage'))
const AreaPage = React.lazy(() => import('../pages/AreaPage'))
const BmiPage = React.lazy(() => import('../pages/BmiPage'))
const DataPage = React.lazy(() => import('../pages/DataPage'))
const DatePage = React.lazy(() => import('../pages/DatePage'))
const DiscountPage = React.lazy(() => import('../pages/DiscountPage'))
const FinancePage = React.lazy(() => import('../pages/FinancePage'))
const LengthPage = React.lazy(() => import('../pages/LengthPage'))
const MassPage = React.lazy(() => import('../pages/MassPage'))
const NumeralPage = React.lazy(() => import('../pages/NumeralPage'))
const SpeedPage = React.lazy(() => import('../pages/SpeedPage'))
const TempPage = React.lazy(() => import('../pages/TempPage'))
const TimePage = React.lazy(() => import('../pages/TimePage'))
const VolumePage = React.lazy(() => import('../pages/VolumePage'))
const PrivacyPage = React.lazy(() => import('../pages/PrivacyPage'))
const ContactPage = React.lazy(() => import('../pages/ContactPage'))
const AboutPage = React.lazy(() => import('../pages/AboutPage'))
const TermsPage = React.lazy(() => import('../pages/TermsPage'))
const CurrencyPage = React.lazy(() => import('../pages/CurrencyPage'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="age" element={<AgePage />} />
        <Route path="area" element={<AreaPage />} />
        <Route path="bmi" element={<BmiPage />} />
        <Route path="data" element={<DataPage />} />
        <Route path="date" element={<DatePage />} />
        <Route path="discount" element={<DiscountPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="length" element={<LengthPage />} />
        <Route path="mass" element={<MassPage />} />
        <Route path="numeral" element={<NumeralPage />} />
        <Route path="speed" element={<SpeedPage />} />
        <Route path="temp" element={<TempPage />} />
        <Route path="time" element={<TimePage />} />
        <Route path="volume" element={<VolumePage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="currency" element={<CurrencyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}