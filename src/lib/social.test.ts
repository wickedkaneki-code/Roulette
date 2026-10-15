import { describe, expect, it } from 'vitest'
import { PLACES } from '../data/places'
import { SOCIAL, type SocialPost } from '../data/social'
import { MAX_SHIFT, postPoints, recencyFactor, socialBreakdown, socialShift, withSocialSignals } from './social'

const post = (over: Partial<SocialPost> = {}): SocialPost => ({
  platform: 'tiktok',
  url: 'https://www.tiktok.com/@x/video/1',
  by: 'creator',
  year: 2026,
  note: '',
  ...over,
})

const URL_PATTERN = {
  tiktok: /^https:\/\/www\.tiktok\.com\//,
  youtube: /^https:\/\/www\.youtube\.com\/watch\?v=/,
  instagram: /^https:\/\/www\.instagram\.com\//,
  facebook: /^https:\/\/www\.facebook\.com\//,
}

describe('postPoints', () => {
  it('ranks tones from rave to negative', () => {
    const pts = (taste: SocialPost['taste']) => postPoints(post({ taste }), 'taste')
    expect(pts('rave')).toBeGreaterThan(pts('positive'))
    expect(pts('positive')).toBeGreaterThan(pts('mixed'))
    expect(pts('mixed')).toBe(0)
    expect(pts('negative')).toBeLessThan(0)
  })

  it('only counts the aspect a post speaks to', () => {
    expect(postPoints(post({ taste: 'rave' }), 'looks')).toBe(0)
  })

  it('counts brand and mall posts less than creators', () => {
    const creator = postPoints(post({ taste: 'rave' }), 'taste')
    const mall = postPoints(post({ taste: 'rave', by: 'mall' }), 'taste')
    const brand = postPoints(post({ taste: 'rave', by: 'brand' }), 'taste')
    expect(creator).toBeGreaterThan(mall)
    expect(mall).toBeGreaterThan(brand)
  })

  it('counts older posts less', () => {
    expect(recencyFactor(2026)).toBeGreaterThan(recencyFactor(2023))
    expect(recencyFactor(2023)).toBeGreaterThan(recencyFactor(2019))
  })
})

describe('socialShift', () => {
  it('is zero without posts and never exceeds MAX_SHIFT', () => {
    expect(socialShift([], 'taste')).toBe(0)
    const many = Array.from({ length: 50 }, () => post({ taste: 'rave' }))
    expect(socialShift(many, 'taste')).toBeLessThanOrEqual(MAX_SHIFT)
    expect(socialShift(many, 'taste')).toBeGreaterThan(MAX_SHIFT * 0.99)
    const bad = Array.from({ length: 50 }, () => post({ taste: 'negative' }))
    expect(socialShift(bad, 'taste')).toBeGreaterThanOrEqual(-MAX_SHIFT)
  })

  it('grows with each additional positive post', () => {
    const one = socialShift([post({ looks: 'positive' })], 'looks')
    const two = socialShift([post({ looks: 'positive' }), post({ looks: 'positive' })], 'looks')
    expect(two).toBeGreaterThan(one)
  })
})

describe('social data', () => {
  const ids = new Set(PLACES.map((p) => p.id))

  it('only references places that exist', () => {
    for (const id of Object.keys(SOCIAL)) expect(ids.has(id), id).toBe(true)
  })

  it('links each post to its platform and rates at least one aspect', () => {
    for (const [id, posts] of Object.entries(SOCIAL)) {
      expect(posts.length, id).toBeGreaterThan(0)
      for (const p of posts) {
        expect(p.url, id).toMatch(URL_PATTERN[p.platform])
        expect(p.taste || p.looks, id).toBeTruthy()
        expect(p.note.length, id).toBeGreaterThan(0)
      }
    }
  })

  it('moves only taste and aesthetic, within 0–10', () => {
    const adjusted = withSocialSignals(PLACES)
    for (let i = 0; i < PLACES.length; i++) {
      const before = PLACES[i]
      const after = adjusted[i]
      expect(after.scores.reviews).toBe(before.scores.reviews)
      expect(after.scores.notoriety).toBe(before.scores.notoriety)
      if (!SOCIAL[before.id]) expect(after).toBe(before)
      for (const v of Object.values(after.scores)) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(10)
      }
      expect(Math.abs(after.scores.taste - before.scores.taste)).toBeLessThanOrEqual(MAX_SHIFT + 0.05)
    }
  })

  it('reports the estimate alongside the adjusted score', () => {
    const magure = PLACES.find((p) => p.id === 'magure-izakaya')!
    const b = socialBreakdown(magure)
    expect(b.aesthetic.estimate).toBe(magure.scores.aesthetic)
    expect(b.aesthetic.adjusted).toBeGreaterThan(b.aesthetic.estimate)
  })
})
