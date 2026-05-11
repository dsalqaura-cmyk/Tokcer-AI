import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'iconify-icon'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://9dc5d323ea20ce40fb70523f8ae5cccb@o4511373694271488.ingest.us.sentry.io/4511373708099584",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
