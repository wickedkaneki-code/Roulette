import { SOURCES } from '../data/sources'
import { FACTOR_LABELS, KIND_LABELS } from '../data/types'
import type { Entry } from '../lib/odds'
import { FACTORS } from '../lib/odds'
import { longLocation, mapsUrl, percent, priceSigns } from '../lib/format'
import { StatusPill } from './StatusPill'

interface Props {
  entry: Entry
  ticket: number
  onSpinAgain: () => void
  onVeto: () => void
}

export function ResultCard({ entry, ticket, onSpinAgain, onVeto }: Props) {
  const { place, probability, composite } = entry
  return (
    <article className="slip" aria-live="polite">
      <header className="slip-head">
        <span className="mono">Order slip</span>
        <span className="mono">No. {String(ticket).padStart(4, '0')}</span>
      </header>
      <div className="slip-body">
        <p className={`slip-kind k-text-${place.kind}`}>
          {KIND_LABELS[place.kind]} · {place.cuisine}
        </p>
        <h2 className="slip-name">{place.name}</h2>
        <ul className="slip-where">
          {place.locations.map((l) => (
            <li key={`${l.building}-${l.floor}`}>{longLocation(l)}</li>
          ))}
        </ul>
        <p className="slip-blurb">{place.blurb}</p>
        <div className="slip-pills">
          <StatusPill status={place.status} />
          <span className="pill">{priceSigns(place.price)}</span>
          {place.tags.map((t) => (
            <span key={t} className="pill pill-tag">
              {t}
            </span>
          ))}
        </div>
        <dl className="slip-scores">
          {FACTORS.map((f) => (
            <div key={f} className="slip-score">
              <dt>{FACTOR_LABELS[f]}</dt>
              <dd>
                <span className="bar" aria-hidden="true">
                  <span style={{ width: `${place.scores[f] * 10}%` }} />
                </span>
                <span className="mono">{place.scores[f]}/10</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="slip-odds mono">
          Weighted score {composite.toFixed(1)} · had a {percent(probability)} chance
        </p>
        <p className="slip-sources">
          Sources:{' '}
          {place.sources.map((s, i) => (
            <span key={s}>
              {i > 0 && ', '}
              <a href={SOURCES[s].url} target="_blank" rel="noreferrer">
                {SOURCES[s].label.split(' — ')[0]}
              </a>
            </span>
          ))}
        </p>
      </div>
      <footer className="slip-actions">
        <button type="button" className="btn btn-primary" onClick={onSpinAgain}>
          Spin again
        </button>
        <button type="button" className="btn" onClick={onVeto}>
          Veto &amp; respin
        </button>
        <a className="btn btn-link" href={mapsUrl(place)} target="_blank" rel="noreferrer">
          Find on Google Maps
        </a>
      </footer>
    </article>
  )
}
