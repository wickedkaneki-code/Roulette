# SM North Food Roulette

A weighted roulette wheel of every café and restaurant in **SM City North EDSA** (Quezon City). Places with
better reviews, prettier interiors and bigger names get bigger slices, and you control how much each factor
matters.

- **281 places**: every dining tenant in SM Supermalls' official SM North EDSA directory (checked 15 Oct 2026),
  merged across branches, plus 2025–2026 openings from SM and press coverage (BHC Chicken's first PH store,
  Candid Coffee, Café Barbera Mini, Pizza Planet, King's Feast buffet, Milksha's concept store and more).
- **Three scores per place, 0–10**: reviews, aesthetic and notoriety.
- **Sliders** for how much each factor counts, plus a favoritism dial from pure luck to top picks only.
- **Filters** for category (restaurants, buffets, fast food, cafés, desserts, drinks, kiosks), building, budget
  and announced-but-unconfirmed openings.
- **Odds board** showing every place's exact chance, with search and veto.
- Order-slip result card with location, scores, sources and a Google Maps link; recent-spin history.

## Run it

```bash
npm install
npm run dev          # local dev server
npm test             # unit tests (weighting, wheel landing, data integrity)
npm run build        # production build in dist/
npm run build:single # one self-contained dist-single/index.html you can open offline or share
```

## How the odds work

1. Each place has `reviews`, `aesthetic` and `notoriety` scores from 0 to 10.
2. Your slider weights blend them into one weighted score:
   `score = Σ(weightᵢ × scoreᵢ) / Σ weightᵢ`.
3. The pick weight is `(score / 10) ^ favoritism`. At favoritism ×0 every place is equally likely; at ×3 a
   place scoring 9 is about 5.8× likelier than one scoring 5.
4. The winner is drawn with `crypto.getRandomValues`, and the wheel spins to land on that exact slice. Slice
   sizes are drawn to scale with the odds.

Presets: **Balanced** (reviews 50 / aesthetic 25 / notoriety 25), **Foodie**, **For the 'gram**,
**Hype hunter** and **Pure luck**.

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

## Project layout

```
src/
  data/       places.ts (venues), sources.ts (citations), types.ts
  lib/        odds.ts (scoring + weighted pick), wheel.ts (geometry + landing), format.ts, storage.ts
  components/ Wheel, Controls, OddsBoard, ResultCard, StatusPill
  App.tsx     state, spinning, history
```

Built with React 19, TypeScript, Vite and Vitest; `canvas-confetti` celebrates the winner.
