import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext, LanguageContext } from '../App'

function LandingPage() {
  const { user } = useContext(AuthContext)
  const { t } = useContext(LanguageContext)

  const features = [
    { icon: 'bi-robot', title: 'AI Eco-Bot', desc: 'Personalized sustainability advice powered by Gemini AI.' },
    { icon: 'bi-calculator', title: 'Carbon Tracker', desc: 'Track your daily emissions and see your impact on the planet.' },
    { icon: 'bi-wind', title: 'Live AQI', desc: 'Real-time air quality tracking for your current location.' },
    { icon: 'bi-trophy', title: 'Daily Quizzes', desc: 'Learn about the environment and earn Eco Points.' }
  ]

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero" style={{ padding: '80px 20px', background: 'var(--primary-glow)', borderRadius: '0 0 50px 50px' }}>
        <div className="hero-wrapper">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '1', minWidth: '300px' }}
          >
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '20px', color: 'var(--primary)', lineHeight: '1.1' }}>
              Track Your Footprint, <br />
              <span style={{ color: 'var(--text)' }}>Save the Planet.</span>
            </h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '40px', color: 'var(--text-muted)' }}>
              EcoTrack AI helps you measure, analyze, and reduce your carbon footprint with the power of Artificial Intelligence.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to={user ? "/calculator" : "/signup"} className="btn-primary">
                {user ? <>🧮 Go to Calculator</> : <>🚀 Get Started for Free</>}
              </Link>
              {!user && (
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hero-visual"
          >
            <div className="hero-glow-ring"></div>
            <div className="hero-glow-ring-inner"></div>
            <div className="hero-globe">🌍</div>
          </motion.div>
        </div>
      </section>

      {/* Global Impact Stats Banner */}
      <motion.section 
        className="stats-banner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="stat-item">
          <div className="stat-num">50,000+</div>
          <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>kg CO₂ Tracked</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">10,000+</div>
          <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Eco Warriors</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">1,000+</div>
          <div style={{ color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Trees Saved (Est.)</div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.5rem' }}>How It Works</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>Three simple steps to a greener lifestyle.</p>
        
        <div className="how-it-works-grid">
          <motion.div className="how-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div className="step-number">1</div>
            <h3>Track Habits</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Input your daily transport, food, and energy usage into our smart calculator.</p>
          </motion.div>
          <motion.div className="how-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Our AI models instantly calculate your footprint and provide personalized tips.</p>
          </motion.div>
          <motion.div className="how-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="step-number">3</div>
            <h3>Earn Rewards</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Reduce your emissions, climb the leaderboard, and earn Eco Points!</p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: '40px 20px 80px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>Features Designed for You</h2>
        <div className="grid">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: '2.8rem', color: 'var(--primary)', marginBottom: '15px' }}>
                <i className={`bi ${f.icon}`}></i>
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ background: 'var(--card-bg)', padding: '80px 20px', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: 'var(--primary)' }}>Our Mission</h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '800px', margin: '20px auto 0', lineHeight: '1.6' }}>
              We believe that every small action counts. By tracking your daily activities, 
              you become more conscious of your environmental impact. Our goal is to empower 
              billions to lead a sustainable life through data-driven insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid var(--card-border)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
          Designed & Developed by <span style={{ color: 'var(--primary)' }}>Parth Valand</span> 💚
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
          EcoTrack AI © {new Date().getFullYear()}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          Sustainable Innovation for a Greener Tomorrow 🌿
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
