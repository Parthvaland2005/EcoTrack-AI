import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'
import { toast } from 'react-toastify'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/login', { email, password })
      toast.success('Welcome back, ' + res.data.user.name + '!')
      login(res.data.user, res.data.token)
      navigate('/calculator')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌿</div>
          <h1 style={{ fontSize: '2rem' }}>EcoTrack AI</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            AI-Powered Carbon Footprint Tracker
          </p>
        </div>

        <div className="card fade-in" style={{ marginTop: 0 }}>
          <h2 style={{ marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Login to track your carbon footprint
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="📧 Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginTop: '8px' }}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="🔒 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ margin: 0, paddingRight: '45px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '5px',
                  color: 'var(--text-muted)',
                  width: 'auto',
                  margin: 0,
                  fontSize: '1.1rem'
                }}
              >
                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <button type="submit" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? '⏳ Logging in...' : '🚀 Login'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Sign up free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
