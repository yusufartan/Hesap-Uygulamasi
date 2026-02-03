// c:\VS Code\Projects\Calculator-App\src\app\store.js
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../features/theme/themeSlice'
import languageReducer from '../features/language/languageSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
  },
})
export default store;