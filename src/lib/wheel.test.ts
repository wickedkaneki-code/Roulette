import { describe, expect, it } from 'vitest'
import { angleAtPointer, landingAngle, layoutSlices, rotationToLand, scatterOrder, sliceIndexAt } from './wheel'

describe('layoutSlices', () => {
  it('sizes slices by share and closes the circle', () => {
    const slices = layoutSlices([1, 1, 2], (n) => n)
    expect(slices.map((s) => [s.start, s.end])).toEqual([
      [0, 90],
      [90, 180],
      [180, 360],
    ])
  })
})

describe('rotationToLand', () => {
  it('brings the target angle under the pointer after the requested turns', () => {
    for (const current of [0, 37, 359, 1234.5, -90]) {
      for (const target of [0, 1, 45, 180, 270.5, 359.9]) {
        const next = rotationToLand(current, target, 6)
        expect(next - current).toBeGreaterThanOrEqual(6 * 360)
        expect(next - current).toBeLessThan(7 * 360)
        expect(angleAtPointer(next)).toBeCloseTo(target % 360, 6)
      }
    }
  })

  it('lands the chosen slice under the pointer', () => {
    const slices = layoutSlices(['a', 'b', 'c', 'd', 'e'], () => 1)
    let rotation = 0
    let seed = 7
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2 ** 31
      return seed / 2 ** 31
    }
    for (let winner = 0; winner < slices.length; winner++) {
      rotation = rotationToLand(rotation, landingAngle(slices[winner], rand), 5)
      expect(sliceIndexAt(slices, angleAtPointer(rotation))).toBe(winner)
    }
  })
})

describe('scatterOrder', () => {
  it('is a stable permutation', () => {
    const items = ['x', 'y', 'z', 'w']
    const a = scatterOrder(items, (s) => s)
    expect([...a].sort()).toEqual([...items].sort())
    expect(scatterOrder(items, (s) => s)).toEqual(a)
  })
})
