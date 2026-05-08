import { useState, useEffect } from 'react'
import axios from 'axios'

function NewsFeed() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/news')
      .then(res => { setNews(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="card">⏳ Loading news...</div>

  return (
    <div className="card fade-in" style={{ padding: '20px', height: '100%' }}>
      <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        📰 Sustainability News
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
        {news.map(item => (
          <div key={item.id} style={{ 
            padding: '12px', 
            background: 'var(--input-bg)', 
            borderRadius: '12px',
            border: '1px solid var(--card-border)'
          }}>
            <small style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {item.source}
            </small>
            <h4 style={{ fontSize: '0.95rem', margin: '4px 0' }}>{item.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '15px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Stay updated with the latest in green technology and climate action.
      </p>
    </div>
  )
}

export default NewsFeed
