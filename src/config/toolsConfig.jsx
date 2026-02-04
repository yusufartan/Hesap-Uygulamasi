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
 * Araç konfigürasyonu — menuItems.jsx ve AppRoutes.jsx ile senkron.
 * Başlık ve path değerleri menuItems.jsx'ten birebir alınmıştır.
 */
export const toolsConfig = [
  {
    id: 'genel',
    title: 'Genel',
    icon: <HomeIcon />,
    items: [
      {
        id: 'dashboard',
        title: 'Ana Sayfa',
        description: 'Tüm hesaplama araçlarına genel bakış ve hızlı erişim.',
        path: '/',
        icon: <HomeIcon />,
      },
      {
        id: 'calculator',
        title: 'Hesap Makinesi',
        description: 'Basit dört işlem: toplama, çıkarma, çarpma ve bölme.',
        path: '/calculator',
        icon: <CalculateIcon />,
      },
      {
        id: 'all-tools',
        title: 'Tüm Araçlar',
        description: 'Tüm hesaplama araçlarının listesini görüntüleyin.',
        path: '/tools',
        icon: <AppsIcon />,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finans Araçları',
    icon: <AttachMoneyIcon />,
    items: [
      {
        id: 'discount',
        title: 'İndirim',
        description: 'İndirim oranına göre yeni fiyatı ve kazancınızı hesaplayın.',
        path: '/discount',
        icon: <LocalOfferIcon />,
      },
      {
        id: 'finance',
        title: 'Finans',
        description: 'Kredi taksitlerini veya yatırım getirilerini planlayın.',
        path: '/finance',
        icon: <AttachMoneyIcon />,
      },
      {
        id: 'currency',
        title: 'Döviz',
        description: 'Güncel döviz kurları ile anında çeviri yapın.',
        path: '/currency',
        icon: <CurrencyExchangeIcon />,
      },
    ],
  },
  {
    id: 'health',
    title: 'Sağlık',
    icon: <MonitorWeightIcon />,
    items: [
      {
        id: 'bmi',
        title: 'VKE',
        description: 'Boy ve kilonuza göre Vücut Kitle İndeksinizi (BMI) öğrenin.',
        path: '/bmi',
        icon: <MonitorWeightIcon />,
      },
    ],
  },
  {
    id: 'time',
    title: 'Zaman Araçları',
    icon: <AccessTimeIcon />,
    items: [
      {
        id: 'age',
        title: 'Yaş',
        description: 'Doğum tarihinize göre yaşınızı ve sonraki doğum gününüzü hesaplayın.',
        path: '/age',
        icon: <CakeIcon />,
      },
      {
        id: 'date',
        title: 'Tarih',
        description: 'İki tarih arasındaki gün, ay ve yıl farkını kolayca hesaplayın.',
        path: '/date',
        icon: <CalendarMonthIcon />,
      },
      {
        id: 'time',
        title: 'Zaman',
        description: 'Saniye, dakika, saat ve gün gibi zaman birimlerini hesaplayın.',
        path: '/time',
        icon: <AccessTimeIcon />,
      },
    ],
  },
  {
    id: 'unit-converters',
    title: 'Birim Çeviriciler',
    icon: <StraightenIcon />,
    items: [
      {
        id: 'length',
        title: 'Uzunluk',
        description: 'Metre, mil, inç gibi uzunluk ölçü birimlerini dönüştürün.',
        path: '/length',
        icon: <StraightenIcon />,
      },
      {
        id: 'area',
        title: 'Alan',
        description: 'Metrekare, hektar, dönüm gibi alan birimlerini birbirine dönüştürün.',
        path: '/area',
        icon: <AspectRatioIcon />,
      },
      {
        id: 'volume',
        title: 'Hacim',
        description: 'Litre, galon, metreküp gibi hacim ölçülerini birbirine çevirin.',
        path: '/volume',
        icon: <ViewInArIcon />,
      },
      {
        id: 'mass',
        title: 'Kütle',
        description: 'Kilogram, pound, ons gibi kütle birimleri arasında işlem yapın.',
        path: '/mass',
        icon: <ScaleIcon />,
      },
      {
        id: 'speed',
        title: 'Hız',
        description: 'Km/s, mph, knot gibi hız birimlerini birbirine çevirin.',
        path: '/speed',
        icon: <SpeedIcon />,
      },
      {
        id: 'temp',
        title: 'Sıcaklık',
        description: 'Celsius, Fahrenheit ve Kelvin sıcaklık birimlerini dönüştürün.',
        path: '/temp',
        icon: <ThermostatIcon />,
      },
    ],
  },
  {
    id: 'math-data',
    title: 'Matematik & Veri',
    icon: <MemoryIcon />,
    items: [
      {
        id: 'data',
        title: 'Veri',
        description: 'Bit, Byte ve diğer dijital veri birimleri arasında çeviri yapın.',
        path: '/data',
        icon: <StorageIcon />,
      },
      {
        id: 'numeral',
        title: 'Numeral Sistem',
        description: 'Binary, Octal, Decimal ve Hexadecimal sayı sistemlerini dönüştürün.',
        path: '/numeral',
        icon: <MemoryIcon />,
      },
    ],
  },
]
