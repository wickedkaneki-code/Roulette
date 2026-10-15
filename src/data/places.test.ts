import { describe, expect, it } from 'vitest'
import { PLACES } from './places'
import { SOURCES } from './sources'

describe('PLACES dataset', () => {
  it('has unique ids', () => {
    const ids = PLACES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every score within 0–10', () => {
    for (const p of PLACES) {
      for (const v of Object.values(p.scores)) {
        expect(v, p.name).toBeGreaterThanOrEqual(0)
        expect(v, p.name).toBeLessThanOrEqual(10)
      }
    }
  })

  it('cites a known source and a location for every place', () => {
    for (const p of PLACES) {
      expect(p.sources.length, p.name).toBeGreaterThan(0)
      for (const s of p.sources) expect(SOURCES[s], `${p.name}: ${s}`).toBeDefined()
      expect(p.locations.length, p.name).toBeGreaterThan(0)
      expect(p.blurb.length, p.name).toBeGreaterThan(0)
    }
  })

  it('covers the whole mall', () => {
    expect(PLACES.length).toBeGreaterThan(250)
    expect(PLACES.filter((p) => p.kind === 'cafe').length).toBeGreaterThan(20)
    expect(PLACES.filter((p) => p.kind === 'restaurant').length).toBeGreaterThan(60)
  })
})
