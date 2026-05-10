import { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext, LanguageContext } from '../App'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

function FloatingChat() {
  const { token } = useContext(AuthContext)
  const { language, t } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🌿 Hi! I\'m EcoBot. Ask me anything about emissions!' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const sendMessage = async (overrideInput) => {
    const messageText = overrideInput || input
    if (!messageText.trim() || isTyping) return

    const userMsg = { from: 'user', text: messageText }
    const updatedHistory = [...messages, userMsg]
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await axios.post('/api/chat', { 
        message: messageText,
        history: updatedHistory.slice(-6),
        language: language === 'gu' ? 'Gujarati' : language === 'hi' ? 'Hindi' : 'English'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const botMsg = { from: 'bot', text: res.data.reply }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      const errorMsg = err.response?.data?.reply || '⚠️ Connection lost. Please try again.'
      setMessages(prev => [...prev, { from: 'bot', text: errorMsg }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="floating-chat">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chat-window"
          >
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>🤖 EcoBot AI</h4>
              </div>
              <button 
                  onClick={() => setIsOpen(false)}
                  style={{ width: '30px', height: '30px', padding: 0, margin: 0, background: 'transparent', color: 'var(--text-muted)', border: 'none' }}
              >
                  <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="chat-messages" style={{ height: '350px', padding: '15px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={msg.from === 'user' ? 'chat-user' : 'chat-bot'}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bot">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area" style={{ padding: '12px', borderTop: '1px solid var(--card-border)' }}>
              <div className="chat-input-wrapper" style={{ padding: '4px 4px 4px 14px', borderRadius: '25px' }}>
                <input
                  type="text"
                  placeholder={t.message_placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: '0.9rem', border: 'none', background: 'transparent', width: '100%' }}
                />
                <button
                  onClick={() => sendMessage()}
                  className="send-btn"
                  disabled={isTyping || !input.trim()}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="bi bi-arrow-up-short" style={{ fontSize: '1.4rem' }}></i>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="chat-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
            background: 'var(--primary)',
            border: 'none',
            color: 'white'
        }}
      >
        {isOpen ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chat-dots-fill"></i>}
      </motion.button>
    </div>
  )
}

export default FloatingChat
