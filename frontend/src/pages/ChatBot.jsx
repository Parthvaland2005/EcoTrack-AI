import { useState, useRef, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext, LanguageContext } from '../App'

function ChatBot() {
  const { token } = useContext(AuthContext)
  const { language } = useContext(LanguageContext)

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text:
        "🌿 Hi! I'm EcoBot, powered by Google Gemini AI. Ask me anything about carbon footprint, emissions, or how to go greener!"
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
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang =
      language === 'gu'
        ? 'gu-IN'
        : language === 'hi'
          ? 'hi-IN'
          : 'en-US'

    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.start()
  }

  // Send Message
  const sendMessage = async (overrideInput = '') => {
    const messageText = overrideInput || input

    if (!messageText.trim() || isTyping) return

    const userMsg = {
      from: 'user',
      text: messageText
    }

    const updatedHistory = [...messages, userMsg]

    // Add user message
    setMessages(prev => [...prev, userMsg])

    // Clear input
    setInput('')

    // Show typing
    setIsTyping(true)

    try {
      const res = await axios.post(
        '/api/chat',
        {
          message: messageText,
          history: updatedHistory.slice(-5),
          language:
            language === 'gu'
              ? 'Gujarati'
              : language === 'hi'
                ? 'Hindi'
                : 'English'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const botMsg = {
        from: 'bot',
        text: res.data.reply
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)

      const errorText =
        err.response?.data?.reply ||
        err.response?.data?.message ||
        '⚠️ Oops! Backend connection failed.'

      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: errorText
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Enter key send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  // Quick Questions
  const quickQuestions = [
    'How to reduce emissions?',
    'What is a good footprint?',
    'Tips for transport?',
    'How does food affect CO2?'
  ]

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="fade-in">🤖 EcoBot</h1>

      <p className="subtitle fade-in">
        AI assistant for all your carbon footprint questions
      </p>

      <div className="chat-container fade-in">
        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.from === 'user'
                  ? 'chat-user'
                  : 'chat-bot'
              }
            >
              {msg.text}
            </div>
          ))}

          {/* Typing animation */}
          {isTyping && (
            <div className="chat-bot">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div
          style={{
            padding: '0 20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '10px'
          }}
        >
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              style={{
                width: 'auto',
                padding: '6px 14px',
                marginTop: 0,
                background: 'var(--primary-glow)',
                border: '1px solid var(--card-border)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                borderRadius: '999px',
                boxShadow: 'none',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder={
                isListening
                  ? 'Listening...'
                  : 'Message EcoBot...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* Mic Button */}
            <button
              onClick={startListening}
              className={`mic-btn ${isListening ? 'active' : ''
                }`}
              title="Voice Input"
            >
              <i
                className={`bi ${isListening
                    ? 'bi-mic-fill'
                    : 'bi-mic'
                  }`}
                style={{ fontSize: '1.2rem' }}
              ></i>
            </button>

            {/* Send Button */}
            <button
              onClick={() => sendMessage()}
              className="send-btn"
              disabled={isTyping || !input.trim()}
              title="Send Message"
            >
              <i
                className="bi bi-arrow-up-short"
                style={{ fontSize: '1.8rem' }}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Listening Popup */}
      {isListening && (
        <div
          className="fade-in"
          style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ef4444',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '999px',
            fontWeight: '700',
            boxShadow:
              '0 8px 30px rgba(239, 68, 68, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span
            className="typing-dot"
            style={{ background: 'white' }}
          ></span>

          EcoBot is listening...
        </div>
      )}
    </div>
  )
}

export default ChatBot