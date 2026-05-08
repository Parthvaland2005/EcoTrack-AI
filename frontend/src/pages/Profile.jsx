import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { AuthContext, ThemeContext, LanguageContext } from '../App'
import CertificateDownload from '../components/CertificateDownload'

function Profile() {
  const { user, token, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { language, toggleLanguage, t } = useContext(LanguageContext)
  const [points, setPoints] = useState(0)

  useEffect(() => {
    axios.get('/api/user-stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPoints(res.data.eco_points))
      .catch(err => console.error(err))
  }, [token])

  // Dicebear avatar based on email
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="fade-in">{t.profile} 👤</h1>
      
      <div className="card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <img 
          src={avatarUrl} 
          alt="Profile Avatar" 
          style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '20px', border: '4px solid var(--primary)' }} 
        />
        <h2 style={{ marginBottom: '5px' }}>{user?.name}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{user?.email}</p>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
             {points} {t.eco_points} 🏆
          </div>
          {points >= 50 ? (
            <CertificateDownload points={points} />
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              💡 Reach 50 points to unlock your Achievement Certificate!
            </p>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '20px', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--primary)' }}>⚙️ {t.settings || 'Settings'}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Theme</span>
            <button 
              onClick={toggleTheme}
              style={{ width: 'auto', margin: 0, padding: '8px 16px', background: 'var(--input-bg)', border: '1px solid var(--card-border)', fontSize: '0.85rem' }}
            >
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Language</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => toggleLanguage('en')}
                style={{ width: 'auto', margin: 0, padding: '6px 12px', background: language === 'en' ? 'var(--primary)' : 'var(--input-bg)', color: language === 'en' ? 'white' : 'var(--text)', fontSize: '0.75rem' }}
              >
                EN
              </button>
              <button 
                onClick={() => toggleLanguage('hi')}
                style={{ width: 'auto', margin: 0, padding: '6px 12px', background: language === 'hi' ? 'var(--primary)' : 'var(--input-bg)', color: language === 'hi' ? 'white' : 'var(--text)', fontSize: '0.75rem' }}
              >
                HI
              </button>
              <button 
                onClick={() => toggleLanguage('gu')}
                style={{ width: 'auto', margin: 0, padding: '6px 12px', background: language === 'gu' ? 'var(--primary)' : 'var(--input-bg)', color: language === 'gu' ? 'white' : 'var(--text)', fontSize: '0.75rem' }}
              >
                GU
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '10px', paddingTop: '20px' }}>
            <button 
              onClick={logout}
              className="logout-btn"
              style={{ width: '100%', padding: '12px', fontWeight: '700' }}
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
