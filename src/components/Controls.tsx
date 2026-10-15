import type { Building, Factor, Kind, Price } from '../data/types'
import { FACTOR_LABELS, KIND_LABELS, PRICE_LABELS } from '../data/types'
import { DEFAULT_SETTINGS, FACTORS, spread, topShare, type Entry, type Settings, type Weights } from '../lib/odds'
import { percent } from '../lib/format'

const FACTOR_HINTS: Record<Factor, string> = {
  taste: 'The food, incl. TikTok, YouTube, IG, Facebook posts',
  aesthetic: 'Interiors and photo-worthiness, incl. social posts',
  reviews: 'Star ratings on Tripadvisor, Yelp, Klook',
  notoriety: 'Brand fame, awards, first-in-PH hype',
}

interface Preset {
  id: string
  label: string
  weights: Weights
  favoritism: number
}

const PRESETS: Preset[] = [
  { id: 'taste-looks', label: 'Taste & looks', weights: DEFAULT_SETTINGS.weights, favoritism: DEFAULT_SETTINGS.favoritism },
  { id: 'foodie', label: 'Foodie', weights: { taste: 70, aesthetic: 5, reviews: 20, notoriety: 5 }, favoritism: 4 },
  { id: 'gram', label: 'For the ’gram', weights: { taste: 20, aesthetic: 70, reviews: 5, notoriety: 5 }, favoritism: 4 },
  { id: 'crowd', label: 'Crowd favorite', weights: { taste: 20, aesthetic: 10, reviews: 60, notoriety: 10 }, favoritism: 4 },
  { id: 'hype', label: 'Hype hunter', weights: { taste: 20, aesthetic: 15, reviews: 5, notoriety: 60 }, favoritism: 4 },
  { id: 'luck', label: 'Pure luck', weights: DEFAULT_SETTINGS.weights, favoritism: 0 },
]

const KINDS: Kind[] = ['restaurant', 'buffet', 'fastfood', 'cafe', 'dessert', 'drinks', 'kiosk']
const BUILDINGS: Building[] = ['City Center', 'The Block', 'The Annex', 'Sky Garden', 'North Towers', 'North Link', 'Interior Zone', 'Terminal']
const PRICES: Price[] = [1, 2, 3, 4]

interface Props {
  settings: Settings
  odds: Entry[]
  kindCounts: Record<Kind, number>
  announcedCount: number
  ratedCount: number
  socialCount: number
  disabled: boolean
  onChange: (next: Settings) => void
}

export function Controls({ settings, odds, kindCounts, announcedCount, ratedCount, socialCount, disabled, onChange }: Props) {
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch })
  const totalWeight = FACTORS.reduce((s, f) => s + settings.weights[f], 0)
  const activePreset = PRESETS.find(
    (p) => p.favoritism === settings.favoritism && FACTORS.every((f) => p.weights[f] === settings.weights[f]),
  )

  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item])

  return (
    <fieldset className="controls" disabled={disabled}>
      <section className="panel">
        <div className="panel-head">
          <h3>What raises the odds</h3>
          <div className="chips" role="group" aria-label="Presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="chip"
                aria-pressed={activePreset?.id === p.id}
                onClick={() => set({ weights: p.weights, favoritism: p.favoritism })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {FACTORS.map((f) => (
          <div key={f} className="slider-row">
            <label htmlFor={`w-${f}`}>
              <span className="slider-name">{FACTOR_LABELS[f]}</span>
              <span className="slider-hint">{FACTOR_HINTS[f]}</span>
            </label>
            <input
              id={`w-${f}`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={settings.weights[f]}
              onChange={(e) => set({ weights: { ...settings.weights, [f]: Number(e.target.value) } })}
            />
            <output htmlFor={`w-${f}`} className="mono">
              {totalWeight ? Math.round((settings.weights[f] / totalWeight) * 100) : 0}%
            </output>
          </div>
        ))}
        <div className="slider-row">
          <label htmlFor="favoritism">
            <span className="slider-name">Favoritism</span>
            <span className="slider-hint">
              {settings.favoritism === 0
                ? 'Off: every place gets an equal slice'
                : `Top pick is ${spread(odds).toFixed(1)}× likelier than the last; top 10 hold ${percent(topShare(odds, 10))}`}
            </span>
          </label>
          <input
            id="favoritism"
            type="range"
            min={0}
            max={8}
            step={0.5}
            value={settings.favoritism}
            onChange={(e) => set({ favoritism: Number(e.target.value) })}
          />
          <output htmlFor="favoritism" className="mono">
            ×{settings.favoritism}
          </output>
        </div>
        <label className="switch" htmlFor="external">
          <input
            id="external"
            type="checkbox"
            checked={settings.useExternalReviews}
            onChange={(e) => set({ useExternalReviews: e.target.checked })}
          />
          <span>Blend in real Tripadvisor, Yelp &amp; Klook ratings ({ratedCount} places)</span>
        </label>
        <label className="switch" htmlFor="social">
          <input
            id="social"
            type="checkbox"
            checked={settings.useSocial}
            onChange={(e) => set({ useSocial: e.target.checked })}
          />
          <span>Let TikTok, YouTube, IG &amp; Facebook posts move taste and aesthetic ({socialCount} places)</span>
        </label>
      </section>

      <section className="panel">
        <h3>On the wheel</h3>
        <div className="chips" role="group" aria-label="Categories">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className={`chip chip-kind k-chip-${k}`}
              aria-pressed={settings.kinds.includes(k)}
              onClick={() => set({ kinds: toggle(settings.kinds, k) })}
            >
              <span className="swatch" aria-hidden="true" />
              {KIND_LABELS[k]} <span className="mono chip-count">{kindCounts[k]}</span>
            </button>
          ))}
        </div>

        <h4>Building</h4>
        <div className="chips" role="group" aria-label="Buildings">
          <button
            type="button"
            className="chip"
            aria-pressed={settings.buildings.length === 0}
            onClick={() => set({ buildings: [] })}
          >
            Whole mall
          </button>
          {BUILDINGS.map((b) => (
            <button
              key={b}
              type="button"
              className="chip"
              aria-pressed={settings.buildings.includes(b)}
              onClick={() => set({ buildings: toggle(settings.buildings, b) })}
            >
              {b}
            </button>
          ))}
        </div>

        <h4>Budget per person</h4>
        <div className="segmented" role="radiogroup" aria-label="Maximum price">
          {PRICES.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={settings.maxPrice === p}
              title={PRICE_LABELS[p]}
              onClick={() => set({ maxPrice: p })}
            >
              {p === 4 ? 'Any' : `Up to ${'₱'.repeat(p)}`}
            </button>
          ))}
        </div>
        <p className="fine">
          {settings.maxPrice === 4 ? 'No budget limit.' : `Only places at ${PRICE_LABELS[settings.maxPrice]} per person or less.`}
        </p>

        <label className="switch" htmlFor="announced">
          <input
            id="announced"
            type="checkbox"
            checked={settings.includeAnnounced}
            onChange={(e) => set({ includeAnnounced: e.target.checked })}
          />
          <span>Include announced openings not yet confirmed ({announcedCount})</span>
        </label>

        {settings.vetoed.length > 0 && (
          <p className="fine">
            {settings.vetoed.length} vetoed.{' '}
            <button type="button" className="linkish" onClick={() => set({ vetoed: [] })}>
              Restore all
            </button>
          </p>
        )}
      </section>
    </fieldset>
  )
}
