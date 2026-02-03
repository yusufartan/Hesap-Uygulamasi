import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { store } from './app/store'
import * as Sentry from "@sentry/react"
import './index.css'
import App from './App.jsx'

// Sentry Başlatma (DSN adresini kendi projenizden almalısınız)
Sentry.init({
  dsn: "https://35c4995b7851e846c43193992b64f58c@o4510824461107200.ingest.de.sentry.io/4510824477491280",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
