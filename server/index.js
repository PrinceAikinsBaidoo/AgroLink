import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const VENICE_API_KEY = process.env.VENICE_API_KEY
const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions'

const SYSTEM_PROMPTS = {
  farmer: `You are Agrobot, an AI farming assistant for AgroLink — a Ghanaian agricultural marketplace. You help farmers with:
- Crop selection and planting advice (Maize, Cocoa, Rice, Cassava, Yam, etc.)
- Pest and disease management (Fall Armyworm, Black Pod, etc.)
- Fertilizer schedules and soil health
- Weather-smart farming practices
- Market trends and pricing in Ghana
- Answering questions about their products, orders, and shop data

Keep responses concise, practical, and tailored to Ghanaian agriculture. Use local crop names and regions when relevant. Be friendly and conversational.`,

  engineer: `You are Agrobot, an AI assistant for farm engineers on AgroLink — a Ghanaian agricultural marketplace. You help engineers with:
- Machinery diagnostics and error codes (SAE J1939, SPN-FMI)
- Maintenance schedules for tractors, tillers, sprayers, and irrigation systems
- Fleet optimization and efficiency tracking
- Parts identification and troubleshooting
- Equipment repair guides
- Answering questions about their registered machines and fleet data

Keep responses concise and technical but accessible. Be friendly and conversational.`,

  buyer: `You are Agrobot, an AI shopping assistant for AgroLink — a Ghanaian agricultural marketplace. You help buyers with:
- Finding products and comparing prices
- Order tracking and status updates
- Product recommendations based on their purchase history
- Information about farms and sellers
- General advice on agricultural product quality

Keep responses concise and helpful. Be friendly and conversational.`
}

function buildContextBlock(context) {
  if (!context) return ''

  const parts = []

  if (context.user) {
    parts.push(`**Current User:** ${context.user.name} (${context.user.email}), Role: ${context.user.role}`)
  }

  if (context.products?.length > 0) {
    const productList = context.products.map(p =>
      `- ${p.name} | ${p.category} | GH₵${p.price}/${p.unit} | Stock: ${p.stock} | Rating: ${p.rating}/5 (${p.reviews} reviews)`
    ).join('\n')
    parts.push(`**Their Products (${context.products.length}):**\n${productList}`)
  }

  if (context.orders?.length > 0) {
    const orderList = context.orders.slice(0, 20).map(o =>
      `- Order #${o.id}: ${o.productName || 'Product'} | ${o.qty || 1}x | GH₵${o.amount} | Status: ${o.status} | Date: ${o.date}${o.buyerName ? ` | Buyer: ${o.buyerName}` : ''}${o.farm ? ` | Farm: ${o.farm}` : ''}`
    ).join('\n')
    parts.push(`**Their Orders (${context.orders.length}):**\n${orderList}`)
  }

  if (context.machines?.length > 0) {
    const machineList = context.machines.map(m =>
      `- ${m.name} | Type: ${m.type} | Status: ${m.status} | Health: ${m.health}% | Hours: ${m.hrs}h | Last Service: ${m.lastService}`
    ).join('\n')
    parts.push(`**Their Machines (${context.machines.length}):**\n${machineList}`)
  }

  if (parts.length === 0) return ''

  return `\n\n---\nHere is the user's real AgroLink data. Use this to answer questions about their listings, orders, machines, etc. Reference specific names, prices, and statuses when relevant:\n\n${parts.join('\n\n')}`
}

app.post('/api/chat', async (req, res) => {
  const { messages, role, context } = req.body

  if (!VENICE_API_KEY) {
    return res.status(500).json({ error: 'VENICE_API_KEY not configured' })
  }

  const basePrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.farmer
  const contextBlock = buildContextBlock(context)
  const systemPrompt = basePrompt + contextBlock

  const veniceMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'bot' ? 'assistant' : m.role,
      content: m.text
    }))
  ]

  try {
    const response = await fetch(VENICE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'default',
        messages: veniceMessages,
        venice_parameters: {
          include_venice_system_prompt: false
        }
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Venice API error:', response.status, err)
      return res.status(response.status).json({ error: 'Venice API request failed' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    res.json({ reply })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Agrobot server running on http://localhost:${PORT}`)
})
