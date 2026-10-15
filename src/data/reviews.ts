/*
 * Star ratings from Yelp and Klook for SM North EDSA branches, captured
 * 2026-10-15 through the search index (both sites block direct fetching).
 *
 * Only branch-level listings are kept. A listing on another branch of the same
 * chain is never borrowed. `match: 'likely'` marks a listing Yelp places about
 * 0.1–0.3 mi from the mall with no branch page to confirm it; it counts half.
 * Notes paraphrase what reviewers said; they are not verbatim quotes.
 *
 * Reddit is not included: it refuses automated access from this environment,
 * including through search.
 */

export type ReviewSite = 'yelp' | 'klook'

export interface ExternalRating {
  site: ReviewSite
  /** Stars out of 5. */
  stars: number
  count: number
  url: string
  match: 'exact' | 'likely'
  note?: string
}

export const REVIEWS_CAPTURED = '2026-10-15'

const YELP_SEARCH = {
  filipino: 'https://www.yelp.com/search?cflt=filipino&find_loc=SM+City+North+EDSA+Annex+1+Tunnel%2C+Quezon+City%2C+Metro+Manila',
  chinese: 'https://www.yelp.com/search?cflt=chinese&find_loc=SM+City+North+EDSA+Annex+1+Tunnel%2C+Quezon+City%2C+Metro+Manila',
  buffets: 'https://www.yelp.com/search?cflt=buffets&find_loc=SM+City+North+EDSA+Annex+1+Tunnel%2C+Quezon+City%2C+Metro+Manila',
  bakeries: 'https://www.yelp.com/search?cflt=bakeries&find_near=sm-city-north-edsa-quezon-city-2',
  mainBldg:
    'https://yelp.com/search?find_desc=Restaurants&find_loc=3%2FF%2C+SM+City+-+North+Edsa%2C+Main+Building+North+Avenue+Corner%2C+Quezon+City%2C+1100+Metro+Manila%2C+Philippines',
}

