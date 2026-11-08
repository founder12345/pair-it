const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.x.ai/v1'
const AI_API_KEY = process.env.AI_API_KEY || process.env.XAI_API_KEY
const AI_MODEL = process.env.AI_MODEL || 'grok-4.3'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!AI_API_KEY) {
    return res.status(503).json({ error: 'AI_API_KEY not configured on Vercel', fallback: true })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const { dish, beverage, category } = body

  if (!dish?.name || !beverage?.name) {
    return res.status(400).json({ error: 'Missing dish.name or beverage.name' })
  }

  const system = `You are a precise, elegant culinary writer for PAIR IT. Write one short paragraph (2–4 sentences) explaining why the beverage works with the dish. Focus on acidity, tannin, body, aroma affinity. Never invent ratings or prices. Tone: calm, editorial.`

  const user = `Dish: ${dish.name}\nCuisine: ${dish.cuisine || 'unspecified'}\nIngredients: ${(dish.ingredients || []).join(', ') || 'n/a'}\nBeverage: ${beverage.name}\nCategory: ${beverage.category}\nRegion: ${beverage.region || 'n/a'}\nPairing category: ${category || 'alternative'}\n\nWrite the explanation now.`

  try {
    const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.55,
        max_tokens: 220,
      }),
    })

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream AI request failed', status: upstream.status, fallback: true })
    }

    const data = await upstream.json()
    const explanation = data?.choices?.[0]?.message?.content?.trim()
    if (!explanation) return res.status(502).json({ error: 'Empty response from AI', fallback: true })

    return res.status(200).json({ explanation, model: AI_MODEL, source: 'ai' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Proxy internal error', fallback: true })
  }
}
