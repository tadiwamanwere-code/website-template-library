/* Build 19-longrange-pharmacy/swap.json. */
const fs = require('fs');
const D = 'C:/Users/USER/Desktop/Website Template Library/19-longrange-pharmacy/';
const html = fs.readFileSync(D + 'index.html', 'utf8');

/* the wordmark and its sub, in the header and the footer */
const brand = [];
const re = /<span class="logo"><span class="word">long<i>range<\/i><i>\.<\/i><\/span><span class="sub">Pharmacy<\/span><\/span>/g;
let m;
while ((m = re.exec(html)) !== null) brand.push(m[0]);
if (brand.length !== 2) throw new Error('brand blocks: ' + brand.length);

const U = (id, w, h) => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&h=' + h + '&q=70';

const card = {
  template: '19-longrange-pharmacy',
  title: 'Long Range Pharmacy',
  industry: 'Shops and retail',
  covers: 'Pharmacies, health shops, opticians, veterinary, garden centres, any shop with a catalogue',
  _note: 'find is the exact literal that sits in index.html today. Whole strings only, longest find first.',

  _palettes: "Four approved sets of this template's own CSS variables. The green family is the brand colour; the coral is kept for offers only.",
  palettes: {
    'pharmacy-green': { green: '#12A85A', 'green-d': '#04783F', 'green-l': '#4CC787', pine: '#0B322C', 'pine-7': '#12463E', 'pine-9': '#062420', ink: '#24272A', muted: '#58615C', ground: '#F4F7F5', coral: '#F0644A', 'coral-d': '#D9503A', 'coral-soft': '#FCEDE8' },
    'clinic-blue':    { green: '#1273C4', 'green-d': '#0A5292', 'green-l': '#4CA1E0', pine: '#0B2436', 'pine-7': '#123246', 'pine-9': '#061722', ink: '#24272A', muted: '#586067', ground: '#F4F6F8', coral: '#F0644A', 'coral-d': '#D9503A', 'coral-soft': '#FCEDE8' },
    'herbal-olive':   { green: '#6E8C29', 'green-d': '#4E6618', 'green-l': '#9BB955', pine: '#222C12', 'pine-7': '#2F3B1B', 'pine-9': '#151B0A', ink: '#26281F', muted: '#5D6252', ground: '#F6F7F1', coral: '#D9702F', 'coral-d': '#B85A22', 'coral-soft': '#FBEFE6' },
    'warm-rose':      { green: '#B93C63', 'green-d': '#8E2445', 'green-l': '#D46E8E', pine: '#331522', 'pine-7': '#421D2C', 'pine-9': '#200C14', ink: '#2A2226', muted: '#645159', ground: '#F9F4F6', coral: '#D95F35', 'coral-d': '#B84A26', 'coral-soft': '#FBEDE6' }
  },
  swatchKeys: { accent: 'green', ink: 'pine', paper: 'ground' },

  adjust: {
    accent: {
      label: 'Brand colour',
      var: 'green',
      also: {
        'green-d': 'color-mix(in srgb, {} 72%, #000)',
        'green-l': 'color-mix(in srgb, {} 66%, #fff)'
      }
    }
  },

  _brandTokens: 'Words belonging to this template, not to a client.',
  brandTokens: ['Long Range Pharmacies', 'Long Range Pharmacy', 'longrange', 'Harare', 'Graniteside'],

  swaps: [
    { key: 'BUSINESS_NAME_PLURAL', find: 'Long Range Pharmacies', label: 'Name in the footer line', maxChars: 28, optional: true },
    { key: 'BUSINESS_NAME', find: 'Long Range Pharmacy', label: 'Shop name', maxChars: 26, required: true },
    { key: 'BRAND_SHORT', find: 'long<i>range</i>', format: '{}', label: 'Wordmark', maxChars: 16, hint: 'Set lower case in the design.' },
    { key: 'TAGLINE', find: '<span class="sub">Pharmacy</span>', format: '<span class="sub">{}</span>', label: 'Word under the wordmark', maxChars: 16 },
    { key: 'WHAT_THEY_DO', find: 'health shop &amp; dispensary', label: 'What they are', maxChars: 34 },

    { key: 'PHONE', find: '+263 77 160 0539', label: 'Phone', maxChars: 20 },
    { key: 'PHONE_LINK', find: 'tel:+263771600539', format: 'tel:{}', label: 'Phone, dialling form', maxChars: 20, optional: true, hint: 'Worked out from the phone number if you leave it blank.' },
    { key: 'PHONE_2', find: '+263 77 442 6597', label: 'Main branch, second line', maxChars: 20, optional: true },
    { key: 'PHONE_2_LINK', find: 'tel:+263774426597', format: 'tel:{}', label: 'Second line, dialling form', maxChars: 20, optional: true },
    { key: 'WHATSAPP', find: '+263 77 344 0533', label: 'WhatsApp number', maxChars: 20, optional: true },
    { key: 'WHATSAPP_LINK', find: 'wa.me/263773440533', format: 'wa.me/{}', label: 'WhatsApp, dialling form', maxChars: 20, optional: true },

    { key: 'BRANCH_1', find: 'Main branch', label: 'Branch 1 name', maxChars: 22 },
    { key: 'BRANCH_2', find: 'Second branch', label: 'Branch 2 name', maxChars: 22 },
    { key: 'BRANCH_3', find: 'Third branch', label: 'Branch 3 name', maxChars: 22 },
    { key: 'ADDRESS', find: 'Shop 3, Kelvin Corner', label: 'Branch 1 address', maxChars: 40 },
    { key: 'ADDRESS_2', find: '10 Highfield Junction', label: 'Branch 2 address', maxChars: 40, optional: true },
    { key: 'ADDRESS_3', find: 'Shop 5, Northside Mall', label: 'Branch 3 address', maxChars: 40, optional: true },
    { key: 'HOURS', find: '07:30–18:30', label: 'Opening hours', maxChars: 18 },
    { key: 'SOCIAL', find: '@yourpharmacy', label: 'Instagram handle', maxChars: 26, optional: true },

    { key: 'DELIVERY_FEE', find: 'Delivery $3 flat.', format: 'Delivery {} flat.', label: 'Delivery charge', maxChars: 12, group: 'details', hint: 'The design ships with a sample figure. Change it before you send the link.' },

    { key: 'STAT_1_VALUE', find: 'data-count="1180400"', format: 'data-count="{}"', label: 'Scripts dispensed', type: 'number', maxChars: 10 },
    { key: 'STAT_2_VALUE', find: 'data-count="22"', format: 'data-count="{}"', label: 'Years trading', type: 'number', maxChars: 8 },
    { key: 'STAT_3_VALUE', find: 'data-count="3"', format: 'data-count="{}"', label: 'Branches', type: 'number', maxChars: 8 },
    { key: 'STAT_4_VALUE', find: 'data-count="14"', format: 'data-count="{}"', label: 'Pharmacists on the floor', type: 'number', maxChars: 8 }
  ],

  images: [
    { key: 'LOGO', find: brand, label: 'Logo', kind: 'logo', hint: 'Replaces the wordmark in the header and the footer.', format: '<img class="brand-logo" src="{}" alt="">' },
    { key: 'HERO_1', find: U('1620916566398-39f1143ab7be', 760, 950), label: 'Hero, skin care', ratio: '4/5', search: 'skincare serum bottle' },
    { key: 'HERO_2', find: U('1596462502278-27bfdc4038e8', 900, 760), label: 'Hero, supplements', ratio: '6/5', search: 'protein supplement tub' },
    { key: 'HERO_3', find: U('1593095948071-474c5cc2989d', 900, 760), label: 'Hero, prescriptions', ratio: '6/5', search: 'pharmacist dispensing' },
    { key: 'PROMO_1', find: U('1512069772995-ec65ed45afd6', 1100, 850), label: 'Promo, large', ratio: '4/3', search: 'perfume and skincare flatlay' },
    { key: 'PROMO_2', find: U('1607619056574-7b8d3ee536b2', 760, 570), label: 'Promo, small', ratio: '4/3', search: 'natural protein powder' },
    { key: 'OFFER_1', find: U('1519689680058-324335c77eba', 760, 570), label: 'Offer 1', ratio: '4/3', search: 'face serum evening routine' },
    { key: 'OFFER_2', find: U('1556228720-195a672e8a03', 760, 570), label: 'Offer 2', ratio: '4/3', search: 'baby bath products' },
    { key: 'ABOUT', find: U('1631549916768-4119b2e5f926', 1000, 760), label: 'The dispensary', ratio: '4/3', search: 'pharmacy interior counter' }
  ]
};

fs.writeFileSync(D + 'swap.json', JSON.stringify(card, null, 2) + '\n');
console.log('swap.json written: ' + card.swaps.length + ' swaps, ' + card.images.length + ' images');
