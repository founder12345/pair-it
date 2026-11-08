export type BeverageCategory =
  | 'Wine'
  | 'Beer'
  | 'Spirit'
  | 'Cocktail'
  | 'Champagne'
  | 'Other'

export type FlavorDimension =
  | 'fruity'
  | 'earthy'
  | 'floral'
  | 'spicy'
  | 'rich'
  | 'acidic'

export interface FlavorProfile {
  fruity: number
  earthy: number
  floral: number
  spicy: number
  rich: number
  acidic: number
}

export interface Dish {
  id: string
  name: string
  description: string
  ingredients: string[]
  cuisine: string
  cookingMethod: string
  flavorProfile: FlavorProfile
  intensity: number
  richness: number
  acidity: number
  sweetness: number
  saltiness: number
  image?: string
}

export interface Beverage {
  id: string
  name: string
  category: BeverageCategory
  country: string
  region: string
  grapeVariety?: string
  ingredients?: string[]
  aromaProfile: string[]
  acidity: number
  sweetness: number
  tannin: number
  body: number
  description: string
  verifiedPriceRange?: string
  image?: string
  sources?: string[]
  flavorProfile: FlavorProfile
}

export interface Pairing {
  id: string
  dishId: string
  beverageId: string
  category: 'classic' | 'alternative' | 'unexpected'
  explanation: string
  compatibilityNotes: string[]
  potentialIssues?: string[]
  confidence: number
  source?: string
}

export interface WineRegion {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  description: string
  climate: string
  notableGrapes: string[]
  keyStyles: string[]
  relatedDishes: string[]
}

export interface GrapeVariety {
  id: string
  name: string
  color: 'red' | 'white' | 'rosé'
  origin: string
  description: string
  typicalAcidity: number
  typicalTannin: number
  typicalBody: number
  flavorNotes: string[]
  relatedDishes: string[]
  regions: string[]
}

export interface UserPreferences {
  favoriteCuisines: string[]
  preferredFlavors: Partial<FlavorProfile>
  favoriteRegions: string[]
  avoidedIngredients: string[]
  ageVerified: boolean
}
