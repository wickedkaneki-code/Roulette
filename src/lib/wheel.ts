/*
 * Wheel geometry. Angles are degrees, 0 at 12 o'clock, increasing clockwise.
 * The pointer is fixed at 12 o'clock; the wheel rotates clockwise by `rotation`.
 */

export interface Slice<T> {
  item: T
  start: number
  end: number
}

export function layoutSlices<T>(items: T[], shareOf: (item: T) => number): Slice<T>[] {
  const total = items.reduce((sum, item) => sum + shareOf(item), 0)
  let cursor = 0
  return items.map((item, i) => {
    const sweep = total > 0 ? (shareOf(item) / total) * 360 : 360 / items.length
    const start = cursor
    cursor = i === items.length - 1 ? 360 : cursor + sweep
    return { item, start, end: cursor }
  })
}

export function normalize(angle: number): number {
  return ((angle % 360) + 360) % 360
}

/** The wheel angle sitting under the pointer after rotating by `rotation`. */
export function angleAtPointer(rotation: number): number {
  return normalize(360 - normalize(rotation))
}

export function sliceIndexAt<T>(slices: Slice<T>[], angle: number): number {
  const a = normalize(angle)
  const i = slices.findIndex((s) => a >= s.start && a < s.end)
  return i === -1 ? slices.length - 1 : i
}

/**
 * Next absolute rotation that brings `targetAngle` under the pointer after at
 * least `fullTurns` complete clockwise turns from `current`.
 */
export function rotationToLand(current: number, targetAngle: number, fullTurns: number): number {
  const delta = normalize(360 - normalize(targetAngle) - normalize(current))
  return current + fullTurns * 360 + delta
}

/** A landing angle inside the slice, kept away from its edges. */
export function landingAngle(slice: Slice<unknown>, rand: () => number): number {
  const sweep = slice.end - slice.start
  return slice.start + sweep * (0.15 + 0.7 * rand())
}

/** Stable pseudo-random order so big slices don't all clump together. */
export function scatterOrder<T>(items: T[], key: (item: T) => string): T[] {
  const hash = (s: string) => {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }
  return [...items].sort((a, b) => hash(key(a)) - hash(key(b)))
}

export function polar(angle: number, radius: number): [number, number] {
  const rad = (angle * Math.PI) / 180
  return [radius * Math.sin(rad), -radius * Math.cos(rad)]
}

export function slicePath(start: number, end: number, radius: number): string {
  const [x0, y0] = polar(start, radius)
  const [x1, y1] = polar(end, radius)
  const large = end - start > 180 ? 1 : 0
  return `M0 0 L${x0.toFixed(2)} ${y0.toFixed(2)} A${radius} ${radius} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`
}
