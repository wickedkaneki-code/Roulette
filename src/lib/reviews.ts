import { EXTERNAL_RATINGS, type ExternalRating, type ReviewSite } from '../data/reviews'
import type { Place } from '../data/types'

/*
 * Turning star ratings into the 0–10 reviews score.
 *
 * Sites rate on different curves: Klook voucher buyers average around 4.6★,
 * Yelp reviewers around 3.8★. A rating at the site's typical average maps to
 * 6/10 (the same score a 4.0★ Google rating gets), and each star above or
 * below moves it 4 points.
 *
 * The editorial estimate acts as a prior worth PRIOR_WEIGHT reviews, so one
 * stray review nudges a place while dozens of reviews mostly decide it.
 */

export const SITE_BASELINE: Record<ReviewSite, number> = { yelp: 3.8, klook: 4.6 }
export const POINTS_PER_STAR = 4
export const PRIOR_WEIGHT = 15
const LIKELY_MATCH_FACTOR = 0.5

export const SITE_LABELS: Record<ReviewSite, string> = { yelp: 'Yelp', klook: 'Klook' }

export function starsToScore(site: ReviewSite, stars: number): number {
  return Math.min(10, Math.max(0, 6 + (stars - SITE_BASELINE[site]) * POINTS_PER_STAR))
}

export function effectiveCount(r: ExternalRating): number {
  return r.count * (r.match === 'likely' ? LIKELY_MATCH_FACTOR : 1)
}

export interface ReviewBreakdown {
  estimate: number
  blended: number
  ratings: ExternalRating[]
  totalReviews: number
}

export function blendReviews(estimate: number, ratings: ExternalRating[]): number {
  const weight = ratings.reduce((sum, r) => sum + effectiveCount(r), 0)
  const points = ratings.reduce((sum, r) => sum + effectiveCount(r) * starsToScore(r.site, r.stars), 0)
  return (estimate * PRIOR_WEIGHT + points) / (PRIOR_WEIGHT + weight)
}

export function reviewBreakdown(place: Place, table = EXTERNAL_RATINGS): ReviewBreakdown {
  const ratings = table[place.id] ?? []
  return {
    estimate: place.scores.reviews,
    blended: Math.round(blendReviews(place.scores.reviews, ratings) * 10) / 10,
    ratings,
    totalReviews: ratings.reduce((sum, r) => sum + r.count, 0),
  }
}

/** Places with their reviews score replaced by the blend, where ratings exist. */
export function withExternalReviews(places: Place[], table = EXTERNAL_RATINGS): Place[] {
  return places.map((p) =>
    table[p.id]?.length ? { ...p, scores: { ...p.scores, reviews: reviewBreakdown(p, table).blended } } : p,
  )
}
