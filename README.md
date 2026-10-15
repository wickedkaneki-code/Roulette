# SM North Food Roulette

A weighted roulette wheel of every café and restaurant in **SM City North EDSA** (Quezon City). Food people
rave about and rooms worth photographing get the biggest slices, and you control how much each factor matters.

- **303 places**: every dining tenant in SM Supermalls' official SM North EDSA directory (checked 15 Oct 2026),
  merged across branches, plus 2025–2026 openings from SM, the press and social media (BHC Chicken's first PH
  store, Candid Coffee, The Eight International Buffet, Katsudonya Saiko, RICH Bistro, Calle Cafe, Hoshino
  Coffee, Milksha's concept store and more).
- **Four scores per place, 0–10**: taste, aesthetic, reviews and notoriety. Taste and aesthetic count most by
  default (40% and 35%).
- **Social media signals**: 69 TikTok, YouTube and Facebook posts about 46 places move their
  taste and aesthetic scores (toggle in the app).
- **Real Tripadvisor, Yelp and Klook ratings** for the 30 places that have their own SM North listing,
  blended into the reviews score (toggle in the app), with links and reviewer notes on the result card.
- **Sliders** for how much each factor counts, plus a favoritism dial from pure luck to top picks only.
- **Filters** for category (restaurants, buffets, fast food, cafés, desserts, drinks, kiosks), building, budget
  and announced-but-unconfirmed openings.
- **Odds board** showing every place's exact chance, with search and veto.
- Order-slip result card with location, scores, sources and a Google Maps link; recent-spin history.

## Run it

```bash
npm install
npm run dev          # local dev server
npm test             # unit tests (weighting, review blend, social signals, wheel landing, data integrity)
npm run build        # production build in dist/
npm run build:single # one self-contained dist-single/index.html you can open offline or share
```

## How the odds work

1. Each place has `taste`, `aesthetic`, `reviews` and `notoriety` scores from 0 to 10.
2. Your slider weights blend them into one weighted score:
   `score = Σ(weightᵢ × scoreᵢ) / Σ weightᵢ`.
3. The pick weight is `(score / 10) ^ favoritism`. At favoritism ×0 every place is equally likely; at ×3 a
   place scoring 9 is about 5.8× likelier than one scoring 5.
4. The winner is drawn with `crypto.getRandomValues`, and the wheel spins to land on that exact slice. Slice
   sizes are drawn to scale with the odds.

Presets: **Taste & looks** (taste 40 / aesthetic 35 / reviews 15 / notoriety 10, the default), **Foodie**,
**For the 'gram**, **Crowd favorite**, **Hype hunter** and **Pure luck**.

## The data

All venue data lives in [`src/data/places.ts`](src/data/places.ts) and every source is listed in
[`src/data/sources.ts`](src/data/sources.ts). Each entry has a category, cuisine, building and floor, price
band, the three scores, a one-line blurb, tags (for example "MICHELIN Bib Gourmand brand (2026)" or
"First in the Philippines") and the sources it came from.

How scores were set:

- **Reviews** maps rating aggregates and food-media coverage onto 0–10 (roughly 4.7★ → 9, 4.3★ → 7,
  4.0★ → 6).
- **Aesthetic**: 9–10 for destination interiors (Muji Café, Starbucks Reserve, Paris Baguette's flagship,
  Pizza Planet's sci-fi room), 5–6 for a standard chain dining room, 1–2 for a stall.
- **Notoriety**: 9–10 for icons and Michelin-linked or first-in-PH brands (Din Tai Fung, Tim Ho Wan, Hawker
  Chan, BHC Chicken, Jollibee), 7–8 for well-known national brands, 2–4 for local or little-known stalls.

These are researched estimates, not live ratings. Edit the numbers in `places.ts` if you disagree; the tests
check that every score stays within 0–10 and every place cites a known source.

Status flags:

- `open`: listed in SM's directory or confirmed operating.
- `new`: opened in 2025–2026.
- `announced`: SM announced it as "soon to open" in 2026, but no opening was confirmed (Azela by Balay Dako,
  Gyukatsu Motomura, Royal Indian Curry House, Yakiniku King, Calle Cafe, Stuff'd). These are off the wheel
  unless you switch them on.

Thirteen directory tenants have no published description (for example "Hey Gulu", "Okto", "Varacco"). They are
kept with neutral scores and labelled "concept not published". The SM Cinema snack bar is left out because it
is a cinema concession.

Mall tenants change often, so check that a place is open before you go. This is a fan-made tool and is not
affiliated with SM Supermalls or any restaurant listed.

## Social media signals

[`src/data/social.ts`](src/data/social.ts) holds posts about SM North EDSA's food and rooms, captured on
2026-10-15. Each post records how it rates the food (`taste`) and the room (`looks`) as `rave`, `positive`,
`mixed` or `negative`, who posted it and the year where visible. Notes paraphrase the post.

- Points per post: rave 1, positive 0.6, mixed 0, negative −1.
- Who posted it: independent creator ×1, SM North's own account ×0.5, the restaurant's own account ×0.3.
- When: 2025–2026 ×1, 2023–2024 ×0.7, unknown ×0.7, older ×0.5.
- The total moves the estimate with diminishing returns, capped at ±2: `shift = 2 × tanh(points / 2)`.
- Taste starts from the reviews estimate (or its own estimate where the food clearly beats or trails the
  overall rating, as with Gyukatsu Kyoto Katsugyu) and also takes 70% of any review-site adjustment, since star
  ratings are mostly about the food.

| Platform | What it gave |
| --- | --- |
| TikTok | Most of the signal: café and food creator reviews, SM North's own café and dessert lists, new-opening crawls |
| YouTube | 2025–2026 buffet and food-court tours (The Eight, Lan Hot Pot, Tong Yang, Yakimix, Feast & Fire) |
| Facebook | Food-group posts, Seafood & Ribs Warehouse's 90% recommend rate, a 192K-view food-hall crawl |
| Instagram | Confirmed new cafés and their locations (Craft Coffee, More Coffee, RICH Bistro, Black Scoop) |
| Reddit, Threads, X | Not reachable from this environment |
| Lemon8 | Search returned Singapore posts only |

Social media also surfaced spots SM's directory doesn't list yet. These include RICH Bistro, BB.Q Chicken,
Katsudonya Saiko, Niku Niku Oh Kome, Ninepot, The Eight International Buffet, Lan Hot Pot, Feast & Fire,
Yakimix, Hoshino Coffee, Craft Coffee Roastery, Egghouse, Kofi Addict, 1000cc Coffee, Udders and Manila
Creamery. It also identified the directory's "Magure Restaurant" as Magure Izakaya and showed that Calle Cafe
is now open.

## Review-site ratings

[`src/data/reviews.ts`](src/data/reviews.ts) holds star ratings and review counts for 30 places, captured on
2026-10-15. All three sites block direct fetching, so the numbers were read from their search-indexed pages.

| Site | Listings | Biggest samples |
| --- | --- | --- |
| Tripadvisor | 20 across 19 places | Vikings 4.4★ (910), Tong Yang 4.9★ (817), Yabu 4.3★ (168), Lugang 3.7★ (59), Tim Ho Wan 3.8★ (58) |
| Yelp | 20 across 18 places | Vikings 3.5★ (20), Tim Ho Wan 4.0★ (18), Yabu 4.3★ (13), Conti's 4.0★ (12) |
| Klook | 3 | Vikings 4.7★ (41), Tong Yang 4.4★ (5), Bistro Remedios 5.0★ (5) |

How they feed the reviews score:

- Only branch-level SM North listings are used; a rating from another branch of the same chain is never
  borrowed.
- Sites rate on different curves, so each has a baseline (Klook 4.6★, Tripadvisor 4.0★, Yelp 3.8★). A rating
  at the baseline maps to 6/10, and each star above or below moves it 4 points.
- Each listing counts as its number of reviews, discounted when:
  - the branch is only a likely match (`match: 'likely'`, half weight), or
  - most reviews are old (`era: 'older'`, mostly before 2020, 40% weight; unknown era 75%; `'recent'`,
    mostly 2023–2026, full weight).
- The researched estimate counts as 15 reviews:
  `blended = (estimate × 15 + Σ score × effective reviews) / (15 + Σ effective reviews)`.
  Tong Yang rises from 8 to 9.5 on 817 recent Tripadvisor reviews; Vikings settles at 7.5; two bad reviews of
  Shake Shack only move it from 8 to 7.1.
- Notes are paraphrases of what reviewers said, not quotes.

Also tried, with nothing usable for SM North:

- **Reddit, Eater, Serious Eats**: refuse automated access, including through search. Eater and Serious Eats
  don't cover Manila restaurants anyway.
- **OpenTable**: its "near SM North EDSA" page lists only TriNoma and other nearby restaurants.
- **Zomato**: left the Philippines; its SM North pages are frozen around 2022 and show no review counts.
- **MICHELIN Guide**: none of its 2026 Philippine picks are at SM North; it is used for notoriety instead.

## Project layout

```
src/
  data/       places.ts (venues), social.ts (social posts), reviews.ts (review-site ratings),
              sources.ts (citations), types.ts
  lib/        odds.ts (scoring + weighted pick), social.ts (post scoring), reviews.ts (rating blend),
              wheel.ts (geometry + landing),
              format.ts, storage.ts
  components/ Wheel, Controls, OddsBoard, ResultCard, StatusPill
  App.tsx     state, spinning, history
```

Built with React 19, TypeScript, Vite and Vitest; `canvas-confetti` celebrates the winner.
