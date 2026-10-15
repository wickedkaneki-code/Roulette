/*
 * Star ratings from Tripadvisor, Yelp and Klook for SM North EDSA branches,
 * captured 2026-10-15 through the search index (all three block direct
 * fetching).
 *
 * Only branch-level listings are kept. A listing on another branch of the same
 * chain is never borrowed. `match: 'likely'` marks a listing Yelp places about
 * 0.1–0.3 mi from the mall with no branch page to confirm it; it counts half.
 * `era` records when most of a listing's reviews were written, where that was
 * visible: 'recent' (mostly 2023–2026) counts fully, 'older' (mostly before
 * 2020) counts 40%, and unknown counts 75%.
 * Notes paraphrase what reviewers said; they are not verbatim quotes.
 *
 * Also tried, with nothing usable for SM North: Reddit, Eater and Serious Eats
 * (refuse automated access), OpenTable (only TriNoma restaurants near the
 * mall), Zomato (pages frozen around 2022 after it left the Philippines, with
 * no review counts) and the MICHELIN Guide (no SM North restaurants; used for
 * notoriety instead).
 */

export type ReviewSite = 'tripadvisor' | 'yelp' | 'klook'

export interface ExternalRating {
  site: ReviewSite
  /** Stars out of 5. */
  stars: number
  count: number
  url: string
  match: 'exact' | 'likely'
  era?: 'recent' | 'older'
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
      site: 'tripadvisor',
      stars: 4.4,
      count: 910,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d3912124-Reviews-Vikings_SM_North_Edsa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Variety and staff get praise; recent reviews call the taste average and the carving-station lines long.',
    },
    {
      site: 'klook',
      era: 'recent',
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
      site: 'tripadvisor',
      stars: 4.9,
      count: 817,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d15186237-Reviews-Tong_Yang_The_Block_SM_City_North_Edsa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'Recent reviewers praise the hotpot variety and attentive staff.',
    },
    {
      site: 'klook',
      era: 'recent',
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
      era: 'recent',
      stars: 5.0,
      count: 5,
      url: 'https://www.klook.com/en-US/destination/p50047021-sm-north-edsa/2-food-and-dining/',
      match: 'likely',
      note: 'Accommodating staff, delicious food, clean room.',
    },
  ],
  'yabu-house-of-katsu': [
    {
      site: 'tripadvisor',
      stars: 4.3,
      count: 168,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d5002432-Reviews-Yabu_The_House_of_Katsu-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'older',
      note: 'Strong tonkatsu and good-value sets with unlimited rice, soup and cabbage; slow when crowded. Rating computed from the listing\'s star breakdown.',
    },
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
    {
      site: 'tripadvisor',
      stars: 3.7,
      count: 59,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d4606092-Reviews-Lugang_Cafe_SM_CITY_NORTH_EDSA-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Dumplings get consistent praise; service complaints recur.',
    },
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
      site: 'tripadvisor',
      stars: 4.4,
      count: 26,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d10278276-Reviews-Ramen_Nagi-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Custom ramen and fast, friendly service; pricey, with weekend queues.',
    },
    {
      site: 'yelp',
      stars: 4.4,
      count: 9,
      url: 'https://www.yelp.com/biz/ramen-nagi-quezon-city-3',
      match: 'exact',
      note: 'Huge bowls and a layered broth; pricey, crowded, and no takeout.',
    },
  ],
  'tim-ho-wan': [
    {
      site: 'tripadvisor',
      stars: 3.8,
      count: 58,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d8514863-Reviews-Tim_Ho_Wan-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'older',
      note: 'Baked pork buns and mango pomelo sago are favorites; long lines and small portions.',
    },
    { site: 'yelp', stars: 4.0, count: 18, url: YELP_SEARCH.chinese, match: 'likely' },
  ],
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
      site: 'tripadvisor',
      stars: 4.2,
      count: 26,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d4354648-Reviews-Kimono_Ken-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Good for family dinners; the space is small.',
    },
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
    {
      site: 'tripadvisor',
      stars: 3.5,
      count: 27,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d6419821-Reviews-Barrio_Fiesta_SM_North_EDSA-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'The kare-kare stands out; service can be slow.',
    },
    { site: 'yelp', stars: 3.5, count: 4, url: 'https://www.yelp.com/biz/barrio-fiesta-quezon-city-4', match: 'exact' },
  ],
  'the-aristocrat': [
    {
      site: 'tripadvisor',
      stars: 2.9,
      count: 8,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d3200484-Reviews-Aristocrat_Restaurant-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'older',
    },
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
  'mann-hann': [
    {
      site: 'tripadvisor',
      stars: 3.7,
      count: 36,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d2042703-Reviews-Mann_Hann-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Food is fine; service draws the lowest marks.',
    },
  ],
  'hawker-chan': [
    {
      site: 'tripadvisor',
      stars: 3.6,
      count: 7,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d26846913-Reviews-Hawker_Chan_SM_City_North_Edsa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'One reviewer called this the weakest branch of the chain.',
    },
  ],
  'max-s-restaurant': [
    {
      site: 'tripadvisor',
      stars: 3.2,
      count: 6,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d8464919-Reviews-Max_s_Restaurant_SM_City_North_EDSA-Quezon_City_Metro_Manila_Luzon.html',
      match: 'likely',
      era: 'older',
      note: 'Tripadvisor marks this listing closed, though Max\'s is still in SM\'s directory.',
    },
  ],
  'din-tai-fung': [
    {
      site: 'tripadvisor',
      stars: 5.0,
      count: 3,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d27133272-Reviews-Din_Tai_Fung_SM_North_Edsa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'The Choco Lava XLB is a hit; service is well trained.',
    },
  ],
  'manam-comfort-filipino': [
    {
      site: 'tripadvisor',
      stars: 3.5,
      count: 6,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d25078061-Reviews-Manam-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'Good squid-ink palabok; small and crammed on weekends, and one bad Valentine\'s night.',
    },
    {
      site: 'tripadvisor',
      stars: 5.0,
      count: 1,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d19593950-Reviews-Manam_Comfort_Filipino-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      note: 'Older listing; praises the sinigang and crispy sisig.',
    },
  ],
  'cafe-mary-grace': [
    {
      site: 'tripadvisor',
      stars: 4.4,
      count: 10,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d8519949-Reviews-Cafe_Mary_Grace-Quezon_City_Metro_Manila_Luzon.html',
      match: 'likely',
      era: 'older',
      note: 'Cakes (especially the sans rival) and ambiance praised; service can be slow.',
    },
  ],
  'shake-shack': [
    {
      site: 'tripadvisor',
      stars: 2.0,
      count: 2,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d26188435-Reviews-Shake_Shack_SM_North_Edsa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'Basic, greasy burgers; a guard stopped a diner from taking photos.',
    },
  ],
  'mesa-filipino-moderne': [
    {
      site: 'tripadvisor',
      stars: 3.7,
      count: 3,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d13009615-Reviews-Mesa-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'older',
      note: 'Good kare-kare and crispchon; some dishes take long.',
    },
  ],
  karayama: [
    {
      site: 'tripadvisor',
      stars: 4.3,
      count: 3,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d20136276-Reviews-Karayama-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'recent',
      note: 'Big, freshly fried chicken sets with 10 sauces.',
    },
  ],
  'seafood-and-ribs-warehouse': [
    {
      site: 'tripadvisor',
      stars: 4.5,
      count: 4,
      url: 'https://www.tripadvisor.com/Restaurant_Review-g298574-d17209814-Reviews-Seafood_Ribs_Warehouse-Quezon_City_Metro_Manila_Luzon.html',
      match: 'exact',
      era: 'older',
      note: 'Dampa-style pick-and-cook seafood, tender ribs, good value.',
    },
  ],
}
