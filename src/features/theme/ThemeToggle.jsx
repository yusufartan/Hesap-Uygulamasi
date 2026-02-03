// c:\VS Code\Projects\Calculator-App\src\features\theme\ThemeToggle.jsx
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from './themeSlice'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function ThemeToggle({ open }) {
  const dispatch = useDispatch()
  // State güvenliği için ?. operatörü veya fallback kullanımı
  const mode = useSelector((state) => state.theme?.mode || 'light')

  const handleToggle = () => {
    dispatch(toggleTheme())
  }

  // Drawer kapalıyken sadece ikon göster
  if (!open) {
    return (
      <IconButton onClick={handleToggle} size="small">
        {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    )
  }

  // Drawer açıkken tam görünüm
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
        <Typography variant="body2" fontWeight="medium">
          {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </Typography>
      </Box>
      <Switch checked={mode === 'dark'} onChange={handleToggle} size="small" />
    </Box>
  )
}