import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Square, Sparkles, Settings } from 'lucide-react'
import Markdown from 'react-markdown'
import './AgrobotPage.css'

const farmerSuggestions = ['Best Crops 🌱', 'Pest Control 🪲', 'Fertilizer Tips 🌿', 'Weather Advice 🌦️']
const engineerSuggestions = ['Diagnostic Codes 🔧', 'Engine Maintenance ⚙️', 'Fleet Optimization 🚜', 'Parts Lookup 🔩']

async function fetchStreaming(body, signal, onChunk) {
    const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal
    })

    if (!res.ok) throw new Error('Stream request failed')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data: ')) continue
            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
                const parsed = JSON.parse(data)
                if (parsed.error) throw new Error(parsed.error)
                if (parsed.content) onChunk(parsed.content)
            } catch {
                // skip malformed chunks
            }
        }
    }
}

async function fetchNonStreaming(body) {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data.reply
}

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

    const [messages, setMessages] = useState(savedChat || defaultGreeting)

    // Sync chat to parent (for localStorage persistence) via effect, not during render
    useEffect(() => {
        onChatChange?.(messages)
    }, [messages])

    const [input, setInput] = useState('')
    const [isStreaming, setIsStreaming] = useState(false)
    const bottomRef = useRef(null)
    const abortRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isStreaming])

    const stopStreaming = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort()
            abortRef.current = null
        }
        setIsStreaming(false)
    }, [])

    const sendMessage = useCallback(async (text) => {
        const trimmed = text.trim()
        if (!trimmed || isStreaming) return

        const userMsg = { id: Date.now(), role: 'user', text: trimmed }
        const updatedMessages = [...messages, userMsg]
        const botMsgId = Date.now() + 1

        setMessages(updatedMessages)
        setInput('')
        setIsStreaming(true)

        const body = {
            messages: updatedMessages,
            role: userRole,
            context: { user: currentUser, products, orders, machines }
        }

        const controller = new AbortController()
        abortRef.current = controller

        try {
            // Try streaming first
            setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: '' }])

            await fetchStreaming(body, controller.signal, (chunk) => {
                setMessages(prev => prev.map(m =>
                    m.id === botMsgId ? { ...m, text: m.text + chunk } : m
                ))
            })
        } catch (err) {
            if (err.name === 'AbortError') return

            // Fallback to non-streaming
            try {
                const reply = await fetchNonStreaming(body)
                setMessages(prev => prev.map(m =>
                    m.id === botMsgId ? { ...m, text: reply } : m
                ))
            } catch (fallbackErr) {
                console.error('Agrobot error:', fallbackErr)
                setMessages(prev => prev.map(m =>
                    m.id === botMsgId
                        ? { ...m, text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.' }
                        : m
                ))
            }
        } finally {
            abortRef.current = null
            setIsStreaming(false)
        }
    }, [messages, userRole, isStreaming, currentUser, products, orders, machines])

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
                        onClick={() => { stopStreaming(); setMessages([{
                            id: Date.now(), role: 'bot',
                            text: isEngineer
                                ? `Chat cleared. How can I help you, Engineer ${userName.split(' ')[0]}?`
                                : `Chat cleared. What can I help you with, ${userName.split(' ')[0]}?`
                        }]); }}
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
                    <button key={s} className="agrobot-chip" onClick={() => sendMessage(s)} disabled={isStreaming}>
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

                {isStreaming && messages[messages.length - 1]?.text === '' && (
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
                    disabled={isStreaming}
                />
                {isStreaming ? (
                    <button
                        className="agrobot-send agrobot-send--stop"
                        onClick={stopStreaming}
                        aria-label="Stop generating"
                    >
                        <Square size={16} />
                    </button>
                ) : (
                    <button
                        className="agrobot-send"
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim()}
                        aria-label="Send"
                    >
                        <Send size={18} />
                    </button>
                )}
            </div>
        </div>
    )
}
