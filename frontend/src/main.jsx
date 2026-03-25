import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './ThemeContext'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import Detector from './pages/Detector'
import Analytics from './pages/Analytics'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/inbox" element={<PrivateRoute><Inbox /></PrivateRoute>} />
          <Route path="/detector" element={<PrivateRoute><Detector /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
import Profile from './pages/Profile'

// add this route:
<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />