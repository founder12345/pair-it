import { dishes } from '../data/dishes'
import { beverages } from '../data/beverages'
import { pairings } from '../data/pairings'
import type { Dish, Beverage, Pairing, FlavorProfile } from '../data/types'

export interface PairingResult {
  beverage: Beverage
  pairing: Pairing | null
  category: 'classic' | 'alternative' | 'unexpected'
  score: number
  explanation: string
  notes: string[]
  potentialIssues: string[]
  isEstimate: boolean
}

function cosineSimilarity(a: FlavorProfile, b: FlavorProfile): number {
  const keys: (keyof FlavorProfile)[] = ['fruity', 'earthy', 'floral', 'spicy', 'rich', 'acidic']
  let dot = 0, magA = 0, magB = 0
  for (const k of keys) {
    dot += a[k] * b[k]
    magA += a[k] * a[k]
    magB += b[k] * b[k]
  }
  if (magA === 0 || magB === 0) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

function ruleBasedScore(dish: Dish, bev: Beverage): number {
  let score = 0
  if (dish.richness >= 7 && bev.acidity >= 7) score += 2.5
  else if (dish.richness >= 6 && bev.acidity >= 6) score += 1.5
  if (dish.richness >= 7 && bev.tannin >= 6) score += 2
  if (dish.flavorProfile.spicy >= 6 && bev.sweetness >= 3) score += 2
  const bodyDiff = Math.abs(dish.intensity - bev.body)
  score += Math.max(0, 3 - bodyDiff * 0.7)
  score += cosineSimilarity(dish.flavorProfile, bev.flavorProfile) * 4
  return Math.min(10, Math.max(0, score))
}

function generateExplanation(dish: Dish, bev: Beverage, category: string): string {
  const parts: string[] = []
  if (dish.richness >= 7 && bev.acidity >= 6) {
    parts.push(`The ${bev.name}'s acidity cuts through the richness of ${dish.name}.`)
  }
  if (bev.tannin >= 6 && dish.richness >= 6) {
    parts.push(`Firm tannins interact favorably with the dish's protein and fat.`)
  }
  if (parts.length === 0) {
    parts.push(`Based on intensity, body and flavor profile matching, ${bev.name} is a coherent companion for ${dish.name}.`)
  }
  if (category === 'unexpected') {
    parts.push(`This is a less traditional combination that still finds support in flavor chemistry.`)
  }
  return parts.join(' ')
}

export function findPairingsForDish(dishNameOrId: string, limit = 6): PairingResult[] {
  let dish = dishes.find(d => d.id === dishNameOrId || d.name.toLowerCase() === dishNameOrId.toLowerCase())
  if (!dish) {
    dish = dishes.find(d => d.name.toLowerCase().includes(dishNameOrId.toLowerCase()))
  }
  if (!dish) {
    dish = {
      id: 'temp',
      name: dishNameOrId,
      description: `User-entered dish: ${dishNameOrId}`,
      ingredients: dishNameOrId.toLowerCase().split(/[\s,]+/).filter(Boolean),
      cuisine: 'Unspecified',
      cookingMethod: 'Unspecified',
      flavorProfile: { fruity: 4, earthy: 5, floral: 3, spicy: 3, rich: 6, acidic: 4 },
      intensity: 6, richness: 6, acidity: 4, sweetness: 2, saltiness: 4,
    }
  }

  const curated = pairings
    .filter(p => p.dishId === dish!.id)
    .map(p => {
      const bev = beverages.find(b => b.id === p.beverageId)!
      return {
        beverage: bev,
        pairing: p,
        category: p.category,
        score: p.confidence * 10,
        explanation: p.explanation,
        notes: p.compatibilityNotes,
        potentialIssues: p.potentialIssues || [],
        isEstimate: false,
      } as PairingResult
    })

  if (curated.length >= 3) return curated.slice(0, limit)

  const scored = beverages.map(bev => ({ bev, score: ruleBasedScore(dish!, bev) }))
    .sort((a, b) => b.score - a.score)

  const results: PairingResult[] = [...curated]
  const used = new Set(curated.map(c => c.beverage.id))
  const categories: Array<'classic' | 'alternative' | 'unexpected'> = ['classic', 'alternative', 'unexpected']
  let catIdx = curated.length

  for (const { bev, score } of scored) {
    if (results.length >= limit) break
    if (used.has(bev.id)) continue
    const category = categories[Math.min(catIdx, 2)] ?? 'alternative'
    catIdx++
    results.push({
      beverage: bev,
      pairing: null,
      category,
      score,
      explanation: generateExplanation(dish!, bev, category),
      notes: ['Estimated compatibility based on acidity, tannin, body and flavor profile.'],
      potentialIssues: score < 5 ? ['Compatibility is moderate; personal preference will matter.'] : [],
      isEstimate: true,
    })
  }
  return results
}

export function searchDishes(query: string): Dish[] {
  if (!query.trim()) return dishes.slice(0, 8)
  const q = query.toLowerCase()
  return dishes.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.cuisine.toLowerCase().includes(q) ||
    d.ingredients.some(i => i.toLowerCase().includes(q))
  ).slice(0, 12)
}
