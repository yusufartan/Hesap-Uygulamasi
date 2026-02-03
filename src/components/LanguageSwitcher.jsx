import React, { useState } from 'react'
import { IconButton, Menu, MenuItem, Tooltip, Typography, Box } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../features/language/languageSlice'

export default function LanguageSwitcher() {
  const [anchorEl, setAnchorEl] = useState(null)
  const dispatch = useDispatch()
  const currentLang = useSelector((state) => state.language.currentLanguage)
  
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (lang) => {
    if (lang) {
      dispatch(setLanguage(lang))
    }
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Dil Değiştir / Change Language">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <LanguageIcon />
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>
            {currentLang}
          </Typography>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={() => handleClose(null)}
        onClick={() => handleClose(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleClose('tr')} selected={currentLang === 'tr'}>
          <Box component="span" sx={{ mr: 1 }}>🇹🇷</Box> Türkçe
        </MenuItem>
        <MenuItem onClick={() => handleClose('en')} selected={currentLang === 'en'}>
          <Box component="span" sx={{ mr: 1 }}>🇬🇧</Box> English
        </MenuItem>
      </Menu>
    </>
  )
}
