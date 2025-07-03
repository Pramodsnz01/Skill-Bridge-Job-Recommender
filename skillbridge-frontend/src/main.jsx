import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DashboardRefreshProvider } from './context/DashboardRefreshContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DashboardRefreshProvider>
      <App />
    </DashboardRefreshProvider>
  </StrictMode>,
)
