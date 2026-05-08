import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/reset-password', { email, new_password: newPassword })
      toast.success(res.data.message)
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
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
        {/* Header */}
        <div className="fade-in" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔑</div>
          <h1 style={{ fontSize: '2rem' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Securely update your account credentials
          </p>
        </div>

        <div className="card fade-in" style={{ marginTop: 0 }}>
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="📧 Enter your registered email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{ margin: 0 }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="🔒 New password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="🔒 Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  style={{ margin: 0, paddingRight: '45px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  <i className={showConfirm ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? '⏳ Updating...' : '🚀 Update Password'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
            Remembered password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login here →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
