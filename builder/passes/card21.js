/* Build 21-mirage-college/swap.json. */
const fs = require('fs');
const D = 'C:/Users/USER/Desktop/Website Template Library/21-mirage-college/';
const html = fs.readFileSync(D + 'index.html', 'utf8');

/* the monogram and the two-line wordmark, wherever they sit as a pair */
const brand = [];
const re = /<span class="mono-m" aria-hidden="true">M<\/span>\s*<span class="brand-txt">\s*<span class="brand-1">Mirage International<\/span>\s*<span class="brand-2">College of Beauty Therapy<\/span>\s*<\/span>/g;
let m;
while ((m = re.exec(html)) !== null) brand.push(m[0]);
if (!brand.length) throw new Error('no brand block found');

const U = (id, w) => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=80';

const card = {
  template: '21-mirage-college',
  title: 'Mirage College',
  industry: 'Education and training',
  covers: 'Colleges, training providers, driving and trade schools, academies, private tutors',
  _note: 'find is the exact literal that sits in index.html today. Whole strings only, longest find first.',

  _palettes: "Four approved sets of this template's own CSS variables. The dark olive ground is the design; the metal accent is what moves.",
  palettes: {
    'olive-gold': {
      'olive-900': '#0E1310', 'olive-850': '#141A14', 'olive-800': '#1A2117', 'olive-700': '#232B1F', 'olive-600': '#2E3728', 'olive-500': '#3C4735',
      paper: '#F6F2E9', 'paper-2': '#EFE9DB', 'paper-3': '#E6DECB', cream: '#F4EFE4', 'cream-2': '#E4DCCB',
      ink: '#1B211A', 'ink-2': '#3A4235', gold: '#BFA05A', 'gold-lt': '#D6BC80', 'gold-dk': '#9C7F3E'
    },
    'ink-rose': {
      'olive-900': '#120F11', 'olive-850': '#181416', 'olive-800': '#1F191C', 'olive-700': '#292227', 'olive-600': '#352C31', 'olive-500': '#443940',
      paper: '#F7F1F3', 'paper-2': '#EFE6EA', 'paper-3': '#E5D9DF', cream: '#F5EEF1', 'cream-2': '#E5D8DE',
      ink: '#1D171A', 'ink-2': '#403539', gold: '#C08A97', 'gold-lt': '#D8AAB4', 'gold-dk': '#9B6672'
    },
    'navy-brass': {
      'olive-900': '#0C1017', 'olive-850': '#11161F', 'olive-800': '#161D27', 'olive-700': '#1E2733', 'olive-600': '#283242', 'olive-500': '#344055',
      paper: '#F1F3F7', 'paper-2': '#E6EAF0', 'paper-3': '#D9DFE8', cream: '#F0F3F7', 'cream-2': '#DDE3EB',
      ink: '#161A1F', 'ink-2': '#343C46', gold: '#C0A45A', 'gold-lt': '#D8C083', 'gold-dk': '#9C823E'
    },
    'charcoal-sage': {
      'olive-900': '#101211', 'olive-850': '#161817', 'olive-800': '#1C1F1E', 'olive-700': '#252927', 'olive-600': '#303533', 'olive-500': '#3E4442',
      paper: '#F2F4F2', 'paper-2': '#E7EAE7', 'paper-3': '#DADEDA', cream: '#F1F4F1', 'cream-2': '#DFE3DF',
      ink: '#181A19', 'ink-2': '#373C39', gold: '#8FAE8C', 'gold-lt': '#B0C8AE', 'gold-dk': '#6C8A69'
    }
  },
  swatchKeys: { accent: 'gold', ink: 'olive-900', paper: 'paper' },

  adjust: {
    accent: {
      label: 'Accent',
      var: 'gold',
      also: {
        'gold-lt': 'color-mix(in srgb, {} 70%, #fff)',
        'gold-dk': 'color-mix(in srgb, {} 78%, #000)'
      }
    }
  },

  _brandTokens: 'Words belonging to this template, not to a client.',
  brandTokens: ['Mirage International', 'Mirage', 'mirage.ac.zw'],

  swaps: [
    { key: 'BUSINESS_NAME', find: 'Mirage International College', label: 'College name', maxChars: 32, required: true },
    { key: 'BRAND_SHORT', find: '<span class="brand-1">Mirage International</span>', format: '<span class="brand-1">{}</span>', label: 'Wordmark', maxChars: 24 },
    { key: 'BRAND_INITIAL', find: '<span class="mono-m" aria-hidden="true">M</span>', format: '<span class="mono-m" aria-hidden="true">{}</span>', label: 'Monogram letter', maxChars: 2 },
    { key: 'TAGLINE', find: '<span class="brand-2">College of Beauty Therapy</span>', format: '<span class="brand-2">{}</span>', label: 'Line under the wordmark', maxChars: 30 },
    { key: 'WHAT_THEY_DO', find: 'College of Beauty Therapy', label: 'What it is', maxChars: 32 },
    { key: 'CURTAIN_NAME', find: '<div class="intro-t">Mirage International</div>', format: '<div class="intro-t">{}</div>', label: 'Name on the opening curtain', maxChars: 26, optional: true },

    { key: 'PHONE', find: '+263 77 419 6280', label: 'Phone', maxChars: 20 },
    { key: 'PHONE_LINK', find: 'tel:+263774196280', format: 'tel:{}', label: 'Phone, dialling form', maxChars: 20, optional: true, hint: 'Worked out from the phone number if you leave it blank.' },
    { key: 'EMAIL', find: 'admissions@mirage.ac.zw', label: 'Email', maxChars: 40 },
    { key: 'ADDRESS', find: '14 Fifth Street', label: 'Address', maxChars: 40 },
    { key: 'CITY', find: 'Town centre', label: 'Area or city', maxChars: 22 },
    { key: 'HOURS', find: 'Mon–Fri 08:00–17:00', label: 'Opening hours', maxChars: 26 },

    { key: 'INTAKE_1', find: '5 October 2026', label: 'Next intake date', maxChars: 22, group: 'details' },
    { key: 'INTAKE_2', find: '1 February 2027', label: 'Second intake date', maxChars: 22, group: 'details' },
    { key: 'INTAKE_3', find: '17 October 2026', label: 'Third intake date', maxChars: 22, group: 'details' },
    { key: 'OPEN_DAY', find: '26 September', label: 'Open day date', maxChars: 22, group: 'details' },

    { key: 'FEE_1', find: 'US$2,000', label: 'Course 1 fee', maxChars: 12, group: 'details', hint: 'The design ships with sample figures. Change them before you send the link. The instalment rows are edited by clicking them on the page.' },
    { key: 'FEE_2', find: 'US$2,850', label: 'Course 2 fee', maxChars: 12, group: 'details' },
    { key: 'FEE_3', find: 'US$2,600', label: 'Course 3 fee', maxChars: 12, group: 'details' },
    { key: 'FEE_4', find: 'US$780', label: 'Course 4 fee', maxChars: 12, group: 'details' },
    { key: 'FEE_5', find: 'US$540', label: 'Course 5 fee', maxChars: 12, group: 'details' },

    { key: 'STAT_1_VALUE', find: 'data-count="412"', format: 'data-count="{}"', label: 'Graduates so far', type: 'number', maxChars: 8 },
    { key: 'STAT_2_VALUE', find: 'data-count="68400"', format: 'data-count="{}"', label: 'Client hours logged', type: 'number', maxChars: 8 }
  ],

  images: [
    { key: 'LOGO', find: brand, label: 'Logo', kind: 'logo', hint: 'Replaces the monogram and wordmark wherever they appear.', format: '<img class="brand-logo" src="{}" alt="">' },
    { key: 'HERO', find: U('1544161515-4ab6ce6db874', 2000), label: 'Hero photo', ratio: '16/9', search: 'beauty therapist massage treatment' },
    { key: 'COURSE_1', find: U('1540555700478-4be289fbecef', 1200), label: 'Course 1', ratio: '4/3', search: 'facial treatment salon' },
    { key: 'COURSE_2', find: U('1544161515-4ab6ce6db874', 1200), label: 'Course 2', ratio: '4/3', search: 'spa massage therapy' },
    { key: 'COURSE_3', find: U('1596462502278-27bfdc403348', 1200), label: 'Course 3', ratio: '4/3', search: 'skin analysis clinic' },
    { key: 'COURSE_4', find: U('1604654894610-df63bc536371', 1200), label: 'Course 4', ratio: '4/3', search: 'manicure nail technician' },
    { key: 'COURSE_5', find: U('1522337360788-8b13dee7a37e', 1200), label: 'Course 5', ratio: '4/3', search: 'eyelash extensions' },
    { key: 'SPA', find: U('1600334089648-b0d9d3028eb2', 1200), label: 'The teaching spa', ratio: '4/3', search: 'spa treatment room' },
    { key: 'RECEPTION', find: U('1519415943484-9fa1873496d4', 1000), label: 'Reception', ratio: '4/3', search: 'salon reception desk' },
    { key: 'GALLERY_1', find: U('1560066984-138dadb4c035', 1400), label: 'Gallery 1', ratio: '4/3', search: 'beauty training classroom' },
    { key: 'GALLERY_2', find: U('1512290923902-8a9f81dc236c', 1200), label: 'Gallery 2', ratio: '4/3', search: 'treatment room bed' },
    { key: 'GALLERY_3', find: U('1607779097040-26e80aa78e66', 1000), label: 'Gallery 3', ratio: '4/3', search: 'skin care products trolley' },
    { key: 'GALLERY_4', find: U('1522337094846-8a818192de1f', 1200), label: 'Gallery 4', ratio: '4/3', search: 'nail bar salon' },
    { key: 'GALLERY_5', find: U('1620331311520-246422fd82f9', 1200), label: 'Gallery 5', ratio: '4/3', search: 'spa wet room' },
    { key: 'GALLERY_6', find: U('1552693673-1bf958298935', 1000), label: 'Gallery 6', ratio: '4/3', search: 'beauty salon interior' },
    { key: 'GRADUATE', find: U('1573497019940-1c28c88b4f3e', 900), label: 'Graduate portrait', ratio: '1/1', search: 'portrait therapist' },
    { key: 'OPEN_DAY_PHOTO', find: U('1595476108010-b4d1f102b1b1', 1800), label: 'Open day photo', ratio: '16/9', search: 'open day students' }
  ]
};

fs.writeFileSync(D + 'swap.json', JSON.stringify(card, null, 2) + '\n');
console.log('swap.json written: ' + card.swaps.length + ' swaps, ' + card.images.length + ' images, ' + brand.length + ' brand blocks');
