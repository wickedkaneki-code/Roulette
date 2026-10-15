import { SOCIAL, type Poster, type SocialPost, type Tone } from '../data/social'
import type { Place } from '../data/types'

/*
 * Turning social posts into taste and aesthetic scores.
 *
 * Each post that rates the food (or the room) adds points by tone, scaled by
 * who posted it and how recent it is. The sum moves the place's estimate,
 * with diminishing returns so a pile of posts can shift it by at most
 * MAX_SHIFT in either direction:
 *
 *   shift = MAX_SHIFT × tanh(points / MAX_SHIFT)
 */

export type Aspect = 'taste' | 'looks'

export const TONE_POINTS: Record<Tone, number> = { rave: 1, positive: 0.6, mixed: 0, negative: -1 }
export const POSTER_FACTOR: Record<Poster, number> = { creator: 1, mall: 0.5, brand: 0.3 }
export const MAX_SHIFT = 2

export function recencyFactor(year?: number): number {
  if (year === undefined) return 0.7
  if (year >= 2025) return 1
  if (year >= 2023) return 0.7
  return 0.5
}

export function postPoints(post: SocialPost, aspect: Aspect): number {
  const tone = post[aspect]
  if (!tone) return 0
  return TONE_POINTS[tone] * POSTER_FACTOR[post.by] * recencyFactor(post.year)
}

export function socialShift(posts: SocialPost[], aspect: Aspect): number {
  const points = posts.reduce((sum, p) => sum + postPoints(p, aspect), 0)
  return MAX_SHIFT * Math.tanh(points / MAX_SHIFT)
}

const round = (n: number) => Math.round(Math.min(10, Math.max(0, n)) * 10) / 10

export interface SocialBreakdown {
  posts: SocialPost[]
  taste: { estimate: number; adjusted: number }
  aesthetic: { estimate: number; adjusted: number }
}

export function socialBreakdown(place: Place, table = SOCIAL): SocialBreakdown {
  const posts = table[place.id] ?? []
  return {
    posts,
    taste: { estimate: place.scores.taste, adjusted: round(place.scores.taste + socialShift(posts, 'taste')) },
    aesthetic: { estimate: place.scores.aesthetic, adjusted: round(place.scores.aesthetic + socialShift(posts, 'looks')) },
  }
}

/** Places with taste and aesthetic moved by social posts, where any exist. */
export function withSocialSignals(places: Place[], table = SOCIAL): Place[] {
  return places.map((p) => {
    if (!table[p.id]?.length) return p
    const b = socialBreakdown(p, table)
    return { ...p, scores: { ...p.scores, taste: b.taste.adjusted, aesthetic: b.aesthetic.adjusted } }
  })
}

export const PLATFORM_LABELS = { tiktok: 'TikTok', youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook' } as const