export const EXTERNAL_RATINGS: Record<string, ExternalRating[]> = {
  'vikings-luxury-buffet': [
    {
      site: 'klook',
      stars: 4.7,
      count: 41,
      url: 'https://www.klook.com/en-PH/activity/163220-vikings-luxury-buffet-in-sm-north-edsa/',
      match: 'exact',
      note: 'Voucher buyers call it good value and praise the selection and staff.',
    },
    {
      site: 'yelp',
      stars: 3.5,
      count: 20,
      url: 'https://www.yelp.com/biz/vikings-quezon-city',
      match: 'exact',
      note: 'The carving station stands out; one reviewer says the spread rivals hotel buffets.',
    },
  ],
  'tong-yang-plus': [
    {
      site: 'klook',
      stars: 4.4,
      count: 5,
      url: 'https://www.klook.com/en-PH/activity/187267-tong-yang-grill-shabu-shabu-in-sm-north-edsa/',
      match: 'exact',
      note: 'Food is good, but refills are slow and prices went up recently.',
    },
  ],
  'bistro-remedios': [
    {
      site: 'klook',
      stars: 5.0,
      count: 5,
      url: 'https://www.klook.com/en-US/destination/p50047021-sm-north-edsa/2-food-and-dining/',
      match: 'likely',
      note: 'Accommodating staff, delicious food, clean room.',
    },
  ],
  'yabu-house-of-katsu': [
    {
      site: 'yelp',
      stars: 4.3,
      count: 13,
      url: 'https://www.yelp.com/biz/yabu-quezon-city',
      match: 'exact',
      note: 'The katsu gets the most praise; sets come with refillable rice and miso soup.',
    },
  ],
  'conti-s-bakeshop-and-restaurant': [
    {
      site: 'yelp',
      stars: 4.0,
      count: 12,
      url: 'https://www.yelp.com/biz/contis-bakeshop-and-restaurant-sm-north-edsa-quezon-city',
      match: 'exact',
      note: 'Well liked, though reviewers find it pricey.',
    },
  ],
  'lugang-cafe': [
    { site: 'yelp', stars: 4.4, count: 7, url: 'https://www.yelp.com/biz/lugang-cafe-quezon-city-2', match: 'exact' },
  ],
  tres: [
    {
      site: 'yelp',
      stars: 4.0,
      count: 7,
      url: YELP_SEARCH.filipino,
      match: 'exact',
      note: 'Reviews single out the crispy kare-kare.',
    },
  ],
  'ramen-nagi': [
    {
      site: 'yelp',
      stars: 4.4,
      count: 9,
      url: 'https://www.yelp.com/biz/ramen-nagi-quezon-city-3',
      match: 'exact',
      note: 'Huge bowls and a layered broth; pricey, crowded, and no takeout.',
    },
  ],
  'tim-ho-wan': [{ site: 'yelp', stars: 4.0, count: 18, url: YELP_SEARCH.chinese, match: 'likely' }],
  'fat-fook-taiwanese-kitchen': [
    { site: 'yelp', stars: 4.7, count: 3, url: YELP_SEARCH.mainBldg, match: 'exact' },
    { site: 'yelp', stars: 3.0, count: 1, url: YELP_SEARCH.chinese, match: 'exact', note: 'Second Yelp listing ("Fat Fook Kitchen").' },
  ],
  'soban-k-town-grill': [
    {
      site: 'yelp',
      stars: 3.0,
      count: 2,
      url: 'https://www.yelp.com/biz/soban-k-town-grill-quezon-city',
      match: 'exact',
      note: 'One reviewer liked the unlimited side dishes.',
    },
  ],
  'kimono-ken': [
    {
      site: 'yelp',
      stars: 5.0,
      count: 1,
      url: 'https://www.yelp.com/biz/kimono-ken-quezon-city-2',
      match: 'exact',
      note: 'The one review praises the tendon, big shrimp and service.',
    },
  ],
  'classic-savory': [
    {
      site: 'yelp',
      stars: 4.0,
      count: 1,
      url: 'https://www.yelp.com/biz/classic-savory-quezon-city-4',
      match: 'exact',
      note: 'Fried chicken with standout gravy, plus lomi.',
    },
  ],
  'barrio-fiesta': [
    { site: 'yelp', stars: 3.5, count: 4, url: 'https://www.yelp.com/biz/barrio-fiesta-quezon-city-4', match: 'exact' },
  ],
  'the-aristocrat': [
    {
      site: 'yelp',
      stars: 4.5,
      count: 2,
      url: 'https://www.yelp.com/biz/the-aristocrat-quezon-city-2',
      match: 'exact',
      note: 'Order the chicken barbecue with java rice.',
    },
    { site: 'yelp', stars: 3.0, count: 3, url: 'https://www.yelp.com/biz/aristocrat-restaurant-quezon-city', match: 'exact' },
  ],
  'gerry-s-restaurant': [
    {
      site: 'yelp',
      stars: 3.0,
      count: 3,
      url: 'https://www.yelp.com/biz/gerrys-grill-quezon-city-6',
      match: 'likely',
      note: 'Roomy and friendly, but servers rarely check back.',
    },
  ],
  banapple: [
    {
      site: 'yelp',
      stars: 4.5,
      count: 2,
      url: 'https://www.yelp.com/biz/banapple-pies-and-cheesecakes-quezon-city-2',
      match: 'exact',
      note: 'Go-to pies and cakes; walk-ins may wait for a seat.',
    },
  ],
  'kumori-japanese-bakery-cafe': [
    {
      site: 'yelp',
      stars: 4.7,
      count: 3,
      url: YELP_SEARCH.bakeries,
      match: 'likely',
      note: 'Praise for the lemon bars, mango brownies and crinkles.',
    },
  ],
  cabalen: [
    {
      site: 'yelp',
      stars: 2.7,
      count: 6,
      url: YELP_SEARCH.buffets,
      match: 'exact',
      note: 'One reviewer found some dishes inconsistent.',
    },
  ],
  'starbucks-coffee': [
    {
      site: 'yelp',
      stars: 1.0,
      count: 1,
      url: 'https://www.yelp.com/biz/starbucks-coffee-quezon-city-19',
      match: 'exact',
      note: 'A single review of The Block branch found the coffee weak.',
    },
  ],
}
