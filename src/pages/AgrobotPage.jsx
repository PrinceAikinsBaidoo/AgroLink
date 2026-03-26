import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, Settings } from 'lucide-react'
import Markdown from 'react-markdown'
import './AgrobotPage.css'

const farmerSuggestions = ['Best Crops 🌱', 'Pest Control 🪲', 'Fertilizer Tips 🌿', 'Weather Advice 🌦️']
const engineerSuggestions = ['Diagnostic Codes 🔧', 'Engine Maintenance ⚙️', 'Fleet Optimization 🚜', 'Parts Lookup 🔩']

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function AgrobotPage({ userRole = 'farmer', currentUser, products = [], orders = [], machines = [], savedChat, onChatChange }) {
    const userName = currentUser?.name || 'Farmer'
    const isEngineer = userRole === 'engineer'
    const suggestions = isEngineer ? engineerSuggestions : farmerSuggestions

    const defaultGreeting = [{
        id: 1, role: 'bot',
        text: isEngineer
            ? `Hello Engineer ${userName.split(' ')[0]}! I'm Agrobot — your AI assistant for machinery diagnostics, maintenance schedules, and fleet optimization. How can I help?`
            : `Hello ${userName.split(' ')[0]}! I'm Agrobot — your AI farming assistant. I can help with crop advice, pest control, fertilizer tips, and more. What's on your mind?`
    }]

    const [messages, setMessagesLocal] = useState(savedChat || defaultGreeting)

    const setMessages = (updater) => {
        setMessagesLocal(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater
            onChatChange?.(next)
            return next
        })
    }

    const [input, setInput] = useState('')
    const [isTyping, updateIsTyping] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const sendMessage = useCallback(async (text) => {
        const trimmed = text.trim()
        if (!trimmed || isTyping) return

        const userMsg = { id: Date.now(), role: 'user', text: trimmed }
        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setInput('')
        updateIsTyping(true)

        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    role: userRole,
                    context: { user: currentUser, products, orders, machines }
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Request failed')
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: data.reply
            }])
        } catch (err) {
            console.error('Agrobot error:', err)
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.'
            }])
        } finally {
            updateIsTyping(false)
        }
    }, [messages, userRole, isTyping])

    return (
        <div className="agrobot-page">
            <header className="agrobot-header">
                <div className="agrobot-header__left">
                    <div className="agrobot-header__icon">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h2 className="agrobot-header__title">Agrobot</h2>
                        <p className="agrobot-header__subtitle">Powered by AI. Always learning.</p>
                    </div>
                </div>
                <div className="agrobot-header__actions">
                    <button
                        className="agrobot-clear-btn"
                        onClick={() => setMessages([{
                            id: Date.now(), role: 'bot',
                            text: isEngineer
                                ? `Chat cleared. How can I help you, Engineer ${userName.split(' ')[0]}?`
                                : `Chat cleared. What can I help you with, ${userName.split(' ')[0]}?`
                        }])}
                        title="Clear Chat"
                    >
                        Clear Chat
                    </button>
                    <button className="agrobot-header__settings" aria-label="Settings">
                        <Settings size={18} />
                    </button>
                </div>
            </header>

            <div className="agrobot-chips">
                {suggestions.map(s => (
                    <button key={s} className="agrobot-chip" onClick={() => sendMessage(s)}>
                        {s}
                    </button>
                ))}
            </div>

            <div className="agrobot-chat">
                {messages.map(msg => (
                    <div key={msg.id} className={`agrobot-msg agrobot-msg--${msg.role}`}>
                        {msg.role === 'bot' && (
                            <div className="agrobot-msg__avatar">
                                <Sparkles size={14} />
                            </div>
                        )}
                        <div className="agrobot-msg__bubble">
                            {msg.role === 'bot' ? <Markdown>{msg.text}</Markdown> : msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="agrobot-msg agrobot-msg--bot">
                        <div className="agrobot-msg__avatar">
                            <Sparkles size={14} />
                        </div>
                        <div className="agrobot-msg__bubble agrobot-msg__bubble--typing">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="agrobot-input-bar">
                <input
                    className="agrobot-input"
                    placeholder="Ask Agrobot..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                />
                <button
                    className="agrobot-send"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    aria-label="Send"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}
