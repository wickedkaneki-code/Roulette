/*
 * What people post about SM North EDSA's food and rooms, captured 2026-10-15
 * through the search index. Each post records how it rates the food (`taste`)
 * and the room (`looks`), when it was posted where that was visible, and who
 * posted it: an independent creator, the restaurant itself ('brand') or SM
 * North EDSA's own account ('mall'). Notes paraphrase the post.
 *
 * Reachable: TikTok, YouTube, Instagram and Facebook. Not reachable from this
 * environment: Reddit, Threads and X. Lemon8 search returned Singapore posts.
 */

export type Platform = 'tiktok' | 'youtube' | 'instagram' | 'facebook'
export type Tone = 'rave' | 'positive' | 'mixed' | 'negative'
export type Poster = 'creator' | 'brand' | 'mall'

export interface SocialPost {
  platform: Platform
  url: string
  taste?: Tone
  looks?: Tone
  year?: number
  by: Poster
  note: string
}

export const SOCIAL_CAPTURED = '2026-10-15'

const tt = (path: string) => `https://www.tiktok.com/${path}`
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`

const SM_NORTH_CAFES = tt('@smnorthedsa/video/7502792320014650642')
const SM_NORTH_SWEETS = tt('@smnorthedsa/video/7437404428031905044')
const SM_NORTH_COFFEE = tt('@smnorthedsa/video/7490507938251967752')
const NORTH_EDSA_TAG = tt('discover/north-edsa-restaurant')
const FOOD_CRAWL_2026 = tt('@foodee.eatsph/video/7601750054940052756')

export const SOCIAL: Record<string, SocialPost[]> = {
  // ───────── Cafés ─────────
  'cafe-janggeum': [
    {
      platform: 'tiktok',
      url: tt('@iamkimrodz/video/7406610981092101383'),
      taste: 'positive',
      looks: 'rave',
      year: 2024,
      by: 'creator',
      note: 'Air-conditioned, “very instagrammable,” and the food is good too.',
    },
    {
      platform: 'tiktok',
      url: tt('@theloveylife/video/7250023471843953925'),
      looks: 'positive',
      year: 2023,
      by: 'creator',
      note: 'New branch looks IG-worthy, with lots of drinks and Korean snacks.',
    },
    { platform: 'tiktok', url: SM_NORTH_CAFES, looks: 'positive', year: 2025, by: 'mall', note: 'On SM North’s aesthetic café-hopping list.' },
  ],
  'muji-cafe': [
    {
      platform: 'tiktok',
      url: tt('@bbqsweetcorn/video/7373983283886968070'),
      taste: 'positive',
      looks: 'rave',
      year: 2024,
      by: 'creator',
      note: 'The biggest Muji café and store in the country feels like Japan; the matcha is the standout.',
    },
  ],
  'starbucks-reserve': [
    {
      platform: 'tiktok',
      url: tt('@kris.from.brooklyn/video/7405599277889768711'),
      taste: 'positive',
      looks: 'rave',
      year: 2024,
      by: 'creator',
      note: 'The renovated Reserve “looks like a first-class airport lounge”; order the coffee malt shake.',
    },
  ],
  'paris-baguette-cafe-adagio': [
    {
      platform: 'tiktok',
      url: tt('@kris.from.brooklyn/video/7419533928173767952'),
      taste: 'positive',
      looks: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Food is good value and the coffee decent, though the upstairs seating runs warm.',
    },
    {
      platform: 'tiktok',
      url: tt('@aliesaanne/video/7502685762224196872'),
      looks: 'positive',
      year: 2025,
      by: 'creator',
      note: 'A work-friendly café upstairs with Wi-Fi and a few sockets.',
    },
  ],
  'calle-cafe': [
    {
      platform: 'tiktok',
      url: tt('@coffeehunting.ph/video/7539144010586246407'),
      taste: 'positive',
      looks: 'rave',
      year: 2025,
      by: 'creator',
      note: 'The cave-themed room impresses; the Nocturne Spice cold brew is strong and spiced.',
    },
    {
      platform: 'tiktok',
      url: tt('@callecafebydongabriel'),
      looks: 'positive',
      year: 2025,
      by: 'brand',
      note: 'The Block branch keeps the brand’s signature cave look.',
    },
  ],
  'craft-coffee-roastery': [
    {
      platform: 'tiktok',
      url: tt('@bbqsweetcorn/video/7510467661180980488'),
      taste: 'positive',
      looks: 'positive',
      year: 2025,
      by: 'creator',
      note: 'A creator who knew the Fairview branch was hyped to find it here; the café mocha is the pick.',
    },
  ],
  aperitif: [
    {
      platform: 'tiktok',
      url: tt('@aperitif_ph/video/7512788400043232533'),
      taste: 'positive',
      looks: 'rave',
      year: 2025,
      by: 'brand',
      note: 'IG-worthy pastries on vintage trays in a room that’s always packed.',
    },
  ],
  'hoshino-coffee': [
    {
      platform: 'tiktok',
      url: FOOD_CRAWL_2026,
      taste: 'positive',
      looks: 'positive',
      year: 2026,
      by: 'creator',
      note: 'Cozy vibes for a café date, and the meals are worth trying beyond dessert.',
    },
  ],
  'paul-le-cafe': [
    { platform: 'tiktok', url: SM_NORTH_COFFEE, looks: 'positive', year: 2025, by: 'mall', note: 'SM North’s pick for a brunch date with friends.' },
  ],
  egghouse: [{ platform: 'tiktok', url: SM_NORTH_CAFES, looks: 'positive', year: 2025, by: 'mall', note: 'On SM North’s aesthetic café-hopping list.' }],
  'kofi-addict': [{ platform: 'tiktok', url: SM_NORTH_CAFES, looks: 'positive', year: 2025, by: 'mall', note: 'On SM North’s aesthetic café-hopping list.' }],
  'wealth-tea': [{ platform: 'tiktok', url: SM_NORTH_CAFES, looks: 'positive', year: 2025, by: 'mall', note: 'On SM North’s aesthetic café-hopping list.' }],
  'pedal-cafe': [
    {
      platform: 'tiktok',
      url: tt('@coffeebaddi/video/7352449082142559494'),
      taste: 'positive',
      year: 2024,
      by: 'creator',
      note: 'A coffee lover’s find at North Tower 5.',
    },
  ],
  'mad-mark-s-creamery-and-good-coffee': [
    {
      platform: 'tiktok',
      url: tt('@dayanaraalviar.vlogs/video/7376215827978226950'),
      taste: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Homemade ice cream and coffee worth the stop.',
    },
    { platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'On SM North’s must-try sweet treats list.' },
  ],

  // ───────── Restaurants ─────────
  'magure-izakaya': [
    {
      platform: 'tiktok',
      url: tt('@iamkimrodz/video/7428875818484436225'),
      taste: 'rave',
      looks: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Authentic Japanese food, great ambiance and service, very reasonable prices: “para kang nasa Japan.”',
    },
    {
      platform: 'tiktok',
      url: tt('@erickasallador/video/7385171791288765703'),
      taste: 'positive',
      looks: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Good food, affordable, IG-worthy.',
    },
    {
      platform: 'tiktok',
      url: tt('@lexychiu/video/7390658276955852040'),
      taste: 'mixed',
      looks: 'rave',
      year: 2024,
      by: 'creator',
      note: 'Food was only okay, but the presentation and interior won them over.',
    },
    {
      platform: 'tiktok',
      url: tt('@iamjacvillafuerte/video/7385488540076936465'),
      taste: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Creamy tonkotsu broth and slightly chewy noodles.',
    },
  ],
  'gyukatsu-kyoto-katsugyu': [
    {
      platform: 'tiktok',
      url: tt('@what.we.ate.at/video/7475561038780353799'),
      taste: 'rave',
      looks: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Tenderloin 9/10, wagyu 9.5/10, ebi tempura 8/10; the sirloin was a tougher 6.5/10.',
    },
  ],
  'din-tai-fung': [
    {
      platform: 'tiktok',
      url: tt('@danielebruce/video/7305256213841726726'),
      taste: 'positive',
      year: 2023,
      by: 'creator',
      note: 'Xiao long bao as good as ever, if a little pricey.',
    },
    {
      platform: 'tiktok',
      url: tt('@yeltorrejos/video/7244884834768702725'),
      taste: 'positive',
      year: 2023,
      by: 'creator',
      note: 'Finally a north branch; xiao long bao cravings satisfied.',
    },
    {
      platform: 'tiktok',
      url: tt('@deciwesi/video/7425470179733294353'),
      taste: 'rave',
      year: 2024,
      by: 'creator',
      note: 'Calls this branch underrated.',
    },
  ],
  'manam-comfort-filipino': [
    {
      platform: 'tiktok',
      url: tt('@eatspatriziad/video/7427272537165352210'),
      taste: 'rave',
      year: 2024,
      by: 'creator',
      note: 'The sisig and palabok taste exactly as good as they remember; the salpicao was a hit.',
    },
  ],
  'bhc-chicken': [
    {
      platform: 'tiktok',
      url: tt('@_pia.pie/video/7653077889167985940'),
      taste: 'rave',
      year: 2026,
      by: 'creator',
      note: 'Bburinkle cheese-seasoned chicken lives up to the hype: crispy and juicy.',
    },
    {
      platform: 'tiktok',
      url: tt('@saiileee/video/7652356212255755536'),
      taste: 'positive',
      year: 2026,
      by: 'creator',
      note: 'Tastes like the BHC they had in Korea; expect queues.',
    },
  ],
  'pizza-planet': [
    {
      platform: 'tiktok',
      url: tt('@vogueandhennessy/video/7648939188015910151'),
      taste: 'rave',
      looks: 'positive',
      year: 2026,
      by: 'creator',
      note: 'Good-value eat-all-you-can options and tasty food in a sci-fi room.',
    },
    {
      platform: 'tiktok',
      url: tt('discover/pizza-planet-north-edsa'),
      taste: 'positive',
      looks: 'rave',
      year: 2026,
      by: 'creator',
      note: 'Sisig pizza with chicharon crunch and beefy spaghetti stand out; futuristic interiors.',
    },
  ],
  'katsudonya-saiko': [
    {
      platform: 'tiktok',
      url: tt('@helloherl/video/7528006970113051911'),
      taste: 'rave',
      year: 2025,
      by: 'creator',
      note: 'Newest katsudon spot and “super sulit.”',
    },
    {
      platform: 'tiktok',
      url: tt('@justgotfed/video/7539135516332002567'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Crispy katsudon sets generous enough for two.',
    },
  ],
  'niku-niku-oh-kome': [
    { platform: 'tiktok', url: FOOD_CRAWL_2026, taste: 'positive', year: 2026, by: 'creator', note: 'Filling, beefy hamburg steak; get the egg sauce.' },
  ],
  ninepot: [
    { platform: 'tiktok', url: FOOD_CRAWL_2026, taste: 'positive', year: 2026, by: 'creator', note: 'Sesame-oil and mala milk hotpots both really flavorful.' },
  ],
  'rich-bistro': [
    { platform: 'tiktok', url: NORTH_EDSA_TAG, taste: 'positive', year: 2026, by: 'creator', note: 'Recommended for Indian food, especially the butter chicken.' },
  ],
  'scorched-smokehouse': [
    { platform: 'tiktok', url: NORTH_EDSA_TAG, taste: 'rave', by: 'creator', note: 'Steak that’s super affordable for its quality.' },
  ],
  'gangji-produced-hongkong-cafe': [
    { platform: 'tiktok', url: NORTH_EDSA_TAG, taste: 'positive', by: 'creator', note: 'Pitched as a cheap-eats Hong Kong café.' },
  ],
  'happy-birthday-food-center': [
    { platform: 'tiktok', url: NORTH_EDSA_TAG, taste: 'positive', by: 'creator', note: 'Classic Filipino party food: sweet spaghetti, fried chicken, lumpia.' },
  ],
  'teppanya-bar-resto': [
    {
      platform: 'tiktok',
      url: tt('@janinelu.ugc/video/7278254259668307206'),
      taste: 'positive',
      year: 2023,
      by: 'creator',
      note: 'A multi-course teppanyaki set worth the splurge.',
    },
  ],
  'seafood-and-ribs-warehouse': [
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/srwsmne',
      taste: 'positive',
      by: 'creator',
      note: '90% of 438 Facebook reviewers recommend the dampa-style seafood.',
    },
  ],

  // ───────── Buffets ─────────
  'the-eight-international-buffet': [
    {
      platform: 'youtube',
      url: yt('KsigvA_CsL4'),
      taste: 'positive',
      looks: 'positive',
      year: 2026,
      by: 'creator',
      note: 'A high-end buffet spread in a new room at The Block.',
    },
    {
      platform: 'tiktok',
      url: tt('@mariavillaviza/video/7659844319922179336'),
      taste: 'positive',
      year: 2026,
      by: 'creator',
      note: 'Asks whether The Block’s new buffet is ready to beat Vikings.',
    },
    {
      platform: 'tiktok',
      url: tt('@madambonita20/video/7649654703361461525'),
      taste: 'positive',
      year: 2026,
      by: 'creator',
      note: 'An affordable all-you-can-eat spread.',
    },
    {
      platform: 'tiktok',
      url: tt('@dansdigest/video/7657852936759889159'),
      taste: 'mixed',
      year: 2026,
      by: 'creator',
      note: 'Head-to-head review against Vikings on variety, taste and price.',
    },
  ],
  'vikings-luxury-buffet': [
    {
      platform: 'tiktok',
      url: tt('@thefoodproject/video/7284991000764796165'),
      taste: 'positive',
      looks: 'positive',
      year: 2023,
      by: 'creator',
      note: 'A huge selection in a grand room.',
    },
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/groups/foodtripmanila/posts/1524762008175618/',
      taste: 'positive',
      by: 'creator',
      note: 'Foodtrip Manila member: still one of the best buffets around.',
    },
  ],
  'tong-yang-plus': [
    {
      platform: 'tiktok',
      url: tt('@carrendvlogs/video/7370141096204061957'),
      taste: 'positive',
      year: 2024,
      by: 'creator',
      note: 'Buffet picks for this branch; packed by 5 PM.',
    },
    {
      platform: 'youtube',
      url: yt('bd0BsRaOtzk'),
      taste: 'positive',
      by: 'creator',
      note: 'Full tour of the all-you-can-eat hotpot, grill and buffet.',
    },
  ],
  'lan-hot-pot': [
    {
      platform: 'youtube',
      url: yt('ZFxk7Ytkdkg'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Tour of the new branch: unlimited hotpot, meat and seafood.',
    },
    {
      platform: 'tiktok',
      url: tt('@hieatsreych/video/7554330736581496072'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Among the new food spots worth trying, with grill and seafood options.',
    },
  ],
  'feast-and-fire': [
    {
      platform: 'youtube',
      url: yt('68hnp3xiblw'),
      taste: 'positive',
      by: 'creator',
      note: 'Lots of premium meat, veggies and seafood for a budget price.',
    },
  ],
  yakimix: [
    {
      platform: 'youtube',
      url: yt('uwPPOY1P5HA'),
      taste: 'positive',
      year: 2026,
      by: 'creator',
      note: 'Food tour of the SM North branch’s grill and sushi spread.',
    },
  ],
  'catch-n-hatch': [
    { platform: 'tiktok', url: tt('discover/buffet-in-north-edsa'), taste: 'positive', by: 'creator', note: 'Unlimited wings and seafood.' },
  ],

  // ───────── Desserts & drinks ─────────
  milksha: [
    {
      platform: 'tiktok',
      url: tt('@crucrukatchoo/video/7466006622658170120'),
      taste: 'rave',
      year: 2025,
      by: 'creator',
      note: '“Taiwan’s best milk tea,” finally in its own standalone store.',
    },
    {
      platform: 'tiktok',
      url: tt('@cathrena.chen/video/7474915815549062407'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Honest review of the concept store’s drinks.',
    },
    {
      platform: 'tiktok',
      url: tt('@forkspoonmanila/video/7481945723081067794'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'Ranks the best-selling drinks at this branch.',
    },
    {
      platform: 'tiktok',
      url: tt('@kris.from.brooklyn/video/7463707591743409416'),
      looks: 'positive',
      year: 2025,
      by: 'creator',
      note: 'A proper standalone store, down to a nice bathroom.',
    },
  ],
  'bebang-halo-halo': [
    {
      platform: 'tiktok',
      url: tt('@kris.from.brooklyn/video/7458471786301115656'),
      taste: 'positive',
      year: 2025,
      by: 'creator',
      note: 'The famous halo-halo, now beside Conti’s at The Block.',
    },
  ],
  'mochi-mama': [
    {
      platform: 'tiktok',
      url: tt('@mochimamaph/video/7536920764239416584'),
      taste: 'positive',
      year: 2025,
      by: 'brand',
      note: 'Mochi ice cream and cheesy 10-yen bread pitched as must-tries.',
    },
  ],
  'udders-ice-cream': [
    {
      platform: 'tiktok',
      url: tt('@cathrena.chen/video/7270082115235056901'),
      taste: 'positive',
      year: 2023,
      by: 'creator',
      note: 'Singapore’s #1 ice cream brand, now at SM North.',
    },
  ],
  'manila-creamery': [
    { platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'On SM North’s must-try sweet treats list.' },
  ],
  'the-buzz-ice-cream': [
    { platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'On SM North’s must-try sweet treats list.' },
  ],
  'hi-halo': [{ platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'On SM North’s must-try sweet treats list.' }],
  amici: [{ platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'Its gelato is on SM North’s must-try sweet treats list.' }],
  yogorino: [
    { platform: 'tiktok', url: SM_NORTH_SWEETS, taste: 'positive', year: 2024, by: 'mall', note: 'On SM North’s must-try sweet treats list.' },
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/summerdryyy/videos/sm-north-edsa-food-trip-must-try-food-when-in-sm-sm-foodhall-the-block-4th-level/4090922817859151/',
      taste: 'positive',
      by: 'creator',
      note: 'A must-try in a 192K-view food hall crawl.',
    },
  ],
  'liege-manila': [
    {
      platform: 'facebook',
      url: 'https://www.facebook.com/summerdryyy/videos/sm-north-edsa-food-trip-must-try-food-when-in-sm-sm-foodhall-the-block-4th-level/4090922817859151/',
      taste: 'positive',
      by: 'creator',
      note: 'A must-try in a 192K-view food hall crawl.',
    },
  ],
}
