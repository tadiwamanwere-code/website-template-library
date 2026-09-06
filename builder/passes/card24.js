/* Build 24-safeway-furniture/swap.json. The two brand blocks come out of
   the file itself so the find strings cannot drift. */
const fs = require('fs');
const DIR = 'C:/Users/USER/Desktop/Website Template Library/24-safeway-furniture/';
const html = fs.readFileSync(DIR + 'index.html', 'utf8');

const brand = [];
const re = /<span class="brand-mark" aria-hidden="true">[\s\S]*?<\/span>\s*<span class="brand-word"><b>SAFEWAY<\/b><i>FURNITURE<\/i><\/span>/g;
let m;
while ((m = re.exec(html)) !== null) brand.push(m[0]);
if (brand.length !== 2) throw new Error('expected 2 brand blocks, found ' + brand.length);

const img = n => 'https://images.unsplash.com/photo-' + n + '?auto=format&fit=crop&w=';

const card = {
  template: '24-safeway-furniture',
  title: 'Safeway Furniture',
  industry: 'Making and fitting',
  covers: 'Joiners, kitchen fitters, shopfitters, furniture makers, glaziers, flooring, blinds',
  _note: 'find is the exact literal that sits in index.html today. Whole strings only, longest find first.',

  _palettes: "Four approved sets of this template's own CSS variables. The deep ground is the design; the accent and the ground family move together.",
  palettes: {
    'midnight-blue': {
      'navy-950': '#070C16', 'navy-900': '#0A1120', 'navy-860': '#0D1526', 'navy-820': '#111B2F',
      'navy-780': '#16233C', 'navy-720': '#1D2C49',
      paper: '#EDF1F8', mute: '#94A3BF', 'mute-2': '#6A7A97',
      accent: '#8FB4F0', 'accent-deep': '#5F84C4', ink: '#0A1120'
    },
    'forest-green': {
      'navy-950': '#060F0B', 'navy-900': '#091510', 'navy-860': '#0C1A14', 'navy-820': '#10231A',
      'navy-780': '#152D22', 'navy-720': '#1C3A2C',
      paper: '#EDF5F0', mute: '#95BFA8', 'mute-2': '#6B9781',
      accent: '#8FE0AF', 'accent-deep': '#5FAF7F', ink: '#091510'
    },
    'walnut-amber': {
      'navy-950': '#120C06', 'navy-900': '#1B1309', 'navy-860': '#21180C', 'navy-820': '#2B1F10',
      'navy-780': '#372815', 'navy-720': '#46341C',
      paper: '#F6EFE6', mute: '#C3A98C', 'mute-2': '#9A8267',
      accent: '#E8B268', 'accent-deep': '#B8843F', ink: '#1B1309'
    },
    'graphite-red': {
      'navy-950': '#0B0B0C', 'navy-900': '#111113', 'navy-860': '#161618', 'navy-820': '#1D1D20',
      'navy-780': '#26262A', 'navy-720': '#313136',
      paper: '#EFEFF1', mute: '#A6A6AC', 'mute-2': '#7C7C84',
      accent: '#F08F7E', 'accent-deep': '#C45F4C', ink: '#111113'
    }
  },
  swatchKeys: { accent: 'accent', ink: 'navy-900', paper: 'paper' },

  adjust: {
    accent: {
      label: 'Accent',
      var: 'accent',
      also: { 'accent-deep': 'color-mix(in srgb, {} 72%, #000)' }
    }
  },

  _brandTokens: 'Words belonging to this template, not to a client.',
  brandTokens: ['Safeway Furniture', 'SAFEWAY', 'Safeway', 'safewayfurniture', 'Greendale', 'Harare'],

  swaps: [
    { key: 'BUSINESS_NAME', find: 'Safeway Furniture', label: 'Business name', maxChars: 26, required: true },
    { key: 'BRAND_SHORT', find: '<b>SAFEWAY</b>', format: '<b>{}</b>', label: 'Short name (the wordmark)', maxChars: 12, hint: 'Set in capitals in the design.' },
    { key: 'TAGLINE', find: '<i>FURNITURE</i>', format: '<i>{}</i>', label: 'Word beside the wordmark', maxChars: 14 },
    { key: 'WHAT_THEY_DO', find: 'Home and office furniture', label: 'What they make', maxChars: 34 },
    { key: 'HERO_LINE', find: 'Built to fit<br>your space.', label: 'Hero line (a br splits the two lines)', maxChars: 30 },
    { key: 'CITY', find: 'Greendale', label: 'Area or city', maxChars: 20 },
    { key: 'PHONE', find: '+263 772 868 870', label: 'Phone', maxChars: 20 },
    { key: 'PHONE_LINK', find: 'tel:+263772868870', format: 'tel:{}', label: 'Phone, dialling form', maxChars: 20, optional: true, hint: 'Worked out from the phone number if you leave it blank.' },
    { key: 'PHONE_2', find: '+263 242 495 210', label: 'Second phone', maxChars: 20, optional: true },
    { key: 'PHONE_2_LINK', find: 'tel:+263242495210', format: 'tel:{}', label: 'Second phone, dialling form', maxChars: 20, optional: true },
    { key: 'EMAIL', find: 'quotes@safewayfurniture.co.zw', label: 'Email', maxChars: 40 },
    { key: 'ADDRESS', find: '34 Amby Drive, Greendale, Harare', label: 'Showroom address', maxChars: 44 },
    { key: 'ADDRESS_2', find: 'Stand 7, Martin Drive', label: 'Workshop address', maxChars: 40, optional: true },
    { key: 'HOURS', find: 'Mon–Fri 07:30–17:00 &middot; Sat 08:00–13:00', label: 'Opening hours', maxChars: 44 },
    { key: 'FOUNDED', find: 'Established 2012', format: 'Established {}', label: 'Year established', maxChars: 8, optional: true },
    { key: 'SINCE', find: 'since 2012', format: 'since {}', label: 'Trading since', maxChars: 8, optional: true },
    { key: 'FOOTER_WORD', find: '<div class="foot-word" aria-hidden="true">BUILT TO FIT</div>', format: '<div class="foot-word" aria-hidden="true">{}</div>', label: 'The big word in the footer', maxChars: 18, optional: true },

    { key: 'PRICE_KITCHEN', find: 'from $2,850', label: 'Kitchens, from', maxChars: 34, group: 'details', hint: 'The design ships with a sample figure. Change it before you send the link.' },
    { key: 'PRICE_WARDROBE', find: 'from $980', label: 'Wardrobes, from', maxChars: 34, group: 'details' },
    { key: 'PRICE_OFFICE', find: 'from $640', label: 'Office furniture, from', maxChars: 34, group: 'details' },
    { key: 'PRICE_RETAIL', find: 'from $1,450', label: 'Shopfitting, from', maxChars: 34, group: 'details' },

    { key: 'STAT_1_VALUE', find: 'data-count="1240"', format: 'data-count="{}"', label: 'Installs completed', type: 'number', maxChars: 8 },
    { key: 'STAT_2_VALUE', find: 'data-count="13"', format: 'data-count="{}"', label: 'Years trading', type: 'number', maxChars: 8 },
    { key: 'STAT_3_VALUE', find: 'data-count="26"', format: 'data-count="{}"', label: 'Average lead time, working days', type: 'number', maxChars: 8 },
    { key: 'STAT_4_VALUE', find: 'data-count="1800"', format: 'data-count="{}"', label: 'Workshop floor, square metres', type: 'number', maxChars: 8 }
  ],

  images: [
    {
      key: 'LOGO', find: brand, label: 'Logo', kind: 'logo',
      hint: 'Replaces the mark and wordmark, in the header and the footer.',
      format: '<img class="brand-logo" src="{}" alt="">'
    },
    { key: 'HERO', find: img('1556909212-d5b604d0c90d') + '2400&q=80', label: 'Hero photo', ratio: '16/9', search: 'fitted kitchen interior' },
    { key: 'WORKSHOP_1', find: img('1600607687939-ce8a6c25118c') + '1400&q=80', label: 'Workshop 1', ratio: '4/3', search: 'joinery workshop' },
    { key: 'WORKSHOP_2', find: img('1497366216548-37526070297c') + '1400&q=80', label: 'Workshop 2', ratio: '4/3', search: 'office furniture' },
    { key: 'WORKSHOP_3', find: img('1580901368919-7738efb0f87e') + '1400&q=80', label: 'Workshop 3', ratio: '4/3', search: 'cabinet maker measuring' },
    { key: 'WORKSHOP_4', find: img('1567016432779-094069958ea5') + '1400&q=80', label: 'Workshop 4', ratio: '4/3', search: 'furniture spray finishing' },
    { key: 'REVEAL_CLOSED', find: img('1616486338812-3dadae4b4ace') + '1800&q=80', label: 'Fronts closed', ratio: '16/10', search: 'closed kitchen cabinets' },
    { key: 'REVEAL_OPEN', find: img('1595428774223-ef52624120d2') + '1800&q=80', label: 'Fronts open', ratio: '16/10', search: 'open kitchen drawers' },
    { key: 'ROOM_1', find: img('1556911220-bff31c812dba') + '1400&q=80', label: 'Kitchens', ratio: '4/3', search: 'fitted kitchen' },
    { key: 'ROOM_2', find: img('1616627561950-9f746e330187') + '1400&q=80', label: 'Wardrobes', ratio: '4/3', search: 'fitted wardrobe' },
    { key: 'ROOM_3', find: img('1568992687947-868a62a9f521') + '1400&q=80', label: 'Office furniture', ratio: '4/3', search: 'office desk fitted' },
    { key: 'ROOM_4', find: img('1441986300917-64674bd600d8') + '1400&q=80', label: 'Shopfitting', ratio: '4/3', search: 'retail shop fit out' },
    { key: 'WORK_1', find: img('1584622650111-993a426fbf0a') + '1600&q=80', label: 'Recent work 1', ratio: '3/2', search: 'handleless kitchen' },
    { key: 'WORK_2', find: img('1600566753190-17f0baa2a6c3') + '1400&q=80', label: 'Recent work 2', ratio: '4/3', search: 'walk in wardrobe' },
    { key: 'WORK_3', find: img('1604709177225-055f99402ea3') + '1400&q=80', label: 'Recent work 3', ratio: '4/3', search: 'pantry scullery' },
    { key: 'WORK_4', find: img('1524230572899-a752b3835840') + '1600&q=80', label: 'Recent work 4', ratio: '3/2', search: 'reception desk' },
    { key: 'WORK_5', find: img('1615529182904-14819c35db37') + '1400&q=80', label: 'Recent work 5', ratio: '4/3', search: 'boardroom table' },
    { key: 'WORK_6', find: img('1503174971373-b1f69850bded') + '1600&q=80', label: 'Recent work 6', ratio: '3/2', search: 'pharmacy shelving' }
  ]
};

fs.writeFileSync(DIR + 'swap.json', JSON.stringify(card, null, 2) + '\n');
console.log('swap.json written: ' + card.swaps.length + ' swaps, ' + card.images.length + ' images');
