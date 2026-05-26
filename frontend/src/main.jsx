import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './ThemeContext'
import SplashScreen from './components/SplashScreen'
import { setToken, getToken } from './api/api'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Detector from './pages/Detector'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

// Handle token passed via URL from Chrome extension
const params = new URLSearchParams(window.location.search)
const extToken = params.get('ext_token')
if (extToken) {
  setToken(extToken) // store in memory, not localStorage
  window.history.replaceState({}, '', window.location.pathname)
}

// Private route — checks in-memory token
const PrivateRoute = ({ children }) => {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/inbox" element={<PrivateRoute><Inbox /></PrivateRoute>} />
          <Route path="/detector" element={<PrivateRoute><Detector /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
