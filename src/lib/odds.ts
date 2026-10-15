import type { Building, Factor, Kind, Place, Price } from '../data/types'

export type Weights = Record<Factor, number>

export interface Settings {
  /** Relative importance of each factor, 0–100. Only the ratio matters. */
  weights: Weights
  /** Exponent applied to the composite score. 0 = every place equally likely. */
  favoritism: number
  kinds: Kind[]
  /** Empty means every building. */
  buildings: Building[]
  maxPrice: Price
  includeAnnounced: boolean
  /** Blend Tripadvisor/Yelp/Klook star ratings into the reviews score where available. */
  useExternalReviews: boolean
  /** Let social media posts move the taste and aesthetic scores. */
  useSocial: boolean
  /** Places the user vetoed; they never land. */
  vetoed: string[]
}

export interface Entry {
  place: Place
  /** Weighted score, 0–10. */
  composite: number
  /** Unnormalized pick weight. */
  weight: number
  /** Chance of landing, 0–1. Sums to 1 across entries. */
  probability: number
}

export const FACTORS: Factor[] = ['taste', 'aesthetic', 'reviews', 'notoriety']

export const DEFAULT_SETTINGS: Settings = {
  weights: { taste: 40, aesthetic: 35, reviews: 15, notoriety: 10 },
  favoritism: 3,
  kinds: ['restaurant', 'buffet', 'fastfood', 'cafe'],
  buildings: [],
  maxPrice: 4,
  includeAnnounced: false,
  useExternalReviews: true,
  useSocial: true,
  vetoed: [],
}

/** Places are never scored below this, so even a 0 keeps a sliver of a chance. */
const SCORE_FLOOR = 0.5

export function compositeScore(place: Place, weights: Weights): number {
  const total = FACTORS.reduce((sum, f) => sum + Math.max(0, weights[f]), 0)
  if (total === 0) return 5
  const sum = FACTORS.reduce((acc, f) => acc + Math.max(0, weights[f]) * place.scores[f], 0)
  return sum / total
}

export function pickWeight(composite: number, favoritism: number): number {
  return Math.pow(Math.max(composite, SCORE_FLOOR) / 10, Math.max(0, favoritism))
}

export function isEligible(place: Place, settings: Settings): boolean {
  if (settings.vetoed.includes(place.id)) return false
  if (!settings.kinds.includes(place.kind)) return false
  if (place.price > settings.maxPrice) return false
  if (place.status === 'announced' && !settings.includeAnnounced) return false
  if (settings.buildings.length > 0 && !place.locations.some((l) => settings.buildings.includes(l.building))) {
    return false
  }
  return true
}

/** Eligible places with their odds, highest chance first. */
export function computeOdds(places: Place[], settings: Settings): Entry[] {
  const scored = places
    .filter((p) => isEligible(p, settings))
    .map((place) => {
      const composite = compositeScore(place, settings.weights)
      return { place, composite, weight: pickWeight(composite, settings.favoritism), probability: 0 }
    })
  const total = scored.reduce((sum, e) => sum + e.weight, 0)
  for (const e of scored) e.probability = total > 0 ? e.weight / total : 0
  return scored.sort((a, b) => b.probability - a.probability || a.place.name.localeCompare(b.place.name))
}

/** Index of the chosen entry. `rand` must return a number in [0, 1). */
export function weightedPick(entries: Pick<Entry, 'weight'>[], rand: () => number = secureRandom): number {
  if (entries.length === 0) throw new Error('Nothing to pick from')
  const total = entries.reduce((sum, e) => sum + e.weight, 0)
  let target = rand() * total
  for (let i = 0; i < entries.length; i++) {
    target -= entries[i].weight
    if (target < 0) return i
  }
  return entries.length - 1
}

export function secureRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0] / 2 ** 32
  }
  return Math.random()
}

/** How many times likelier the top entry is than the bottom one (entries must be sorted). */
export function spread(entries: Entry[]): number {
  if (entries.length < 2) return 1
  return entries[0].probability / entries[entries.length - 1].probability
}

/** Share of the total odds held by the `n` likeliest entries (entries must be sorted). */
export function topShare(entries: Entry[], n: number): number {
  return entries.slice(0, n).reduce((sum, e) => sum + e.probability, 0)
}
