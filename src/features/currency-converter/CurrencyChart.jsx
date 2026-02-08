import React, { useState, useEffect } from 'react'
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme, alpha, CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { fetchHistoricalRates } from './currencyUtils'

const PERIODS = [
  { key: '1H', days: 7, label: '1H' }, // 1 Hafta (API 1 gün için grafik çizmez, en az 1 hafta mantıklı)
  { key: '1A', days: 30, label: '1A' },
  { key: '1Y', days: 365, label: '1Y' },
  { key: '5Y', days: 365 * 5, label: '5Y' },
  { key: 'MAX', days: 365 * 10, label: 'Maks' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        bgcolor: 'rgba(30, 30, 30, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
        p: 1.5,
        boxShadow: 4
      }}>
        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
          {payload[0].value.toFixed(4)}
        </Typography>
        <Typography variant="caption" sx={{ color: '#bbb' }}>
          {dayjs(label).locale('tr').format('D MMM YYYY')}
        </Typography>
      </Box>
    )
  }
  return null
}

export default function CurrencyChart({ fromCurrency, toCurrency }) {
  const theme = useTheme()
  const [period, setPeriod] = useState('1A')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setData([])
      return
    }

    const config = PERIODS.find((p) => p.key === period) || PERIODS[1]

    // Bitiş tarihi bugün
    const end = dayjs()
    // Başlangıç tarihi
    const start = end.subtract(config.days, 'day')

    // API formatı: YYYY-MM-DD
    const startStr = start.format('YYYY-MM-DD')
    const endStr = end.format('YYYY-MM-DD')

    setLoading(true)

    fetchHistoricalRates(fromCurrency, toCurrency, startStr, endStr)
      .then(({ dates, rates }) => {
        if (!dates || dates.length === 0) {
          setData([])
          return
        }
        // Recharts formatına çevir
        const formattedData = dates.map((d, i) => ({
          date: d,
          value: rates[i]
        }))
        setData(formattedData)
      })
      .catch((err) => {
        console.error(err)
        setData([])
      })
      .finally(() => setLoading(false))
  }, [fromCurrency, toCurrency, period])

  if (fromCurrency === toCurrency) return null

  const chartColor = theme.palette.success.main || '#1e8e3e'

  return (
    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 4,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        minHeight: 320
      }}
    >
      {/* ... Üst Başlık ve Butonlar (Buralar aynı kalıyor) ... */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight="600">
            {fromCurrency} - {toCurrency}
          </Typography>
          {data.length > 0 && (
             <Typography variant="h4" fontWeight="800" sx={{ color: chartColor, mt: 0.5 }}>
               {data[data.length - 1].value?.toFixed(4)}
             </Typography>
          )}
        </Box>

        <ToggleButtonGroup
          size="small"
          value={period}
          exclusive
          onChange={(_, v) => v && setPeriod(v)}
          sx={{ 
            bgcolor: alpha(theme.palette.background.default, 0.6),
            p: 0.5,
            borderRadius: 3,
            '& .MuiToggleButton-root': { 
                border: 'none', 
                borderRadius: '8px !important',
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                    bgcolor: '#fff',
                    color: '#000',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            } 
          }}
        >
          {PERIODS.map((p) => (
            <ToggleButton key={p.key} value={p.key}>
              {p.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* !!! DÜZELTME BURADA YAPILDI !!! */}
      <Box sx={{ width: '100%', height: 240, minWidth: 0, position: 'relative' }}> 
        {loading ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={30} thickness={4} />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', flexDirection: 'column' }}>
            <Typography variant="body1" fontWeight="500">Grafik Verisi Yok</Typography>
            <Typography variant="caption">Bu tarih aralığı veya para birimi için veri bulunamadı.</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.05)} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: theme.palette.text.disabled }}
                tickFormatter={(str) => dayjs(str).format('D MMM')}
                minTickGap={40}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis domain={['auto', 'auto']} hide={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: theme.palette.text.secondary, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  )

}