import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import EcoChallenges from '../components/EcoChallenges'
import NewsFeed from '../components/NewsFeed'
import WeatherWidget from '../components/WeatherWidget'
import SustainabilityQuiz from '../components/SustainabilityQuiz'
import { AuthContext, ThemeContext, LanguageContext } from '../App'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px 16px', backdropFilter: 'blur(12px)' }}>
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '0.9rem' }}>{p.name}: {p.value} kg</p>
        ))}
      </div>
    )
  }
  return null
}

function Dashboard() {
  const { token } = useContext(AuthContext)
  const { t } = useContext(LanguageContext)
  const [history, setHistory] = useState([])
  const [userStats, setUserStats] = useState({ eco_points: 0, name: '' })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      // Fetch history first
      const histRes = await axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      setHistory(histRes.data || [])

      // Fetch stats independently so it doesn't break history if it fails
      try {
        const statsRes = await axios.get('/api/user-stats', { headers: { Authorization: `Bearer ${token}` } })
        setUserStats(statsRes.data || { eco_points: 0, name: '' })
      } catch (statsErr) {
        console.error('Stats fetch failed, but history loaded:', statsErr)
      }
    } catch (err) {
      console.error('History fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '150px' }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🌿</div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>{t.loading}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="container">
        <h1 className="fade-in">{t.dashboard} 📊</h1>
        <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 30px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '12px' }}>🌱</p>
          <h2>No data yet!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Go to the Calculator and submit your first footprint to see analytics here.
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr, index) => {
    if (!dateStr) return `#${index}`
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return `#${index}`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const lineData = history.slice(0, 10).reverse().map((log, i) => ({
    day: formatDate(log.created_at, i + 1),
    Emission: parseFloat(log.total_emission)
  }))

  const latest = history[0]
  const pieData = [
    { name: 'Transport', value: parseFloat(latest.transport_emission) || 0 },
    { name: 'Electricity', value: parseFloat(latest.electricity_emission) || 0 },
    { name: 'Fuel', value: parseFloat(latest.fuel_emission) || 0 },
    { name: 'Food', value: parseFloat(latest.food_emission) || 0 }
  ]

  const barData = history.slice(0, 7).reverse().map((log, i) => ({
    name: formatDate(log.created_at, i + 1),
    Transport: parseFloat(log.transport_emission) || 0,
    Electricity: parseFloat(log.electricity_emission) || 0,
    Fuel: parseFloat(log.fuel_emission) || 0,
    Food: parseFloat(log.food_emission) || 0
  }))

  const avgEmission = (history.reduce((sum, l) => sum + parseFloat(l.total_emission || 0), 0) / history.length).toFixed(2)
  const best = Math.min(...history.map(l => parseFloat(l.total_emission || 0)))
  const worst = Math.max(...history.map(l => parseFloat(l.total_emission || 0)))

  const trend = history.length >= 2
    ? parseFloat(history[0].total_emission) < parseFloat(history[1].total_emission) ? '📉 Improving' : '📈 Increasing'
    : '—'

  const handleExportCSV = () => {
    if (!history || history.length === 0) {
      alert('No data available')
      return
    }

    const headers = ["Date", "Transport (kg)", "Electricity (kg)", "Fuel (kg)", "Food (kg)", "Total Emission (kg)", "Eco Score", "Badge"]
    
    const rows = history.map(row => [
      row.created_at || 'N/A',
      row.transport_emission || 0,
      row.electricity_emission || 0,
      row.fuel_emission || 0,
      row.food_emission || 0,
      row.total_emission || 0,
      row.eco_score || 0,
      `"${row.eco_badge || 'N/A'}"` // Quotes to handle emojis properly
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'EcoTrack_History.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h1 className="fade-in">{t.dashboard} 📊</h1>
          <p className="subtitle fade-in">Your carbon footprint analytics & history</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="fade-in"
          style={{ width: 'auto', marginTop: '0', padding: '10px 18px', background: 'var(--card-bg)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
        >
          📄 Export Data (CSV)
        </button>
      </div>

      <div className="card fade-in" style={{ padding: '24px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', marginBottom: '30px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '10px' }}>
          <i className="bi bi-stars"></i> AI Eco-Insight
        </h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
          Hello <strong>{userStats.name || 'Eco-Warrior'}</strong>! {
            history.length > 1
              ? (parseFloat(history[0].total_emission) < parseFloat(history[1].total_emission)
                ? "Awesome progress! Your carbon footprint is trending downwards. You've successfully reduced your impact compared to your last entry. Keep up the green habits! 🌱"
                : "Your emissions have increased slightly. Don't worry! Try looking at your transport or electricity usage for ways to save. Every small step counts! 📉")
              : "Welcome to your first analysis! Use the charts below to track your journey. Aim to keep your 'Total Emission' bars as short as possible! 🌍"
          }
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-label">{t.total_entries}</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>{history.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.avg_emission}</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{avgEmission} <span style={{ fontSize: '1rem' }}>kg</span></div>
        </div>
        <div className="stat-card" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
          <div className="stat-label" style={{ color: 'var(--primary)' }}>{t.eco_points}</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{userStats.eco_points} 🏆</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.trend}</div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>{trend}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best (Lowest)</div>
          <div className="stat-value" style={{ color: '#22c55e' }}>{best.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Worst (Highest)</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{worst.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span></div>
        </div>
      </div>

      <WeatherWidget />

      {/* Area Chart */}
      <div className="card fade-in">
        <h2 style={{ marginBottom: '20px' }}>📈 Emission Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Emission"
              stroke="#22c55e"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEmission)"
              activeDot={{ r: 7, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }} className="fade-in">
        <EcoChallenges token={token} onPointsClaimed={fetchData} />
        <SustainabilityQuiz token={token} onPointsClaimed={fetchData} />
        <NewsFeed />
      </div>

      {/* Pie + Bar */}
      <div className="grid fade-in">
        <div className="card" style={{ margin: 0 }}>
          <h2 style={{ marginBottom: '16px' }}>Latest Breakdown</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <h2 style={{ marginBottom: '16px' }}>Last 7 Entries</h2>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Bar dataKey="Transport" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Electricity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Fuel" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Food" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
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

export default Dashboard
