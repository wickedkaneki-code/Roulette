import { describe, expect, it } from 'vitest'
import type { Place } from '../data/types'
import { compositeScore, computeOdds, DEFAULT_SETTINGS, pickWeight, topShare, weightedPick, type Settings } from './odds'

function place(id: string, reviews: number, aesthetic: number, notoriety: number, extra: Partial<Place> = {}, taste = reviews): Place {
  return {
    id,
    name: id,
    kind: 'restaurant',
    cuisine: 'Test',
    locations: [{ building: 'City Center', floor: '2nd floor' }],
    price: 2,
    scores: { taste, reviews, aesthetic, notoriety },
    blurb: '',
    tags: [],
    status: 'open',
    sources: ['smdir'],
    ...extra,
  }
}

const settings = (over: Partial<Settings> = {}): Settings => ({ ...DEFAULT_SETTINGS, ...over })

describe('compositeScore', () => {
  it('is the weighted average of the three factors', () => {
    const p = place('a', 10, 0, 4, {}, 6)
    expect(compositeScore(p, { taste: 20, reviews: 40, aesthetic: 20, notoriety: 20 })).toBeCloseTo(
      (6 * 20 + 10 * 40 + 0 + 4 * 20) / 100,
    )
  })

  it('uses only the ratio between weights', () => {
    const p = place('a', 8, 2, 6)
    expect(compositeScore(p, { taste: 1, reviews: 2, aesthetic: 1, notoriety: 1 })).toBeCloseTo(
      compositeScore(p, { taste: 40, reviews: 80, aesthetic: 40, notoriety: 40 }),
    )
  })

  it('treats all-zero weights as neutral', () => {
    expect(compositeScore(place('a', 10, 10, 10), { taste: 0, reviews: 0, aesthetic: 0, notoriety: 0 })).toBe(5)
  })
})

describe('default emphasis', () => {
  it('weights taste and aesthetic above reviews and notoriety', () => {
    const w = DEFAULT_SETTINGS.weights
    expect(Math.min(w.taste, w.aesthetic)).toBeGreaterThan(Math.max(w.reviews, w.notoriety))
  })
})

describe('pickWeight', () => {
  it('gives everyone the same weight at zero favoritism', () => {
    expect(pickWeight(9, 0)).toBe(pickWeight(1, 0))
  })

  it('favors higher scores more as favoritism rises', () => {
    const ratioLow = pickWeight(9, 1) / pickWeight(3, 1)
    const ratioHigh = pickWeight(9, 4) / pickWeight(3, 4)
    expect(ratioLow).toBeCloseTo(3)
    expect(ratioHigh).toBeGreaterThan(ratioLow)
  })

  it('never reaches zero', () => {
    expect(pickWeight(0, 5)).toBeGreaterThan(0)
  })
})

describe('computeOdds', () => {
  const places = [
    place('great', 10, 10, 10),
    place('okay', 5, 5, 5),
    place('kiosk', 9, 9, 9, { kind: 'kiosk' }),
    place('pricey', 9, 9, 9, { price: 4 }),
    place('soon', 9, 9, 9, { status: 'announced' }),
    place('annex', 9, 9, 9, { locations: [{ building: 'The Annex', floor: '2nd floor' }] }),
  ]

  it('probabilities sum to 1 and are sorted high to low', () => {
    const odds = computeOdds(places, settings())
    expect(odds.reduce((s, e) => s + e.probability, 0)).toBeCloseTo(1)
    for (let i = 1; i < odds.length; i++) expect(odds[i - 1].probability).toBeGreaterThanOrEqual(odds[i].probability)
  })

  it('applies kind, price, status, building and veto filters', () => {
    const ids = (s: Settings) => computeOdds(places, s).map((e) => e.place.id).sort()
    expect(ids(settings())).toEqual(['annex', 'great', 'okay', 'pricey'])
    expect(ids(settings({ maxPrice: 3 }))).toEqual(['annex', 'great', 'okay'])
    expect(ids(settings({ includeAnnounced: true }))).toContain('soon')
    expect(ids(settings({ kinds: ['kiosk'] }))).toEqual(['kiosk'])
    expect(ids(settings({ buildings: ['The Annex'] }))).toEqual(['annex'])
    expect(ids(settings({ vetoed: ['great'] }))).not.toContain('great')
  })

  it('is uniform at zero favoritism', () => {
    const odds = computeOdds(places, settings({ favoritism: 0 }))
    for (const e of odds) expect(e.probability).toBeCloseTo(1 / odds.length)
  })

  it('reports the share held by the top entries', () => {
    const odds = computeOdds(places, settings())
    expect(topShare(odds, odds.length)).toBeCloseTo(1)
    expect(topShare(odds, 1)).toBe(odds[0].probability)
  })
})

describe('weightedPick', () => {
  it('maps the random number onto cumulative weights', () => {
    const entries = [{ weight: 1 }, { weight: 3 }]
    expect(weightedPick(entries, () => 0)).toBe(0)
    expect(weightedPick(entries, () => 0.24)).toBe(0)
    expect(weightedPick(entries, () => 0.26)).toBe(1)
    expect(weightedPick(entries, () => 0.9999)).toBe(1)
  })

  it('matches the expected distribution', () => {
    const entries = [{ weight: 1 }, { weight: 2 }, { weight: 7 }]
    const counts = [0, 0, 0]
    let seed = 42
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 2 ** 32
      return seed / 2 ** 32
    }
    for (let i = 0; i < 20000; i++) counts[weightedPick(entries, rand)]++
    expect(counts[0] / 20000).toBeCloseTo(0.1, 1)
    expect(counts[1] / 20000).toBeCloseTo(0.2, 1)
    expect(counts[2] / 20000).toBeCloseTo(0.7, 1)
  })

  it('refuses an empty list', () => {
    expect(() => weightedPick([])).toThrow()
  })
})
