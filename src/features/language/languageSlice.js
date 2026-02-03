import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Tarayıcıda kayıtlı dil varsa onu al, yoksa Türkçe (tr) başla
  currentLanguage: localStorage.getItem('app_language') || 'tr',
}

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload
      localStorage.setItem('app_language', action.payload)
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
