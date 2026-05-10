import { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext, LanguageContext } from '../App'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

function ChatBot() {
  const { token } = useContext(AuthContext)
  const { language, t } = useContext(LanguageContext)

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "🌿 **Welcome to EcoBot AI!**\n\nI'm your personal sustainability assistant. I can help you analyze your carbon footprint, suggest green alternatives, or answer questions about environmental impact. How can I assist you today?"
    }
  ])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const messagesEndRef = useRef(null)

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages, isTyping])

  // Voice Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript)
    }
    recognition.start()
  }

  const sendMessage = async (overrideInput = '') => {
    const messageText = overrideInput || input
    if (!messageText.trim() || isTyping) return

    const userMsg = { from: 'user', text: messageText }
    const updatedHistory = [...messages, userMsg]
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await axios.post(
        '/api/chat',
        {
          message: messageText,
          history: updatedHistory,
          language: language === 'gu' ? 'Gujarati' : language === 'hi' ? 'Hindi' : 'English'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }])
    } catch (err) {
      const errorMsg = err.response?.data?.reply || '⚠️ Connection lost. Please try again.'
      setMessages(prev => [...prev, { from: 'bot', text: errorMsg }])
    } finally {
      setIsTyping(false)
    }
  }

  const quickQuestions = [
    'How to reduce emissions?',
    'Carbon footprint tips',
    'Sustainable diet',
    'Green energy'
  ]

  return (
    <div className="container" style={{ maxWidth: '1000px', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Professional Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '0 10px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>EcoBot <span style={{ color: 'var(--primary)', opacity: 0.8 }}>AI</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Sustainable Intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ 
                background: 'var(--primary-glow)', 
                color: 'var(--primary)', 
                padding: '6px 14px', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--primary)'
            }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }}></span>
                Online
            </div>
        </div>
      </motion.div>

      {/* Main Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          flex: 1, 
          background: 'var(--card-bg)', 
          borderRadius: '24px', 
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }}
      >
        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ 
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                    padding: '16px 22px', 
                    borderRadius: msg.from === 'user' ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                    background: msg.from === 'user' ? 'linear-gradient(135deg, var(--primary), #10b981)' : 'var(--input-bg)',
                    color: msg.from === 'user' ? 'white' : 'var(--text)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    border: msg.from === 'user' ? 'none' : '1px solid var(--card-border)'
                }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', padding: '0 10px' }}>
                    {msg.from === 'user' ? 'You' : 'EcoBot'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
              <div style={{ background: 'var(--input-bg)', padding: '12px 20px', borderRadius: '20px', display: 'flex', gap: '5px' }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px' }}></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Bar (Quick Replies) */}
        <div style={{ padding: '0 25px 15px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {quickQuestions.map((q, i) => (
                <button 
                    key={i} 
                    onClick={() => sendMessage(q)}
                    style={{ 
                        width: 'auto', 
                        whiteSpace: 'nowrap', 
                        padding: '8px 18px', 
                        background: 'transparent', 
                        border: '1px solid var(--card-border)', 
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        borderRadius: '12px',
                        marginTop: 0
                    }}
                >
                    {q}
                </button>
            ))}
        </div>

        {/* Professional Input Area */}
        <div style={{ padding: '20px 25px 30px', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--card-border)' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--input-bg)', 
            borderRadius: '18px', 
            padding: '8px 12px', 
            border: '1px solid var(--card-border)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <button 
                onClick={startListening}
                style={{ 
                    width: '44px', height: '44px', borderRadius: '12px', background: isListening ? 'var(--danger)' : 'transparent',
                    color: isListening ? 'white' : 'var(--text-muted)', border: 'none', padding: 0, margin: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`} style={{ fontSize: '1.2rem' }}></i>
            </button>
            <input
              type="text"
              placeholder={isListening ? t.listening : t.message_placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 15px', fontSize: '1rem', marginTop: 0 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              style={{ 
                width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)',
                color: 'white', border: 'none', padding: 0, margin: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px var(--primary-glow)'
              }}
            >
              <i className="bi bi-send-fill" style={{ fontSize: '1.1rem' }}></i>
            </button>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px', opacity: 0.6 }}>
            EcoBot AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatBot