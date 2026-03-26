import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Sparkles, Settings } from 'lucide-react'
import './AgrobotPage.css'

const farmerSuggestions = ['Best Crops 🌱', 'Pest Control 🪲', 'Fertilizer Tips 🌿', 'Weather Advice 🌦️']
const engineerSuggestions = ['Diagnostic Codes 🔧', 'Engine Maintenance ⚙️', 'Fleet Optimization 🚜', 'Parts Lookup 🔩']

const initialFarmerMessages = [
    { id: 1, role: 'user', text: 'What is the best crop to plant now?' },
    {
        id: 2, role: 'bot',
        text: 'Based on current weather patterns and soil data in Ashanti Region, I recommend planting early-maturing Maize or Soybeans. Would you like a detailed guide?',
    },
]

const initialEngineerMessages = [
    { id: 1, role: 'user', text: 'Run fleet diagnostic scan.' },
    {
        id: 2, role: 'bot',
        text: 'Hello Engineer. Looking at your fleet health data, 1 tractor is currently offline and 2 are due for routine engine maintenance. Need any diagnostics or repair guides?',
    },
]

const botResponses = {
    greetings: (name) => [
        `Hey ${name}! 👋 What's going on? How's the day treating you?`,
        `Hello ${name}! Good to see you. Anything on your mind today?`,
        `Hi ${name}! Ready to dive into some farm talk? What's up?`,
        `Hey! How's it going, ${name}? I'm here if you need a hand with anything.`,
    ],
    casual: [
        "Not much, just staying updated on the latest AgTech! What about you?",
        "I'm doing great! Just thinking about how to optimize those crop yields. How are things on your end?",
        "Everything's running smoothly here. Ready to help with any farming or machinery questions you've got!",
    ],
    maize: 'For Maize in the Ashanti Region, use early-maturing varieties (like Omankwa) if planting late. Apply NPK 15-15-15 at planting (2 bags/acre). Pro Tip: Watch for yellowing leaves, which may indicate nitrogen deficiency.',
    cocoa: 'To prevent Black Pod disease in Cocoa, ensure proper pruning for airflow and remove infected pods immediately. Pro Tip: Frequent harvesting (every 2-3 weeks) significantly reduces pest pressure from mirids.',
    rice: 'For Jasmine Rice varieties, maintain a consistent water level of 5-10cm. Use about 3 bags of NPK per acre. Pro Tip: Transplanting 21-day-old seedlings is more effective for weed control than direct seeding.',
    cassava: 'Plant Cassava on mounds or ridges to prevent waterlogging. Use healthy cuttings about 20-30cm long. Pro Tip: Intercropping with maize or cowpea can improve soil health and provide extra income.',
    'pest control': 'I recommend Integrated Pest Management (IPM). For Fall Armyworm, scout fields weekly. Use neem extract sprays for organic control. If using chemicals, apply Pyrethroids only when damage exceeds 20% on young plants.',
    'fertilizer': 'Apply NPK 15-15-15 at the start, followed by Urea or Sulphate of Ammonia 6 weeks later. Always ensure the soil is moist before application to prevent root burn.',
    'weather': 'The 2026 outlook suggests slightly erratic rainfall. I recommend "Climate-Smart" practices like mulching to conserve soil moisture and rainwater harvesting for small-scale irrigation.',
    'market': 'Ghana\'s Buffer Stock Fund (GH₵200m) is active to stabilize prices. Horticulture exports are projected to grow 12% this year. Check the Marketplace frequently for the latest farmgate trends.',

    // Engineer specific
    'maintenance': 'Standard maintenance interval: Engine oil every 250 hours, fuel filters every 500 hours. Don\'t forget to grease all pivot points and check hydraulic fluid levels weekly.',
    'af101': 'Error AF101 (John Deere) indicates Low Fuel Pressure. Check for a clogged primary fuel filter or a failing transfer pump before inspecting the injection system.',
    'af103': 'Error AF103 indicates an EGR (Exhaust Gas Recirculation) System Fault. Inspect the EGR valve for carbon buildup or check the position sensor wiring.',
    'e-04': 'Error E-04 on Power Tillers usually signifies a restricted air intake. Clean the air filter housing and check the intake manifold for blockages.',
    'fleet': 'Your fleet efficiency is currently at 82%. To reach 90%, ensure all tractors are running at optimal tire pressures (check the manual for load-specific PSI) and minimize idling over 10 minutes.',
    'diagnostic': 'Use the SAE J1939 standard to interpret SPN-FMI codes. For example, SPN 100 FMI 1 means engine oil pressure is below the critical warning limit.',

    defaultBase: 'That\'s a great point! As your AI assistant, I can help with ',
    defaultFarmer: 'crop selection (Maize, Cocoa, Rice), pest management (IPM), and fertilizer schedules.',
    defaultEngineer: 'machinery diagnostics (AF101, E-04 codes), maintenance intervals, and fleet health tracking.',
    defaultEnd: ' What\'s on your mind specifically?'
}

