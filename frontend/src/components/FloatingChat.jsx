import { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../App'

function FloatingChat() {
  const { token } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🌿 Hi! I\'m EcoBot. Ask me anything about emissions!' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (overrideInput) => {
    const messageText = overrideInput || input
    if (!messageText.trim() || isTyping) return

    const userMsg = { from: 'user', text: messageText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await axios.post('/api/chat', { message: userMsg.text }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const botMsg = { from: 'bot', text: res.data.reply }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Oops! AI brain is sleeping. Try again later.' }])
    }
    setIsTyping(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="floating-chat">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h4>🤖 EcoBot AI</h4>
            <button 
                onClick={() => setIsOpen(false)}
                style={{ width: '30px', height: '30px', padding: 0, margin: 0, background: 'transparent', color: 'var(--text-muted)' }}
            >
                <i className="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div className="chat-messages" style={{ height: '350px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.from === 'user' ? 'chat-user' : 'chat-bot'} style={{ fontSize: '0.85rem' }}>
                {msg.text}
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

          <div className="chat-input-area" style={{ padding: '12px' }}>
            <div className="chat-input-wrapper" style={{ padding: '4px 4px 4px 14px' }}>
              <input
                type="text"
                placeholder="Ask EcoBot..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ fontSize: '0.85rem !important' }}
              />
              <button
                onClick={() => sendMessage()}
                className="send-btn"
                disabled={isTyping || !input.trim()}
                style={{ width: '34px !important', height: '34px !important', minWidth: '34px !important' }}
              >
                <i className="bi bi-arrow-up-short" style={{ fontSize: '1.4rem' }}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chat-dots-fill"></i>}
      </button>
    </div>
  )
}

export default FloatingChat
