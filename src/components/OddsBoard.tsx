import { useMemo, useState } from 'react'
import { EXTERNAL_RATINGS } from '../data/reviews'
import { KIND_LABELS } from '../data/types'
import { FACTORS, type Entry } from '../lib/odds'
import { percent, shortLocation } from '../lib/format'
import { SITE_LABELS } from '../lib/reviews'
import { SOCIAL } from '../data/social'
import { StatusPill } from './StatusPill'

const PAGE = 30

interface Props {
  odds: Entry[]
  disabled: boolean
  onVeto: (id: string) => void
}

export function OddsBoard({ odds, disabled, onVeto }: Props) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const ranked = odds.map((e, i) => ({ e, rank: i + 1 }))
    if (!q) return ranked
    return ranked.filter(
      ({ e }) =>
        e.place.name.toLowerCase().includes(q) ||
        e.place.cuisine.toLowerCase().includes(q) ||
        e.place.locations.some((l) => l.building.toLowerCase().includes(q)),
    )
  }, [odds, query])

  const visible = showAll || query ? rows : rows.slice(0, PAGE)

  return (
    <section className="panel odds" aria-labelledby="odds-title">
      <div className="panel-head">
        <h3 id="odds-title">Odds board</h3>
        <input
          id="odds-search"
          type="search"
          placeholder="Search name, cuisine, building"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the odds board"
        />
      </div>
      <p className="fine">
        Every place on the wheel, likeliest first. The bars show taste, aesthetic, reviews and notoriety. Badges mark
        places with their own SM North ratings and social posts. Veto a place to take it off the wheel.
      </p>
      <ol className="odds-list">
        {visible.map(({ e, rank }) => (
          <li key={e.place.id} className="odds-row">
            <span className="odds-rank mono">{rank}</span>
            <span className={`odds-swatch k-bg-${e.place.kind}`} title={KIND_LABELS[e.place.kind]} aria-hidden="true" />
            <span className="odds-main">
              <span className="odds-name">
                {e.place.name}
                {e.place.status !== 'open' && <StatusPill status={e.place.status} />}
                {EXTERNAL_RATINGS[e.place.id]?.map((r) => (
                  <span key={r.url + r.stars} className="pill pill-rating mono" title={`${r.count} reviews`}>
                    {SITE_LABELS[r.site]} {r.stars.toFixed(1)}★
                  </span>
                ))}
                {SOCIAL[e.place.id] && (
                  <span className="pill pill-social mono" title="Posts on TikTok, YouTube, Instagram or Facebook">
                    {SOCIAL[e.place.id].length} {SOCIAL[e.place.id].length === 1 ? 'post' : 'posts'}
                  </span>
                )}
              </span>
              <span className="odds-meta">
                {e.place.cuisine} · {shortLocation(e.place.locations[0])}
                {e.place.locations.length > 1 && ` +${e.place.locations.length - 1}`}
              </span>
            </span>
            <span className="odds-bars" aria-label={FACTORS.map((f) => `${f} ${e.place.scores[f]}`).join(', ')}>
              {FACTORS.map((f) => (
                <span key={f} className={`mini mini-${f}`}>
                  <span style={{ height: `${e.place.scores[f] * 10}%` }} />
                </span>
              ))}
            </span>
            <span className="odds-pct mono">{percent(e.probability)}</span>
            <button
              type="button"
              className="odds-veto"
              disabled={disabled}
              onClick={() => onVeto(e.place.id)}
              aria-label={`Veto ${e.place.name}`}
              title="Veto"
            >
              ✕
            </button>
          </li>
        ))}
      </ol>
      {rows.length === 0 && <p className="fine">No place on the wheel matches “{query}”.</p>}
      {!query && rows.length > PAGE && (
        <button type="button" className="btn btn-quiet" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show top 30' : `Show all ${rows.length}`}
        </button>
      )}
    </section>
  )
}
