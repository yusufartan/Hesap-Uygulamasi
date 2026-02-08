import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import CalculateIcon from '@mui/icons-material/Calculate'
import AppsIcon from '@mui/icons-material/Apps'
import CakeIcon from '@mui/icons-material/Cake'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight'
import StorageIcon from '@mui/icons-material/Storage'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import StraightenIcon from '@mui/icons-material/Straighten'
import ScaleIcon from '@mui/icons-material/Scale'
import MemoryIcon from '@mui/icons-material/Memory'
import SpeedIcon from '@mui/icons-material/Speed'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ViewInArIcon from '@mui/icons-material/ViewInAr'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'

/**
 * Araç konfigürasyonu — Profesyonel i18n: Sadece id, path, icon.
 * Başlık ve açıklama translation JSON'dan (tools.{id}.title, tools.{id}.description) gelir.
 * Yeni araç eklerken: buraya { id, path, icon } ekle, locales/*.json'a tools.{id} ekle.
 */
export const toolsConfig = [
  {
    id: 'genel',
    icon: <HomeIcon />,
    items: [
      { id: 'dashboard', path: '/', icon: <HomeIcon /> },
      { id: 'calculator', path: '/calculator', icon: <CalculateIcon /> },
      { id: 'all-tools', path: '/tools', icon: <AppsIcon /> },
    ],
  },
  {
    id: 'finance',
    icon: <AttachMoneyIcon />,
    items: [
      { id: 'discount', path: '/discount', icon: <LocalOfferIcon /> },
      { id: 'finance', path: '/finance', icon: <AttachMoneyIcon /> },
      { id: 'currency', path: '/currency', icon: <CurrencyExchangeIcon /> },
    ],
  },
  {
    id: 'health',
    icon: <MonitorWeightIcon />,
    items: [
      { id: 'bmi', path: '/bmi', icon: <MonitorWeightIcon /> },
    ],
  },
  {
    id: 'time',
    icon: <AccessTimeIcon />,
    items: [
      { id: 'age', path: '/age', icon: <CakeIcon /> },
      { id: 'date', path: '/date', icon: <CalendarMonthIcon /> },
      { id: 'time', path: '/time', icon: <AccessTimeIcon /> },
    ],
  },
  {
    id: 'unit-converters',
    icon: <StraightenIcon />,
    items: [
      { id: 'length', path: '/length', icon: <StraightenIcon /> },
      { id: 'area', path: '/area', icon: <AspectRatioIcon /> },
      { id: 'volume', path: '/volume', icon: <ViewInArIcon /> },
      { id: 'mass', path: '/mass', icon: <ScaleIcon /> },
      { id: 'speed', path: '/speed', icon: <SpeedIcon /> },
      { id: 'temp', path: '/temp', icon: <ThermostatIcon /> },
    ],
  },
  {
    id: 'math-data',
    icon: <MemoryIcon />,
    items: [
      { id: 'data', path: '/data', icon: <StorageIcon /> },
      { id: 'numeral', path: '/numeral', icon: <MemoryIcon /> },
    ],
  },
]
