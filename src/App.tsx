import confetti from 'canvas-confetti'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controls } from './components/Controls'
import { OddsBoard } from './components/OddsBoard'
import { ResultCard } from './components/ResultCard'
import { Wheel } from './components/Wheel'
import { PLACES } from './data/places'
import { EXTERNAL_RATINGS, REVIEWS_CAPTURED } from './data/reviews'
import { SOCIAL } from './data/social'
import { SOURCES } from './data/sources'
import type { Kind } from './data/types'
import { buildSlices, percent, shortLocation } from './lib/format'
import { computeOdds, DEFAULT_SETTINGS, secureRandom, weightedPick, type Entry, type Settings } from './lib/odds'
import { withExternalReviews } from './lib/reviews'
import { withSocialSignals } from './lib/social'
import { load, save } from './lib/storage'
import { landingAngle, rotationToLand } from './lib/wheel'

// v2 added the taste factor; older saved weights don't have it.
const SETTINGS_KEY = 'smnorth-roulette:settings:v2'
const HISTORY_KEY = 'smnorth-roulette:history:v1'

interface HistoryItem {
  id: string
  name: string
  where: string
  chance: number
  at: number
}

const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const KIND_COUNTS = PLACES.reduce(
  (acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] ?? 0) + 1 }),
  {} as Record<Kind, number>,
)
const ANNOUNCED = PLACES.filter((p) => p.status === 'announced').length
const NEW_COUNT = PLACES.filter((p) => p.status === 'new').length
const RATED_COUNT = Object.keys(EXTERNAL_RATINGS).length
const SOCIAL_COUNT = Object.keys(SOCIAL).length
const VARIANTS = new Map<string, typeof PLACES>()
const placesFor = (s: Settings) => {
  const key = `${s.useExternalReviews}-${s.useSocial}`
  let places = VARIANTS.get(key)
  if (!places) {
    places = PLACES
    if (s.useExternalReviews) places = withExternalReviews(places)
    if (s.useSocial) places = withSocialSignals(places)
    VARIANTS.set(key, places)
  }
  return places
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => load(SETTINGS_KEY, DEFAULT_SETTINGS))
  const [history, setHistory] = useState<HistoryItem[]>(() => load(HISTORY_KEY, { items: [] as HistoryItem[] }).items)
  const [rotation, setRotation] = useState(0)
  const [duration, setDuration] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [frozen, setFrozen] = useState<Entry[] | null>(null)
  const [result, setResult] = useState<Entry | null>(null)
  const [ticket, setTicket] = useState(0)
  const pending = useRef<Entry | null>(null)
  const settleTimer = useRef<number | undefined>(undefined)

  useEffect(() => save(SETTINGS_KEY, settings), [settings])
  useEffect(() => save(HISTORY_KEY, { items: history }), [history])

  const odds = useMemo(() => computeOdds(placesFor(settings), settings), [settings])
  const wheelEntries = frozen ?? odds
  const slices = useMemo(() => buildSlices(wheelEntries), [wheelEntries])

  const settle = useCallback(() => {
    window.clearTimeout(settleTimer.current)
    const winner = pending.current
    if (!winner) return
    pending.current = null
    setSpinning(false)
    setFrozen(null)
    setResult(winner)
    setHistory((h) =>
      [
        {
          id: winner.place.id,
          name: winner.place.name,
          where: shortLocation(winner.place.locations[0]),
          chance: winner.probability,
          at: Date.now(),
        },
        ...h,
      ].slice(0, 8),
    )
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 38,
      origin: { y: 0.35 },
      colors: ['#F5B301', '#7B4FD6', '#E4572E', '#2BA6A0', '#E86FA8'],
      disableForReducedMotion: true,
    })
  }, [])

  const spinWith = useCallback(
    (entries: Entry[]) => {
      if (spinning || entries.length === 0) return
      const s = buildSlices(entries)
      const slice = s[weightedPick(s.map((x) => x.item))]
      const reduced = prefersReducedMotion()
      const ms = reduced ? 600 : 5200 + Math.round(secureRandom() * 1200)
      const turns = reduced ? 1 : 6 + Math.floor(secureRandom() * 3)
      pending.current = slice.item
      setFrozen(entries)
      setResult(null)
      setSpinning(true)
      setTicket((t) => t + 1)
      setDuration(ms)
      setRotation((r) => rotationToLand(r, landingAngle(slice, secureRandom), turns))
      // Safety net in case transitionend never fires (e.g. a hidden tab).
      settleTimer.current = window.setTimeout(settle, ms + 400)
    },
    [spinning, settle],
  )

  const spin = () => spinWith(odds)

  const veto = (id: string) => {
    if (spinning) return
    setSettings((s) => ({ ...s, vetoed: s.vetoed.includes(id) ? s.vetoed : [...s.vetoed, id] }))
  }

  const vetoAndRespin = () => {
    if (!result) return
    const next = { ...settings, vetoed: [...settings.vetoed, result.place.id] }
    setSettings(next)
    spinWith(computeOdds(placesFor(next), next))
  }

  useEffect(() => () => window.clearTimeout(settleTimer.current), [])

  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow mono">North Ave cor. EDSA · Quezon City · unofficial</p>
        <h1>SM North Food Roulette</h1>
        <p className="lede">
          Every café and restaurant in SM City North EDSA on one wheel: {PLACES.length} spots across City Center, The
          Block, The Annex, Sky Garden and North Towers, including {NEW_COUNT} that opened in 2025–26. Food people rave
          about and rooms worth photographing get the biggest slices.
        </p>
      </header>

      <main className="layout">
        <section className="stage" aria-label="Roulette">
          <Wheel
            slices={slices}
            rotation={rotation}
            durationMs={duration}
            spinning={spinning}
            highlightId={result?.place.id ?? null}
            onSpin={spin}
            onSettled={settle}
          />
          {odds.length === 0 && !spinning ? (
            <div className="empty">
              <p>Nothing on the wheel matches these filters.</p>
              <button type="button" className="btn" onClick={() => setSettings({ ...DEFAULT_SETTINGS })}>
                Reset filters
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-spin" onClick={spin} disabled={spinning}>
              {spinning ? 'Spinning…' : result ? 'Spin again' : 'Spin the wheel'}
            </button>
          )}

          {result && !spinning && (
            <ResultCard
              entry={result}
              ticket={ticket}
              blended={settings.useExternalReviews}
              social={settings.useSocial}
              onSpinAgain={spin}
              onVeto={vetoAndRespin}
            />
          )}

          {history.length > 0 && (
            <section className="history" aria-labelledby="history-title">
              <div className="panel-head">
                <h3 id="history-title">Recent spins</h3>
                <button type="button" className="linkish" onClick={() => setHistory([])} disabled={spinning}>
                  Clear
                </button>
              </div>
              <ol>
                {history.map((h) => (
                  <li key={h.at}>
                    <span>{h.name}</span>
                    <span className="mono fine">
                      {h.where} · {percent(h.chance)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </section>

        <aside className="side">
          <Controls
            settings={settings}
            odds={odds}
            kindCounts={KIND_COUNTS}
            announcedCount={ANNOUNCED}
            ratedCount={RATED_COUNT}
            socialCount={SOCIAL_COUNT}
            disabled={spinning}
            onChange={setSettings}
          />
          <OddsBoard odds={odds} disabled={spinning} onVeto={veto} />
        </aside>
      </main>

      <footer className="method">
        <h3>How the odds work</h3>
        <p>
          Each place has four scores from 0 to 10. <strong>Taste</strong> is how good the food is and{' '}
          <strong>aesthetic</strong> is how good the room looks; by default these two count most.{' '}
          <strong>Reviews</strong> is the overall star rating, and <strong>notoriety</strong> covers brand fame,
          awards such as the 2026 MICHELIN Guide Philippines, and first-in-the-Philippines hype. Your sliders blend
          them into one weighted score, and a place’s slice is proportional to (score ÷ 10) raised to the favoritism
          power. At ×0 every slice is equal.
        </p>
        <p>
          Every score starts as a researched estimate. For the {SOCIAL_COUNT} places creators have posted about on
          TikTok, YouTube, Instagram or Facebook, each post moves taste or aesthetic by its tone: a rave counts more
          than a nod, and a negative post subtracts. Posts by the restaurant or the mall count less than independent
          creators, older posts count less, and no place moves more than 2 points. For the {RATED_COUNT} places with
          their own SM North listing on Tripadvisor, Yelp or Klook, those star ratings are blended into reviews: a
          rating at the site’s typical average counts as 6, more reviews outweigh the estimate more, and reviews
          written mostly before 2020 count less.
        </p>
        <p>
          The list of places comes from SM Supermalls’ official SM City North EDSA directory (checked 15 Oct 2026),
          plus openings reported through October 2026. Review-site ratings and social posts were captured on{' '}
          {REVIEWS_CAPTURED}. Mall tenants change often, so check a place is open before you go.
        </p>
        <h4>Sources</h4>
        <ul className="sources">
          {Object.values(SOURCES).map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>{' '}
              <span className="mono fine">{s.date}</span>
            </li>
          ))}
        </ul>
        <p className="fine">Fan-made tool. Not affiliated with SM Supermalls or any restaurant listed.</p>
      </footer>
    </div>
  )
}
