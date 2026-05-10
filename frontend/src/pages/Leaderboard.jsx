import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../App'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    axios.get('/api/leaderboard')
      .then(res => { 
        // Process true rankings to handle ties
        const sortedData = res.data.sort((a, b) => b.eco_points - a.eco_points)
        
        let currentRank = 1;
        let previousScore = null;
        let rankOffset = 0;
        
        const rankedData = sortedData.map((leader) => {
          if (previousScore !== null && leader.eco_points < previousScore) {
            currentRank += rankOffset + 1;
            rankOffset = 0;
          } else if (previousScore !== null && leader.eco_points === previousScore) {
            rankOffset += 1;
          }
          previousScore = leader.eco_points;
          return { ...leader, rank: currentRank }
        })
        
        setLeaders(rankedData)
        setLoading(false) 
      })
      .catch(() => setLoading(false))
  }, [])

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank) => {
    if (rank === 1) return '#22c55e'
    if (rank === 2) return '#3b82f6'
    if (rank === 3) return '#f59e0b'
    return 'var(--text-muted)'
  }

  const maxPoints = leaders.length > 0 ? Math.max(...leaders.map(l => l.eco_points)) || 1 : 1

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '150px' }}>
        <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🌍</div>
        <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading leaderboard...</p>
      </div>
    )
  }
  
  // Extract top 3 for podium
  const top3 = leaders.filter(l => l.rank <= 3).slice(0, 3);
  // Sort podium specifically for visual layout: 2nd, 1st, 3rd
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push(top3[1]);
  if (top3[0]) podiumOrder.push(top3[0]);
  if (top3[2]) podiumOrder.push(top3[2]);

  const restOfLeaders = leaders.filter(l => !top3.includes(l));

  return (
    <div className="container">
      <h1 className="fade-in">🏆 Leaderboard</h1>
      <p className="subtitle fade-in">Highest Eco Points wins the crown!</p>

      {leaders.length === 0 ? (
        <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 30px' }}>
          <p style={{ fontSize: '4rem', marginBottom: '12px' }}>🌍</p>
          <h2>No one here yet!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Be the first to claim some points and take the #1 spot.
          </p>
        </div>
      ) : (
        <div className="fade-in" style={{ marginTop: '20px' }}>
          
          {/* Podium UI */}
          {podiumOrder.length > 0 && (
            <div className="podium-container fade-in">
              {podiumOrder.map((leader) => (
                <div key={leader.name} className="podium-item">
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(leader.name)}`} 
                    alt="avatar" 
                    className="podium-avatar"
                    style={{ borderColor: getRankColor(leader.rank) }}
                  />
                  <div className={`podium-step rank-${leader.rank}`}>
                    <div className="podium-rank">{getRankEmoji(leader.rank)}</div>
                    <div className="podium-name" title={leader.name}>{leader.name}</div>
                    <div className="podium-score" style={{ color: getRankColor(leader.rank) }}>
                      {leader.eco_points.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List UI for remaining leaders */}
          {restOfLeaders.map((leader, i) => {
            const isCurrentUser = user && user.name === leader.name;
            return (
              <div
                key={leader.name + i}
                className={`rank-row ${isCurrentUser ? 'current-user-row' : ''}`}
                style={{
                  borderLeft: `3px solid ${getRankColor(leader.rank)}`,
                  animationDelay: `${i * 0.08}s`
                }}
              >
                {isCurrentUser && <div className="current-user-badge">YOU</div>}
                <span style={{ fontSize: '1.5rem', minWidth: '50px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  {getRankEmoji(leader.rank)}
                </span>
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(leader.name)}`} 
                  alt="avatar" 
                  style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--input-bg)' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <strong style={{ fontSize: '1.05rem', color: isCurrentUser ? 'var(--primary)' : 'inherit' }}>
                      {leader.name}
                    </strong>
                    <span style={{ color: getRankColor(leader.rank), fontWeight: '800', fontSize: '1.1rem' }}>
                      {leader.eco_points.toLocaleString()} <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Eco Points</span>
                    </span>
                  </div>
                  <div className="gauge-track">
                    <div
                      className="gauge-fill"
                      style={{
                        width: `${Math.min((leader.eco_points / maxPoints) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${getRankColor(leader.rank)}, ${getRankColor(leader.rank)}88)`
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card fade-in" style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          🌱 The higher your eco points, the higher you rank! Keep doing green activities to climb up.
        </p>
      </div>
    </div>
  )
}

export default Leaderboard
