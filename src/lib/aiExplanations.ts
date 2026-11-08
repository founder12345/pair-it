import type { Dish, Beverage } from '../data/types'

export interface ExplanationRequest {
  dish: Dish
  beverage: Beverage
  category: 'classic' | 'alternative' | 'unexpected'
}

export interface ExplanationResult {
  text: string
  source: 'curated' | 'rule-based' | 'ai'
  confidenceNote?: string
}

export function generateRuleBasedExplanation(req: ExplanationRequest): ExplanationResult {
  const { dish, beverage, category } = req
  const parts: string[] = []
  if (dish.richness >= 7 && beverage.acidity >= 6) {
    parts.push(`The ${beverage.name}'s acidity cuts through the richness of ${dish.name}.`)
  }
  if (beverage.tannin >= 6 && dish.richness >= 6) {
    parts.push(`Firm tannins interact constructively with the protein and fat.`)
  }
  if (parts.length === 0) {
    parts.push(`Intensity, body and flavor profile suggest a coherent match between ${dish.name} and ${beverage.name}.`)
  }
  if (category === 'unexpected') {
    parts.push(`This combination sits outside the most traditional pairings yet finds support in flavor chemistry.`)
  }
  return {
    text: parts.join(' '),
    source: 'rule-based',
    confidenceNote: 'Generated estimate based on structural matching — not a verified expert rating.',
  }
}

export async function generateAIExplanation(req: ExplanationRequest): Promise<ExplanationResult> {
  const proxy = import.meta.env.VITE_AI_PROXY_URL as string | undefined
  if (!proxy) return generateRuleBasedExplanation(req)
  try {
    const res = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dish: { name: req.dish.name, ingredients: req.dish.ingredients, cuisine: req.dish.cuisine, cookingMethod: req.dish.cookingMethod, richness: req.dish.richness, intensity: req.dish.intensity },
        beverage: { name: req.beverage.name, category: req.beverage.category, region: req.beverage.region, grapeVariety: req.beverage.grapeVariety, acidity: req.beverage.acidity, tannin: req.beverage.tannin, body: req.beverage.body, aromaProfile: req.beverage.aromaProfile },
        category: req.category,
      }),
    })
    if (!res.ok) throw new Error(`AI proxy ${res.status}`)
    const data = await res.json()
    if (typeof data.explanation === 'string' && data.explanation.length > 20) {
      return { text: data.explanation, source: 'ai', confidenceNote: 'AI-generated culinary explanation.' }
    }
  } catch { /* fallback */ }
  return generateRuleBasedExplanation(req)
}
