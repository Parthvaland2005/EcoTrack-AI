import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'
import { toast } from 'react-toastify'

function SignupPage() {
  const [name, setName] = useState('')
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
      const res = await axios.post('/api/register', { name, email, password })
      toast.success('Account created successfully! Please login.')
      // Redirect to login page directly
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.')
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
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌍</div>
          <h1 style={{ fontSize: '2rem' }}>EcoTrack AI</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Join the green revolution today
          </p>
        </div>

        <div className="card fade-in" style={{ marginTop: 0 }}>
          <h2 style={{ marginBottom: '6px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Sign up to start tracking and reducing emissions
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="👤 Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginTop: '8px' }}
            />
            <input
              type="email"
              placeholder="📧 Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            <button type="submit" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? '⏳ Creating account...' : '✨ Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Login here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
