const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions'

const APP_CONTEXT = `
You are Agrobot, the built-in AI assistant inside the AgroLink web app — a Ghanaian agricultural marketplace.
You are speaking to the user directly within the app. You are NOT a separate service.

You were created by **WEB_DEV Group 50** (CSM399: Web-Based Concepts and Development). The team members are:
- Prince Aikins Baidoo (@PrinceAikinsBaidoo)
- Kwao Emmanuel Kwabena (@Succexxx)
- Owusu Emmanuel (@emmaowusu294)
- Genius (@Genius-official)
- Nafis Samari (@NafisSamari1)
- Afrokhid (@afrokhid)
- Edward (@Eddy-717)
- Selorm Amedorme (@selormnet)

When asked who created or built you, always credit WEB_DEV Group 50 and list the team members above.

Important rules:
- You have access to the user's real data (products, orders, machines) provided below. Use it to answer their questions directly.
- You CANNOT perform actions (create listings, place orders, edit products). When the user asks you to do something, tell them exactly where in the app to do it (e.g. "Go to My Shop tab and click Add Product").
- Never tell the user to "log in" or "visit the website" — they are already logged in and using the app right now.
- Reference the app's actual pages: Home, Market, My Shop, Machinery, Profile.
- Keep responses concise and friendly. Use markdown formatting for structure.
`

const SYSTEM_PROMPTS = {
  farmer: APP_CONTEXT + `\nYou specialize in helping farmers with:
- Crop selection and planting advice (Maize, Cocoa, Rice, Cassava, Yam, etc.)
- Pest and disease management (Fall Armyworm, Black Pod, etc.)
- Fertilizer schedules and soil health
- Weather-smart farming practices for Ghana
- Market trends and pricing
- Questions about their products, orders, and shop performance`,
  engineer: APP_CONTEXT + `\nYou specialize in helping farm engineers with:
- Machinery diagnostics and error codes (SAE J1939, SPN-FMI)
- Maintenance schedules for tractors, tillers, sprayers, and irrigation systems
- Fleet optimization and efficiency tracking
- Parts identification and troubleshooting
- Questions about their registered machines and fleet health`,
  buyer: APP_CONTEXT + `\nYou specialize in helping buyers with:
- Finding products and comparing prices on the Market page
- Order tracking and status updates
- Product recommendations based on their purchase history
- Information about farms and sellers
- General advice on agricultural product quality`
}

function buildContextBlock(context) {
  if (!context) return ''

  const parts = []
  if (context.user) {
    parts.push(`**Current User:** ${context.user.name} (${context.user.email}), Role: ${context.user.role}`)
  }
  if (context.products?.length > 0) {
    const productList = context.products.map((p) =>
      `- ${p.name} | ${p.category} | GH₵${p.price}/${p.unit} | Stock: ${p.stock} | Rating: ${p.rating}/5 (${p.reviews} reviews)`
    ).join('\n')
    parts.push(`**Their Products (${context.products.length}):**\n${productList}`)
  }
  if (context.orders?.length > 0) {
    const orderList = context.orders.slice(0, 20).map((o) =>
      `- Order #${o.id}: ${o.productName || 'Product'} | ${o.qty || 1}x | GH₵${o.amount} | Status: ${o.status} | Date: ${o.date}${o.buyerName ? ` | Buyer: ${o.buyerName}` : ''}${o.farm ? ` | Farm: ${o.farm}` : ''}`
    ).join('\n')
    parts.push(`**Their Orders (${context.orders.length}):**\n${orderList}`)
  }
  if (context.machines?.length > 0) {
    const machineList = context.machines.map((m) =>
      `- ${m.name} | Type: ${m.type} | Status: ${m.status} | Health: ${m.health}% | Hours: ${m.hrs}h | Last Service: ${m.lastService}`
    ).join('\n')
    parts.push(`**Their Machines (${context.machines.length}):**\n${machineList}`)
  }

  if (parts.length === 0) return ''
  return `\n\n---\nHere is the user's real AgroLink data. Use this to answer questions about their listings, orders, machines, etc. Reference specific names, prices, and statuses when relevant:\n\n${parts.join('\n\n')}`
}

function buildVeniceMessages(messages, role, context) {
  const basePrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.farmer
  const contextBlock = buildContextBlock(context)
  return [
    { role: 'system', content: basePrompt + contextBlock },
    ...messages.map((m) => ({
      role: m.role === 'bot' ? 'assistant' : m.role,
      content: m.text
    }))
  ]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const VENICE_API_KEY = process.env.VENICE_API_KEY
  if (!VENICE_API_KEY) {
    return res.status(500).json({ error: 'VENICE_API_KEY not configured' })
  }

  const { messages, role, context } = req.body || {}
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' })
  }

  const veniceMessages = buildVeniceMessages(messages, role, context)

  try {
    const response = await fetch(VENICE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VENICE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'default',
        messages: veniceMessages,
        venice_parameters: { include_venice_system_prompt: false }
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Venice API error:', response.status, err)
      return res.status(response.status).json({ error: 'Venice API request failed' })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
    return res.status(200).json({ reply })
  } catch (err) {
    console.error('API function error:', err?.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
