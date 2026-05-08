import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext, LanguageContext } from '../App'

const QUIZ_DATA = [
  { q: "Which gas is most responsible for global warming?", a: "Carbon Dioxide", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"] },
  { q: "What is the best way to reduce plastic waste?", a: "Using reusable bags", options: ["Burning plastic", "Using reusable bags", "Throwing it in the sea", "Buying more plastic"] },
  { q: "Which of these is a renewable energy source?", a: "Solar Energy", options: ["Coal", "Solar Energy", "Natural Gas", "Oil"] },
  { q: "What does the 'R' in 'Reduce, Reuse, Recycle' stand for?", a: "All of the above", options: ["Reduce", "Reuse", "Recycle", "All of the above"] }
]

function SustainabilityQuiz({ token, onPointsClaimed }) {
  const { t } = useContext(LanguageContext)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasDoneToday, setHasDoneToday] = useState(false)

  useEffect(() => {
    const lastDate = localStorage.getItem('last_quiz_date')
    const today = new Date().toDateString()
    
    if (lastDate === today) {
      setHasDoneToday(true)
    } else {
      const randomQuiz = QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)]
      setCurrentQuiz(randomQuiz)
    }
  }, [])

  const handleSubmit = async () => {
    if (!selectedOption) return
    
    const correct = selectedOption === currentQuiz.a
    setIsCorrect(correct)
    setSubmitted(true)
    localStorage.setItem('last_quiz_date', new Date().toDateString())

    if (correct) {
      try {
        await axios.post('/api/claim-points', { points: 20 }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (onPointsClaimed) onPointsClaimed()
      } catch (err) {
        console.error(err)
      }
    }
  }

  if (hasDoneToday) return (
    <div className="card fade-in" style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem' }}>🎉</p>
      <h4>You've finished today's quiz!</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Come back tomorrow for more Eco Points.</p>
    </div>
  )

  if (!currentQuiz) return null

  return (
    <div className="card fade-in" style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>🧠 Daily Eco-Quiz</h3>
      <p style={{ marginBottom: '15px', fontWeight: '500' }}>{currentQuiz.q}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQuiz.options.map(opt => (
          <button 
            key={opt}
            disabled={submitted}
            onClick={() => setSelectedOption(opt)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '12px', 
              background: selectedOption === opt ? 'var(--primary-glow)' : 'var(--input-bg)',
              border: selectedOption === opt ? '1px solid var(--primary)' : '1px solid var(--card-border)',
              color: 'var(--text)',
              margin: 0
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {!submitted ? (
        <button 
          onClick={handleSubmit} 
          disabled={!selectedOption}
          style={{ marginTop: '20px', background: 'var(--primary)' }}
        >
          Submit Answer
        </button>
      ) : (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '10px', background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isCorrect ? '#22c55e' : '#ef4444', textAlign: 'center' }}>
          {isCorrect ? '✅ Correct! +20 Points added.' : '❌ Oops! Wrong answer. Better luck tomorrow!'}
        </div>
      )}
    </div>
  )
}

export default SustainabilityQuiz
