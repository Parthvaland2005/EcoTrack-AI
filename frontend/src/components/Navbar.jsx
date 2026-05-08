import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext, ThemeContext, LanguageContext } from '../App'
import InstallPWA from './InstallPWA'

function Navbar() {
  const { user } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { t } = useContext(LanguageContext)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav>
      <Link to="/" className="nav-brand">
        <i className="bi bi-tree-fill" style={{ marginRight: '8px' }}></i>
        EcoTrack AI
      </Link>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/calculator" className={isActive('/calculator')}><i className="bi bi-calculator"></i> {t.calculator}</Link>
        <Link to="/dashboard" className={isActive('/dashboard')}><i className="bi bi-graph-up-arrow"></i> {t.dashboard}</Link>
        <Link to="/leaderboard" className={isActive('/leaderboard')}><i className="bi bi-trophy"></i> {t.leaderboard}</Link>
        <Link to="/chatbot" className={isActive('/chatbot')}><i className="bi bi-robot"></i> {t.chatbot}</Link>
      </div>
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center' }}>
        <InstallPWA />
        <button onClick={toggleTheme} className="theme-btn" title="Toggle Theme">
          {theme === 'dark' ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-stars-fill"></i>}
        </button>
        <Link to="/profile" className={`theme-btn ${isActive('/profile')}`} style={{ textDecoration: 'none' }} title="Profile">
          <i className="bi bi-person-circle"></i>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
