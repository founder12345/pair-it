module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.x.ai/v1'
  const AI_API_KEY = process.env.AI_API_KEY || process.env.XAI_API_KEY
  const AI_MODEL = process.env.AI_MODEL || 'grok-4.3'

  if (!AI_API_KEY) {
    return res.status(503).json({ error: 'AI_API_KEY not configured', fallback: true })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}') } catch { body = {} }
  }
  body = body || {}

  const dish = body.dish || {}
  const beverage = body.beverage || {}
  const category = body.category || 'alternative'

  if (!dish.name || !beverage.name) {
    return res.status(400).json({ error: 'Missing dish.name or beverage.name' })
  }

  const system = 'You are a precise culinary writer for PAIR IT. Write 2-4 sentences explaining why the beverage works with the dish. Focus on acidity, tannin, body, aroma. Never invent ratings or prices. Calm editorial tone.'
  const user = [
    'Dish: ' + dish.name,
    'Cuisine: ' + (dish.cuisine || 'unspecified'),
    'Ingredients: ' + ((dish.ingredients || []).join(', ') || 'n/a'),
    'Beverage: ' + beverage.name,
    'Category: ' + (beverage.category || ''),
    'Region: ' + (beverage.region || 'n/a'),
    'Pairing category: ' + category,
    '',
    'Write the explanation now.'
  ].join('\n')

  try {
    const upstream = await fetch(AI_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + AI_API_KEY,
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
      return res.status(502).json({ error: 'Upstream AI failed', status: upstream.status, fallback: true })
    }

    const data = await upstream.json()
    const explanation = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content.trim()
      : null

    if (!explanation) {
      return res.status(502).json({ error: 'Empty AI response', fallback: true })
    }

    return res.status(200).json({ explanation: explanation, model: AI_MODEL, source: 'ai' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Proxy error', fallback: true })
  }
}
