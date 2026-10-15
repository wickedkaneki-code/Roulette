import type { SourceId } from './sources'

export type Kind = 'restaurant' | 'buffet' | 'fastfood' | 'cafe' | 'dessert' | 'drinks' | 'kiosk'

/** open = in SM's directory or confirmed operating; new = opened 2025–2026; announced = "soon to open", not yet confirmed. */
export type Status = 'open' | 'new' | 'announced'

export type Building =
  | 'City Center'
  | 'The Block'
  | 'The Annex'
  | 'Sky Garden'
  | 'North Towers'
  | 'Terminal'
  | 'Interior Zone'
  | 'TBA'

export type Price = 1 | 2 | 3 | 4

/** Each factor is 0–10. */
export interface Scores {
  /** Diner sentiment: Google/Tripadvisor/Yelp ratings and review buzz. */
  reviews: number
  /** Interior, ambience and photo-worthiness. */
  aesthetic: number
  /** Brand fame, awards (e.g. Michelin), hype and "first in PH" status. */
  notoriety: number
}

export type Factor = keyof Scores

export interface Location {
  building: Building
  floor: string
}

export interface Place {
  id: string
  name: string
  kind: Kind
  cuisine: string
  locations: Location[]
  price: Price
  scores: Scores
  blurb: string
  tags: string[]
  status: Status
  sources: SourceId[]
}

export const KIND_LABELS: Record<Kind, string> = {
  restaurant: 'Restaurants',
  buffet: 'Buffets & unlimited',
  fastfood: 'Fast food & food court',
  cafe: 'Cafés & coffee',
  dessert: 'Desserts & bakeries',
  drinks: 'Milk tea & drinks',
  kiosk: 'Snack kiosks',
}

export const KIND_EMOJI: Record<Kind, string> = {
  restaurant: '🍽️',
  buffet: '🍱',
  fastfood: '🍔',
  cafe: '☕',
  dessert: '🍰',
  drinks: '🧋',
  kiosk: '🥨',
}

export const FACTOR_LABELS: Record<Factor, string> = {
  reviews: 'Reviews',
  aesthetic: 'Aesthetic',
  notoriety: 'Notoriety',
}

export const PRICE_LABELS: Record<Price, string> = {
  1: '₱ · under ₱250',
  2: '₱₱ · ₱250–500',
  3: '₱₱₱ · ₱500–900',
  4: '₱₱₱₱ · ₱900+',
}
