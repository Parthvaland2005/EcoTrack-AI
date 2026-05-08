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
      <section className="hero" style={{ textAlign: 'center', padding: '100px 20px', background: 'var(--primary-glow)', borderRadius: '0 0 50px 50px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: 'var(--primary)' }}>
            Track Your Footprint, <br />
            <span style={{ color: 'var(--text)' }}>Save the Planet.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px', color: 'var(--text-muted)' }}>
            EcoTrack AI helps you measure, analyze, and reduce your carbon footprint with the power of Artificial Intelligence.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
            <Link 
              to={user ? "/calculator" : "/signup"} 
              style={{ 
                padding: '16px 45px', 
                fontSize: '1.2rem', 
                fontWeight: '700',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                textDecoration: 'none', 
                borderRadius: '50px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.6)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)'; }}
            >
              {user ? (
                <>🧮 Go to Calculator</>
              ) : (
                <>🚀 Get Started for Free</>
              )}
            </Link>
            {!user && (
              <Link 
                to="/login" 
                style={{ 
                  padding: '16px 45px', 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  color: 'var(--text)', 
                  textDecoration: 'none', 
                  border: '2px solid var(--card-border)', 
                  borderRadius: '50px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Why Choose EcoTrack AI?</h2>
        <div className="grid">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '30px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '15px' }}>
                <i className={`bi ${f.icon}`}></i>
              </div>
              <h3 style={{ marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.desc}</p>
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
