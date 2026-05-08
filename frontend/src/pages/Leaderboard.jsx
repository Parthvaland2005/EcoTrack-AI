import { useState, useEffect } from 'react'
import axios from 'axios'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/leaderboard')
      .then(res => { setLeaders(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const getRankEmoji = (i) => {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return `#${i + 1}`
  }

  const getRankColor = (i) => {
    if (i === 0) return '#22c55e'
    if (i === 1) return '#3b82f6'
    if (i === 2) return '#f59e0b'
    return 'var(--text-muted)'
  }

  const maxEmission = leaders.length > 0 ? Math.max(...leaders.map(l => l.avg_emission)) : 1

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '150px' }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🌍</div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="fade-in">🏆 Leaderboard</h1>
      <p className="subtitle fade-in">Lowest average carbon footprint wins the crown!</p>

      {leaders.length === 0 ? (
        <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 30px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '12px' }}>🌍</p>
          <h2>No one here yet!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Be the first to calculate your footprint and claim the #1 spot.
          </p>
        </div>
      ) : (
        <div className="fade-in" style={{ marginTop: '20px' }}>
          {leaders.map((leader, i) => (
            <div
              key={i}
              className="rank-row"
              style={{
                borderLeft: `3px solid ${getRankColor(i)}`,
                animationDelay: `${i * 0.08}s`
              }}
            >
              <span style={{ fontSize: '2rem', minWidth: '40px', textAlign: 'center' }}>
                {getRankEmoji(i)}
              </span>
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(leader.name)}`} 
                alt="avatar" 
                style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--input-bg)' }} 
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <strong style={{ fontSize: '1.05rem' }}>{leader.name}</strong>
                  <span style={{ color: getRankColor(i), fontWeight: '800', fontSize: '1.1rem' }}>
                    {leader.avg_emission.toFixed(2)} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>kg CO₂ avg</span>
                  </span>
                </div>
                <div className="gauge-track">
                  <div
                    className="gauge-fill"
                    style={{
                      width: `${Math.min((leader.avg_emission / maxEmission) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${getRankColor(i)}, ${getRankColor(i)}88)`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card fade-in" style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          🌱 The lower your average emission, the higher you rank! Keep reducing your carbon footprint to climb up.
        </p>
      </div>
    </div>
  )
}

export default Leaderboard
