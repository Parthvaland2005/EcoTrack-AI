import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../App'
import WeatherWidget from '../components/WeatherWidget'
import PdfDownload from '../components/PdfDownload'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'

const GRADE_CONFIG = {
  A: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Excellent 🌟' },
  B: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Good ✅' },
  C: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Average ⚠️' },
  D: { color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'High 🔴' },
  F: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Critical 🚨' },
}

function EmissionCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: '1.4rem' }}>{value}</div>
      <div className="stat-label">kg CO₂</div>
    </div>
  )
}

function Calculator() {
  const { user, token } = useContext(AuthContext)
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('calculatorForm')
    return saved ? JSON.parse(saved) : {
      transport_distance: '',
      electricity_usage: '',
      fuel_usage: '',
      food_type: 'veg'
    }
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value }
    setForm(newForm)
    localStorage.setItem('calculatorForm', JSON.stringify(newForm))
  }

  const handleReset = () => {
    const emptyForm = {
      transport_distance: '',
      electricity_usage: '',
      fuel_usage: '',
      food_type: 'veg'
    }
    setForm(emptyForm)
    setResult(null)
    localStorage.removeItem('calculatorForm')
  }

  const handleSubmit = async () => {
    if (!form.transport_distance && !form.electricity_usage && !form.fuel_usage) {
      toast.error('Please fill in at least one field.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/calculate', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResult(res.data)
      
      // Trigger confetti if score is decent!
      if (res.data.eco_score > 40) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#3b82f6']
        })
      }
      
      toast.success('Calculation complete! Check your result below.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Is the backend running?')
    }
    setLoading(false)
  }

  const handleShare = async () => {
    const text = `I just tracked my Carbon Footprint with EcoTrack AI! 🌍\n\nTotal Emission: ${result.total_emission} kg CO₂\nBadge: ${result.eco_badge}\n\nTrack yours today!`
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Score copied to clipboard! 📋')
    } catch (e) {
      toast.error('Failed to copy text.')
    }
  }

  const gaugePercent = result
    ? Math.min((result.total_emission / 60) * 100, 100)
    : 0

  const gradeConf = result ? (GRADE_CONFIG[result.grade] || GRADE_CONFIG['C']) : null

  return (
    <div className="container">
      <h1>EcoTrack AI 🌿</h1>
      <p className="subtitle">AI-Powered Carbon Footprint Tracker • Welcome, <strong>{user?.name}</strong>!</p>

      <WeatherWidget />

      <div className="card">
        <h2>📋 Daily Activity Input</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
          Fill in your daily activity data below to calculate your emissions.
        </p>

        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🚍 Transport Distance (km) <i className="bi bi-info-circle" title="Average km traveled by car, bus, or bike per month."></i>
          </label>
          <input
            type="number"
            name="transport_distance"
            placeholder="e.g. 500"
            value={form.transport_distance}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div style={{ position: 'relative', marginTop: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ⚡ Electricity Usage (kWh) <i className="bi bi-info-circle" title="Total units (kWh) consumed in your house per month."></i>
          </label>
          <input
            type="number"
            name="electricity_usage"
            placeholder="e.g. 200"
            value={form.electricity_usage}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div style={{ position: 'relative', marginTop: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ⛽ Fuel Usage (litres) <i className="bi bi-info-circle" title="Litres of LPG or Diesel used for cooking/generators."></i>
          </label>
          <input
            type="number"
            name="fuel_usage"
            placeholder="e.g. 15"
            value={form.fuel_usage}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div style={{ position: 'relative', marginTop: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🍽️ Diet Type <i className="bi bi-info-circle" title="Non-vegetarian diets typically have higher carbon footprints."></i>
          </label>
          <select name="food_type" value={form.food_type} onChange={handleChange}>
            <option value="veg">🥦 Vegetarian Diet</option>
            <option value="non-veg">🍖 Non-Vegetarian Diet</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
            {loading ? '⏳ Analyzing...' : '🌍 Calculate'}
          </button>
          <button 
            onClick={handleReset} 
            disabled={loading} 
            style={{ 
              background: 'var(--card-bg)', 
              color: 'var(--text-muted)', 
              border: '1px solid var(--card-border)',
              width: 'auto',
              padding: '0 20px'
            }}
            title="Refresh / Clear Form"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {result && (
        <div className="fade-in">
          {/* Grade Header */}
          <div className="card" style={{ borderLeft: `4px solid ${gradeConf.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2>📊 Your Results</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Highest source: <strong style={{ color: gradeConf.color }}>{result.highest_source}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  className="grade-badge"
                  style={{ borderColor: gradeConf.color, color: gradeConf.color, background: gradeConf.bg }}
                >
                  {result.grade}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {gradeConf.label}
                </div>
              </div>
            </div>

            {/* Gauge */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>0 kg</span>
                <span>Total: <strong style={{ color: gradeConf.color }}>{result.total_emission} kg CO₂</strong></span>
                <span>60+ kg</span>
              </div>
              <div className="gauge-track">
                <div
                  className="gauge-fill"
                  style={{
                    width: `${gaugePercent}%`,
                    background: `linear-gradient(90deg, #22c55e, ${gradeConf.color})`
                  }}
                />
              </div>
            </div>

            {/* Emission Cards */}
            <div className="grid" style={{ marginTop: '20px' }}>
              <EmissionCard icon="🚗" label="Transport" value={result.transport_emission} />
              <EmissionCard icon="⚡" label="Electricity" value={result.electricity_emission} />
              <EmissionCard icon="⛽" label="Fuel" value={result.fuel_emission} />
              <EmissionCard icon="🍽️" label="Food" value={result.food_emission} />
            </div>

            {/* Prediction */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📈 Predicted Next Month
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
                  {result.predicted_future_emission} kg CO₂
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                India avg: <strong>~5.2 kg/day</strong>
              </div>
            </div>

            {/* Suggestion */}
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: gradeConf.bg,
              border: `1px solid ${gradeConf.color}33`,
              borderRadius: '10px'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '6px' }}>💬 {result.suggestion}</p>
              <p style={{ fontSize: '0.88rem', opacity: 0.85 }}>🔑 {result.tip}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
              <PdfDownload result={result} />
              <button 
                onClick={handleShare}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  width: 'auto',
                  marginTop: '0'
                }}
              >
                <i className="bi bi-share-fill" style={{ marginRight: '8px' }}></i>
                Share Score
              </button>
            </div>
          </div>
        </div>
      )}
      <footer style={{ marginTop: '40px', padding: '20px', textAlign: 'center', borderTop: '1px solid var(--card-border)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
          Designed & Developed by <span style={{ color: 'var(--primary)' }}>Parth Valand</span> 💚
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>
          EcoTrack AI © {new Date().getFullYear()}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
          Sustainable Innovation for a Greener Tomorrow 🌿
        </p>
      </footer>
    </div>
  )
}

export default Calculator
