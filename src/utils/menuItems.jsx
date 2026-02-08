import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
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

export const menuItems = [
  { text: 'Ana Sayfa', icon: <HomeIcon />, id: 'dashboard', path: '/', description: 'Tüm hesaplama araçlarına genel bakış ve hızlı erişim.' },
  { text: 'Yaş', icon: <CakeIcon />, id: 'age', path: '/age', description: 'Doğum tarihinize göre yaşınızı ve sonraki doğum gününüzü hesaplayın.' },
  { text: 'Alan', icon: <AspectRatioIcon />, id: 'area', path: '/area', description: 'Metrekare, hektar, dönüm gibi alan birimlerini birbirine dönüştürün.' },
  { text: 'VKE', icon: <MonitorWeightIcon />, id: 'bmi', path: '/bmi', description: 'Boy ve kilonuza göre Vücut Kitle İndeksinizi (BMI) öğrenin.' },
  { text: 'Veri', icon: <StorageIcon />, id: 'data', path: '/data', description: 'Bit, Byte ve diğer dijital veri birimleri arasında çeviri yapın.' },
  { text: 'Tarih', icon: <CalendarMonthIcon />, id: 'date', path: '/date', description: 'İki tarih arasındaki gün, ay ve yıl farkını kolayca hesaplayın.' },
  { text: 'İndirim', icon: <LocalOfferIcon />, id: 'discount', path: '/discount', description: 'İndirim oranına göre yeni fiyatı ve kazancınızı hesaplayın.' },
  { text: 'Finans', icon: <AttachMoneyIcon />, id: 'finance', path: '/finance', description: 'Kredi taksitlerini veya yatırım getirilerini planlayın.' },
  { text: 'Döviz', icon: <CurrencyExchangeIcon />, id: 'currency', path: '/currency', description: 'Güncel döviz kurları ile anında çeviri yapın.' },
  { text: 'Uzunluk', icon: <StraightenIcon />, id: 'length', path: '/length', description: 'Metre, mil, inç gibi uzunluk ölçü birimlerini dönüştürün.' },
  { text: 'Kütle', icon: <ScaleIcon />, id: 'mass', path: '/mass', description: 'Kilogram, pound, ons gibi kütle birimleri arasında işlem yapın.' },
  { text: 'Numeral Sistem', icon: <MemoryIcon />, id: 'numeral', path: '/numeral', description: 'Binary, Octal, Decimal ve Hexadecimal sayı sistemlerini dönüştürün.' },
  { text: 'Hız', icon: <SpeedIcon />, id: 'speed', path: '/speed', description: 'Km/s, mph, knot gibi hız birimlerini birbirine çevirin.' },
  { text: 'Sıcaklık', icon: <ThermostatIcon />, id: 'temp', path: '/temp', description: 'Celsius, Fahrenheit ve Kelvin sıcaklık birimlerini dönüştürün.' },
  { text: 'Zaman', icon: <AccessTimeIcon />, id: 'time', path: '/time', description: 'Saniye, dakika, saat ve gün gibi zaman birimlerini hesaplayın.' },
  { text: 'Hacim', icon: <ViewInArIcon />, id: 'volume', path: '/volume', description: 'Litre, galon, metreküp gibi hacim ölçülerini birbirine çevirin.' },
]