export interface Source {
  label: string
  url: string
  date: string
}

// Every venue cites at least one of these. The official SM directory is the
// backbone; the rest add 2025–2026 openings and notoriety/aesthetic signals.
export const SOURCES = {
  smdir: {
    label: 'SM Supermalls official store directory — SM City North EDSA (dining category)',
    url: 'https://www.smsupermalls.com/mall-directory/sm-city-north-edsa/information',
    date: 'Fetched 2026-10-15',
  },
  sm2025jan: {
    label: 'SM Supermalls — "New on The Block and Beyond" (SM North EDSA openings)',
    url: 'https://www.smsupermalls.com/whats-new/lifestyle/explore-the-new-wave-of-shopping-and-dining-at-sm-north-edsa-new-on-the-block-and-beyond',
    date: '2025-01-31',
  },
  sm2025cafes: {
    label: 'SM Supermalls — "Top Hangout Cafes at SM You\'ll Never Get Over"',
    url: 'https://www.smsupermalls.com/whats-new/lifestyle/top-hangout-cafes-at-sm-you-ll-never-get-over',
    date: '2025-07-04',
  },
  sm2024coffee: {
    label: 'SM Supermalls — "10 Must-Try Coffee Shops"',
    url: 'https://www.smsupermalls.com/whats-new/lifestyle/10-best-coffee-spots-for-your-next-girls-only-hangout',
    date: '2024-04-03',
  },
  sm2026feb: {
    label: 'SM Supermalls — "Get Your 2026 Craving Non-Negotiables"',
    url: 'https://www.smsupermalls.com/whats-new/eat-drink/get-your-2026-craving-non-negotiables-at-sm-supermalls-in-the-metro',
    date: '2026-02-02',
  },
  sm2026apr: {
    label: 'SM Supermalls — "Your Next Craving Wins! Award-Worthy Meals"',
    url: 'https://www.smsupermalls.com/whats-new/eat-drink/your-next-craving-wins-discover-award-worthy-meals-in-the-metro-at-sm-supermalls',
    date: '2026-04-17',
  },
  sm2026may: {
    label: 'SM Supermalls — "First Bite Energy: What\'s New in the Metro"',
    url: 'https://www.smsupermalls.com/whats-new/eat-drink/first-bite-energy-what-s-new-and-worth-craving-in-the-metro-at-sm-supermalls',
    date: '2026-05-19',
  },
  tribune2026: {
    label: 'Daily Tribune — "SM Supermalls unveils new dining lineup"',
    url: 'https://tribune.net.ph/2026/03/31/sm-supermalls-unveils-new-dining-lineup',
    date: '2026-03-31',
  },
  koreatimes2026: {
    label: 'The Korea Times — "bhc opens 1st Philippine store"',
    url: 'https://www.koreatimes.co.kr/business/companies/20260803/bhc-opens-1st-philippine-store-tailoring-menu-to-local-tastes',
    date: '2026-08-03',
  },
  mb2026candid: {
    label: 'Manila Bulletin — "What to order at Candid Coffee\'s new SM North EDSA branch"',
    url: 'https://mb.com.ph/2026/07/17/what-to-order-at-candid-coffees-new-sm-north-edsa-branch',
    date: '2026-07-17',
  },
  mega2026: {
    label: 'MEGA — "The New Restaurants Worth Trying—and Dressing Up For—at SM Supermalls"',
    url: 'https://mega-asia.com/lifestyle/dining/the-new-restaurants-worth-trying-and-dressing-up-for-at-sm-supermalls/',
    date: '2026-02-06',
  },
  michelin2026: {
    label: 'MICHELIN Guide Manila & Environs and Cebu 2026 — Bib Gourmand selection',
    url: 'https://guide.michelin.com/us/en/article/michelin-guide-ceremony/philippines-bib-gourmand-2026',
    date: '2025-10-30',
  },
  eatigo2026: {
    label: 'Eatigo — "30 Best SM North EDSA restaurants (update 2026)"',
    url: 'https://blog.eatigo.com/philippines/15-best-sm-north-edsa-restaurants-2025/',
    date: '2026',
  },
  rqc2026: {
    label: 'Restaurants Quezon City — SM North EDSA restaurant directory 2026',
    url: 'https://www.restaurantsquezoncity.com/sm-north',
    date: '2026',
  },
  booky: {
    label: 'Booky — "Must-Try Restaurants in SM North EDSA"',
    url: 'https://booky.ph/blog/restaurants-in-sm-north-edsa/',
    date: 'n.d.',
  },
  barbera2025: {
    label: 'Café Barbera — "Second Café Barbera Mini in Manila now open at SM North EDSA – The Block"',
    url: 'https://www.cafebarbera.com/cafe-barbera-opens-second-location-in-manila/',
    date: '2025',
  },
  smnorthtiktok2025: {
    label: 'SM North EDSA official TikTok — coffee spots (PAUL, Coffee Bean, Bo\'s)',
    url: 'https://www.tiktok.com/@smnorthedsa/video/7490507938251967752',
    date: '2025',
  },
  parisbaguette: {
    label: 'Booky — "Korea\'s Paris Baguette is Now Open at SM North EDSA"',
    url: 'https://booky.ph/blog/paris-baguette-manila/',
    date: '2024',
  },
  social: {
    label: 'Social media posts — TikTok, YouTube, Instagram, Facebook (linked on each place)',
    url: 'https://www.tiktok.com/discover/north-edsa-restaurant',
    date: 'Captured 2026-10-15',
  },
  tripadvisor: {
    label: 'Tripadvisor — SM City North EDSA branch listings (ratings and review counts)',
    url: 'https://www.tripadvisor.com/RestaurantsNear-g298574-d7116778-SM_City_North_EDSA-Quezon_City_Metro_Manila_Luzon.html',
    date: 'Captured 2026-10-15',
  },
  yelp: {
    label: 'Yelp — SM City North EDSA branch listings (star ratings and review counts)',
    url: 'https://www.yelp.com/search?find_desc=Restaurants&find_loc=SM+City+North+EDSA+Annex+1+Tunnel%2C+Quezon+City%2C+Metro+Manila',
    date: 'Captured 2026-10-15',
  },
  klook: {
    label: 'Klook — SM North EDSA food & dining listings',
    url: 'https://www.klook.com/en-US/destination/p50047021-sm-north-edsa/2-food-and-dining/',
    date: 'Captured 2026-10-15',
  },
  pedal: {
    label: 'Pedal Cafe – SM North (official Facebook page)',
    url: 'https://www.facebook.com/pedalcafeph.smnorth/',
    date: '2026',
  },
} as const satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES
