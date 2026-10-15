import type { Location, Place } from '../data/types'
import type { Entry } from './odds'
import { layoutSlices, scatterOrder, type Slice } from './wheel'

const FLOOR_SHORT: Record<string, string> = {
  'Lower Ground': 'LG',
  'Upper Ground': 'UG',
  'Ground floor': 'GF',
  '2nd floor': '2F',
  '3rd floor': '3F',
  '4th floor': '4F',
  '5th floor': '5F',
  '4th floor Food Hall': '4F Food Hall',
  Outdoor: 'Outdoor',
}

export function shortLocation(l: Location): string {
  if (l.building === 'TBA') return 'Spot TBA'
  const floor = FLOOR_SHORT[l.floor]
  return floor ? `${l.building} · ${floor}` : l.building
}

export function longLocation(l: Location): string {
  if (l.building === 'TBA') return 'Exact spot not published yet'
  return l.floor === 'Floor not published' ? `${l.building} (floor not published)` : `${l.building}, ${l.floor}`
}

export function percent(p: number): string {
  if (p === 0) return '0%'
  if (p < 0.001) return '<0.1%'
  return `${(p * 100).toFixed(p < 0.1 ? 1 : 0)}%`
}

export function mapsUrl(place: Place): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} SM North EDSA Quezon City`)}`
}

export function priceSigns(price: number): string {
  return '₱'.repeat(price)
}

/** Wheel layout shared by rendering and spinning, so the landing matches what's drawn. */
export function buildSlices(entries: Entry[]): Slice<Entry>[] {
  return layoutSlices(
    scatterOrder(entries, (e) => e.place.id),
    (e) => e.weight,
  )
}
