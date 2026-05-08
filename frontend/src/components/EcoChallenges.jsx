import { useState, useEffect } from 'react'
import axios from 'axios'

function EcoChallenges({ token, onPointsClaimed }) {
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Used public transport or cycled today', points: 50, completed: false },
    { id: 2, text: 'Avoided single-use plastic', points: 30, completed: false },
    { id: 3, text: 'Turned off unused electronics', points: 20, completed: false },
    { id: 4, text: 'Reduced meat consumption', points: 40, completed: false }
  ])
  const [claiming, setClaiming] = useState(false)

  const toggleChallenge = (id) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, completed: !c.completed } : c
    ))
  }

  const claimPoints = async () => {
    const totalToClaim = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0)
    if (totalToClaim === 0) return

    setClaiming(true)
    try {
      await axios.post('/api/claim-points', { points: totalToClaim }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert(`🎉 Congratulations! You claimed ${totalToClaim} Eco Points!`)
      setChallenges(prev => prev.map(c => ({ ...c, completed: false })))
      if (onPointsClaimed) onPointsClaimed()
    } catch (err) {
      console.error(err)
    }
    setClaiming(false)
  }

  return (
    <div className="card fade-in" style={{ padding: '20px', height: '100%' }}>
      <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        ✅ Daily Eco-Challenges
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>
        Complete daily tasks to earn points and climb the leaderboard!
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {challenges.map(c => (
          <label key={c.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            background: 'var(--input-bg)', 
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: c.completed ? '1px solid var(--primary)' : '1px solid transparent'
          }}>
            <input 
              type="checkbox" 
              checked={c.completed} 
              onChange={() => toggleChallenge(c.id)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div style={{ flex: 1, fontSize: '0.9rem' }}>{c.text}</div>
            <div style={{ fontWeight: '700', color: 'var(--primary)' }}>+{c.points}</div>
          </label>
        ))}
      </div>

      <button 
        onClick={claimPoints} 
        disabled={claiming || !challenges.some(c => c.completed)}
        style={{ marginTop: '20px', background: 'var(--primary)' }}
      >
        {claiming ? 'Claiming...' : 'Claim My Points 🚀'}
      </button>
    </div>
  )
}

export default EcoChallenges
