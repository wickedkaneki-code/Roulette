import { describe, expect, it } from 'vitest'
import { PLACES } from '../data/places'
import { EXTERNAL_RATINGS, type ExternalRating } from '../data/reviews'
import { blendReviews, PRIOR_WEIGHT, reviewBreakdown, starsToScore, withExternalReviews } from './reviews'

const yelp = (stars: number, count: number, match: 'exact' | 'likely' = 'exact'): ExternalRating => ({
  site: 'yelp',
  stars,
  count,
  url: 'https://www.yelp.com/biz/x',
  match,
})

describe('starsToScore', () => {
  it('maps each site’s typical rating to 6 and clamps to 0–10', () => {
    expect(starsToScore('yelp', 3.8)).toBeCloseTo(6)
    expect(starsToScore('klook', 4.6)).toBeCloseTo(6)
    expect(starsToScore('yelp', 4.3)).toBeCloseTo(8)
    expect(starsToScore('yelp', 1)).toBe(0)
    expect(starsToScore('yelp', 5)).toBe(10)
  })

  it('reads a Klook star as worth less than a Yelp star', () => {
    expect(starsToScore('klook', 4.5)).toBeLessThan(starsToScore('yelp', 4.5))
  })
})

describe('blendReviews', () => {
  it('keeps the estimate when there are no ratings', () => {
    expect(blendReviews(7, [])).toBe(7)
  })

  it('treats the estimate as PRIOR_WEIGHT reviews', () => {
    // PRIOR_WEIGHT reviews at a score of 2 should land halfway between 8 and 2.
    const stars = 3.8 + (2 - 6) / 4
    expect(blendReviews(8, [yelp(stars, PRIOR_WEIGHT)])).toBeCloseTo(5)
  })

  it('moves further with more reviews', () => {
    const few = blendReviews(8, [yelp(2.8, 2)])
    const many = blendReviews(8, [yelp(2.8, 40)])
    expect(few).toBeGreaterThan(many)
    expect(few).toBeLessThan(8)
  })

  it('counts a likely match at half weight', () => {
    expect(blendReviews(8, [yelp(2.8, 10, 'likely')])).toBeCloseTo(blendReviews(8, [yelp(2.8, 5)]))
  })
})

describe('external ratings data', () => {
  const ids = new Set(PLACES.map((p) => p.id))

  it('only references places that exist', () => {
    for (const id of Object.keys(EXTERNAL_RATINGS)) expect(ids.has(id), id).toBe(true)
  })

  it('has sane ratings and links', () => {
    for (const [id, list] of Object.entries(EXTERNAL_RATINGS)) {
      expect(list.length, id).toBeGreaterThan(0)
      for (const r of list) {
        expect(r.stars, id).toBeGreaterThanOrEqual(1)
        expect(r.stars, id).toBeLessThanOrEqual(5)
        expect(r.count, id).toBeGreaterThanOrEqual(1)
        expect(r.url, id).toMatch(r.site === 'yelp' ? /^https:\/\/(www\.)?yelp\.com\// : /^https:\/\/www\.klook\.com\//)
      }
    }
  })

  it('replaces only the reviews score of places with ratings', () => {
    const blended = withExternalReviews(PLACES)
    for (let i = 0; i < PLACES.length; i++) {
      const before = PLACES[i]
      const after = blended[i]
      expect(after.scores.aesthetic).toBe(before.scores.aesthetic)
      expect(after.scores.notoriety).toBe(before.scores.notoriety)
      if (!EXTERNAL_RATINGS[before.id]) expect(after).toBe(before)
      else expect(after.scores.reviews).toBe(reviewBreakdown(before).blended)
    }
  })
})
