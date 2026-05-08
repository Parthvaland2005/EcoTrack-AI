import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Calculator from './pages/Calculator'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import ChatBot from './pages/ChatBot'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import FloatingChat from './components/FloatingChat'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { translations } from './translations'

export const AuthContext = createContext()
export const ThemeContext = createContext()
export const LanguageContext = createContext()

import Profile from './pages/Profile'

import LandingPage from './pages/LandingPage'

import ForgotPassword from './pages/ForgotPassword'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

const AnimatedRoutes = ({ user }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={!user ? <PageWrapper><LoginPage /></PageWrapper> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <PageWrapper><SignupPage /></PageWrapper> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/calculator" element={user ? <PageWrapper><Calculator /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <PageWrapper><Dashboard /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <PageWrapper><Leaderboard /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/chatbot" element={user ? <PageWrapper><ChatBot /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <PageWrapper><Profile /></PageWrapper> : <Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = (lang) => {
    setLanguage(lang)
  }

  const t = translations[language]

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
          <Router>
            <div className="app">
              <ToastContainer theme={theme} position="top-right" autoClose={3000} />
              {user && <Navbar />}
              <AnimatedRoutes user={user} />
              {user && <FloatingChat />}
            </div>
          </Router>
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  )
}

export default App