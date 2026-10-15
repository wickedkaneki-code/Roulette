import { PLACES } from '../data/places'
import { REVIEWS_CAPTURED } from '../data/reviews'
import { SOURCES } from '../data/sources'
import { FACTOR_LABELS, KIND_LABELS } from '../data/types'
import type { Entry } from '../lib/odds'
import { FACTORS } from '../lib/odds'
import { longLocation, mapsUrl, percent, priceSigns } from '../lib/format'
import { reviewBreakdown, SITE_LABELS } from '../lib/reviews'
import { PLATFORM_LABELS, socialBreakdown } from '../lib/social'
import { StatusPill } from './StatusPill'

interface Props {
  entry: Entry
  ticket: number
  /** Whether the reviews score includes Yelp/Klook ratings. */
  blended: boolean
  /** Whether taste and aesthetic include social media posts. */
  social: boolean
  onSpinAgain: () => void
  onVeto: () => void
}

export function ResultCard({ entry, ticket, blended, social, onSpinAgain, onVeto }: Props) {
  const { place, probability, composite } = entry
  const original = PLACES.find((p) => p.id === place.id) ?? place
  const reviews = reviewBreakdown(original)
  const buzz = socialBreakdown(original)
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
        <section className="slip-reviews" aria-label="On social media">
          <h3>On social media</h3>
          {buzz.posts.length === 0 ? (
            <p className="fine">
              No TikTok, YouTube, Instagram or Facebook posts found about this branch, so taste and aesthetic are
              estimates.
            </p>
          ) : (
            <>
              <ul>
                {buzz.posts.map((p) => (
                  <li key={p.url + p.note}>
                    <a href={p.url} target="_blank" rel="noreferrer" className="rating-link">
                      <span className="mono">{PLATFORM_LABELS[p.platform]}</span>{' '}
                      <span className="fine">
                        {p.by === 'brand' ? 'restaurant’s own post' : p.by === 'mall' ? 'SM North’s post' : 'creator'}
                        {p.year && ` · ${p.year}`}
                      </span>
                    </a>
                    <span className="tone-row">
                      {p.taste && <span className={`pill tone tone-${p.taste}`}>Taste: {p.taste}</span>}
                      {p.looks && <span className={`pill tone tone-${p.looks}`}>Looks: {p.looks}</span>}
                    </span>
                    <span className="rating-note">{p.note}</span>
                  </li>
                ))}
              </ul>
              <p className="fine">
                {social
                  ? `Taste ${buzz.taste.adjusted}/10 (estimate ${buzz.taste.estimate}) and aesthetic ${buzz.aesthetic.adjusted}/10 (estimate ${buzz.aesthetic.estimate}) after these posts.`
                  : `Social posts are switched off, so taste (${buzz.taste.estimate}) and aesthetic (${buzz.aesthetic.estimate}) use the estimates.`}{' '}
                Notes paraphrase the posts.
              </p>
            </>
          )}
        </section>
        <section className="slip-reviews" aria-label="What reviewers say">
          <h3>What reviewers say</h3>
          {reviews.ratings.length === 0 ? (
            <p className="fine">
              No Tripadvisor, Yelp or Klook listing found for this branch, so the reviews score is an estimate.
            </p>
          ) : (
            <>
              <ul>
                {reviews.ratings.map((r) => (
                  <li key={r.url + r.stars}>
                    <a href={r.url} target="_blank" rel="noreferrer" className="rating-link">
                      <span className="mono">
                        {SITE_LABELS[r.site]} {r.stars.toFixed(1)}★
                      </span>{' '}
                      <span className="fine">
                        {r.count} {r.count === 1 ? 'review' : 'reviews'}
                        {r.era === 'recent' && ' · mostly 2023–26'}
                        {r.era === 'older' && ' · mostly pre-2020'}
                        {r.match === 'likely' && ' · branch not confirmed'}
                      </span>
                    </a>
                    {r.note && <span className="rating-note">{r.note}</span>}
                  </li>
                ))}
              </ul>
              <p className="fine">
                {blended
                  ? `Reviews score ${reviews.blended}/10: the researched estimate (${reviews.estimate}) blended with these ${reviews.totalReviews} ratings.`
                  : `Blending is off, so the reviews score uses the researched estimate (${reviews.estimate}).`}{' '}
                Captured {REVIEWS_CAPTURED}; notes paraphrase reviewers.
              </p>
            </>
          )}
        </section>
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
