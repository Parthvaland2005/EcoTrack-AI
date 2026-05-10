import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext, ThemeContext, LanguageContext } from '../App'
import InstallPWA from './InstallPWA'

function Navbar() {
  const { user } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { t } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <nav>
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <i className="bi bi-tree-fill" style={{ marginRight: '8px' }}></i>
          EcoTrack AI
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <Link to="/calculator" className={isActive('/calculator')}><i className="bi bi-calculator"></i> {t.calculator}</Link>
          <Link to="/dashboard" className={isActive('/dashboard')}><i className="bi bi-graph-up-arrow"></i> {t.dashboard}</Link>
          <Link to="/leaderboard" className={isActive('/leaderboard')}><i className="bi bi-trophy"></i> {t.leaderboard}</Link>
          <Link to="/chatbot" className={isActive('/chatbot')}><i className="bi bi-robot"></i> {t.chatbot}</Link>
        </div>

        <div className="nav-actions">
          <div className="desktop-only">
            <InstallPWA />
          </div>
          <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
            {theme === 'dark' ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-stars-fill"></i>}
          </button>
          <Link to="/profile" className={`theme-btn ${isActive('/profile')}`} style={{ textDecoration: 'none' }} title="Profile" onClick={closeMenu}>
            <i className="bi bi-person-circle"></i>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button className="theme-btn mobile-only menu-toggle-btn" onClick={toggleMenu} aria-label="Toggle Menu">
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <Link to="/calculator" className={isActive('/calculator')} onClick={closeMenu}>
            <i className="bi bi-calculator"></i> {t.calculator}
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>
            <i className="bi bi-graph-up-arrow"></i> {t.dashboard}
          </Link>
          <Link to="/leaderboard" className={isActive('/leaderboard')} onClick={closeMenu}>
            <i className="bi bi-trophy"></i> {t.leaderboard}
          </Link>
          <Link to="/chatbot" className={isActive('/chatbot')} onClick={closeMenu}>
            <i className="bi bi-robot"></i> {t.chatbot}
          </Link>
          <div style={{ marginTop: '20px', padding: '0 20px' }}>
             <InstallPWA />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