function getBotResponse(text, role, userName = 'there') {
    const lower = text.toLowerCase().trim()
    const firstName = userName.split(' ')[0]
    
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

    // Greetings
    if (['hey', 'hi', 'hello', 'yo', 'sup', 'what\'s up', 'morning', 'afternoon', 'evening'].some(g => lower.startsWith(g) || lower === g)) {
        return getRandom(botResponses.greetings(firstName))
    }

    // Casual chat
    if (['how are you', 'how\'s it going', 'how are things', 'how you doing'].some(c => lower.includes(c))) {
        return getRandom(botResponses.casual)
    }
    
    // Check specific codes
    if (lower.includes('af101')) return botResponses['af101']
    if (lower.includes('af103')) return botResponses['af103']
    if (lower.includes('e-04')) return botResponses['e-04']
    
    // Match based on keywords
    if (lower.includes('maize')) return botResponses['maize']
    if (lower.includes('cocoa')) return botResponses['cocoa']
    if (lower.includes('rice')) return botResponses['rice']
    if (lower.includes('cassava')) return botResponses['cassava']
    if (lower.includes('crop') || lower.includes('plant')) return role === 'engineer' ? botResponses['fleet'] : botResponses['maize']
    if (lower.includes('pest') || lower.includes('armyworm') || lower.includes('disease')) return botResponses['pest control']
    if (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('soil')) return botResponses['fertilizer']
    if (lower.includes('weather') || lower.includes('rain')) return botResponses['weather']
    if (lower.includes('market') || lower.includes('price')) return botResponses['market']
    if (lower.includes('maintenance') || lower.includes('service') || lower.includes('oil')) return botResponses['maintenance']
    if (lower.includes('diagnostic') || lower.includes('code') || lower.includes('error')) return botResponses['diagnostic']
    if (lower.includes('fleet') || lower.includes('optimization') || lower.includes('improve')) return botResponses['fleet']
    
    // Role-based defaults
    return botResponses.defaultBase + (role === 'engineer' ? botResponses.defaultEngineer : botResponses.defaultFarmer) + botResponses.defaultEnd
}

export default function AgrobotPage({ userRole = 'farmer', currentUser }) {
    const userName = currentUser?.name || 'Farmer'
    const isEngineer = userRole === 'engineer'
    const suggestions = isEngineer ? engineerSuggestions : farmerSuggestions
    
    // Initialize the chat to the correct starting snippet so it greets them appropriately the first time they open it
    const [messages, setMessages] = useState(isEngineer ? initialEngineerMessages : initialFarmerMessages)
    
    const [input, setInput] = useState('')
    const [isTyping, updateIsTyping] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const sendMessage = useCallback((text) => {
        const trimmed = text.trim()
        if (!trimmed) return

        const userMsg = { id: Date.now(), role: 'user', text: trimmed }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        updateIsTyping(true)

        setTimeout(() => {
            updateIsTyping(false)
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: getBotResponse(trimmed, userRole, userName),
            }])
        }, 1500)
    }, [userRole, userName])

    return (
        <div className="agrobot-page">
            <header className="agrobot-header">
                <div className="agrobot-header__left">
                    <div className="agrobot-header__icon">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h2 className="agrobot-header__title">Agrobot</h2>
                        <p className="agrobot-header__subtitle">Always awake. Always learning.</p>
                    </div>
                </div>
                <div className="agrobot-header__actions">
                    <button
                        className="agrobot-clear-btn"
                        onClick={() => setMessages([])}
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
                        <div className="agrobot-msg__bubble">{msg.text}</div>
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
                    disabled={!input.trim()}
                    aria-label="Send"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}
