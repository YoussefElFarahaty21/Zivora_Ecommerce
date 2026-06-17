import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

const P = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

// Extra gallery images per category (images 2–4)
const EXTRAS: Record<string, [string, string, string]> = {
  Electronics:    [P('electronics1'), P('electronics2'), P('electronics3')],
  Clothing:       [P('clothing1'),    P('clothing2'),    P('clothing3')],
  Books:          [P('books1'),       P('books2'),       P('books3')],
  'Home & Garden':[P('home1'),        P('home2'),        P('home3')],
  Sports:         [P('sports1'),      P('sports2'),      P('sports3')],
  Toys:           [P('toys1'),        P('toys2'),        P('toys3')],
  Beauty:         [P('beauty1'),      P('beauty2'),      P('beauty3')],
};

// Verified Unsplash URLs
const IMG = {
  // Electronics
  laptop:      'https://images.unsplash.com/photo-1496181206931-135228935ed8?w=400&h=400&fit=crop',
  iphone:      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop',
  headphones:  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  watch:       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  camera:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
  tablet:      'https://images.unsplash.com/photo-1544244015-0df4cec9d125?w=400&h=400&fit=crop',
  speaker:     'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  monitor:     'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
  // Clothing
  tshirt:      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  jacket:      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop',
  sneakers:    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  dress:       'https://images.unsplash.com/photo-1496747986635-d4d2f8cd4fd5?w=400&h=400&fit=crop',
  jeans:       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
  hoodie:      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop',
  // Home & Kitchen
  coffee:      'https://images.unsplash.com/photo-1495474472359-6f175b4a73ca?w=400&h=400&fit=crop',
  lamp:        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
  blender:     'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
  chair:       'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
  candle:      'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop',
  // Books
  book:        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
  notebook:    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
  // Sports
  yogamat:     'https://images.unsplash.com/photo-1544367654-df4f64d02619?w=400&h=400&fit=crop',
  dumbbells:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  waterbottle: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
};

const products = [
  // ─── ELECTRONICS ───────────────────────────────────────────────────────────
  { name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life, multipoint connection, and crystal-clear hands-free calling.',
    price: 17500, category: 'Electronics', stock: 38,
    imageUrl: IMG.headphones },

  { name: 'Apple Watch Series 9',
    description: 'Advanced health sensors including blood oxygen, ECG, and crash detection. Bright always-on Retina display. Water resistant 50m.',
    price: 21500, category: 'Electronics', stock: 25,
    imageUrl: IMG.watch },

  { name: 'MacBook Air M3 13"',
    description: 'Supercharged by M3 chip. Up to 18-hour battery, 8GB unified memory, Liquid Retina display. Fanless and completely silent.',
    price: 55000, category: 'Electronics', stock: 15,
    imageUrl: IMG.laptop },

  { name: 'iPhone 15 Pro',
    description: 'Titanium design with A17 Pro chip, 48MP camera, 5x optical zoom, customizable Action button, USB-C with USB 3 speeds.',
    price: 50000, category: 'Electronics', stock: 20,
    imageUrl: IMG.iphone },

  { name: 'Sony WF-1000XM5 Earbuds',
    description: 'Best-in-class noise cancellation, LDAC Hi-Res audio, 8-hour battery (24 total with case). IPX4 splash resistant.',
    price: 14000, category: 'Electronics', stock: 44,
    imageUrl: IMG.headphones },

  { name: 'Mechanical Gaming Keyboard',
    description: 'TKL keyboard with Cherry MX switches, per-key RGB, aircraft-grade aluminium frame. Detachable USB-C cable, PBT keycaps.',
    price: 7000, category: 'Electronics', stock: 60,
    imageUrl: IMG.monitor },

  { name: 'Sony Alpha A7 IV Camera',
    description: 'Full-frame mirrorless, 33MP sensor, real-time AF, 4K 60fps video, 5-axis IBIS. Professional grade.',
    price: 125000, category: 'Electronics', stock: 8,
    imageUrl: IMG.camera },

  { name: 'JBL Charge 5 Bluetooth Speaker',
    description: '20-hour playtime, IP67 waterproof, built-in powerbank, bold JBL Pro Sound. PartyBoost compatible.',
    price: 9000, category: 'Electronics', stock: 55,
    imageUrl: IMG.speaker },

  { name: 'LG 27" 4K UHD Monitor',
    description: 'IPS panel, 3840×2160, 99% sRGB, HDR10, USB-C PD 96W. Ergonomic stand with height, tilt and swivel.',
    price: 27500, category: 'Electronics', stock: 18,
    imageUrl: IMG.monitor },

  { name: 'Logitech MX Master 3S Mouse',
    description: 'MagSpeed electromagnetic scrolling, 8K DPI, quiet clicks, multi-device connectivity. 70-day battery life.',
    price: 5000, category: 'Electronics', stock: 72,
    imageUrl: IMG.monitor },

  { name: 'iPad Pro 12.9" M2',
    description: 'M2 chip, Liquid Retina XDR, Apple Pencil hover, Wi-Fi 6E, Thunderbolt. ProRes video recording.',
    price: 55000, category: 'Electronics', stock: 12,
    imageUrl: IMG.tablet },

  { name: 'Anker 15W Wireless Charging Pad',
    description: '15W Qi fast charger. Slim profile, LED indicator, temperature control, anti-slip surface. Charges through cases up to 5mm.',
    price: 1800, category: 'Electronics', stock: 110,
    imageUrl: IMG.iphone },

  { name: 'GoPro HERO12 Black',
    description: '5.3K60 video, 27MP photos, HyperSmooth 6.0. Waterproof to 33ft without housing.',
    price: 20000, category: 'Electronics', stock: 22,
    imageUrl: IMG.camera },

  { name: 'Nintendo Switch OLED',
    description: 'Play at home or on the go with a vibrant 7" OLED screen, enhanced audio, wide adjustable stand and 64GB storage.',
    price: 17500, category: 'Electronics', stock: 30,
    imageUrl: IMG.tablet },

  { name: '12-in-1 USB-C Hub',
    description: '4K HDMI, 3×USB-A, 2×USB-C, SD card reader, Ethernet, 100W PD pass-through in a compact aluminium body.',
    price: 3500, category: 'Electronics', stock: 85,
    imageUrl: IMG.monitor },

  // ─── CLOTHING ──────────────────────────────────────────────────────────────
  { name: 'Premium Oversized Hoodie',
    description: 'Ultra-soft 400GSM cotton fleece, relaxed fit, kangaroo pocket, ribbed cuffs. Preshrunk garment-dyed.',
    price: 2400, category: 'Clothing', stock: 140,
    imageUrl: IMG.hoodie },

  { name: 'Nike Air Max 270 Sneakers',
    description: 'Max Air heel cushioning, breathable mesh upper, rubber outsole. Iconic everyday design.',
    price: 4500, category: 'Clothing', stock: 65,
    imageUrl: IMG.sneakers },

  { name: 'Genuine Leather Bomber Jacket',
    description: 'Full-grain cowhide leather, wool-blend lining, YKK zippers, ribbed collar and cuffs. Gets better with age.',
    price: 11700, category: 'Clothing', stock: 14,
    imageUrl: IMG.jacket },

  { name: 'Essential White T-Shirt',
    description: 'Premium 200GSM Supima cotton, tailored fit, crew neck, pre-shrunk, anti-fade, reinforced seams.',
    price: 900, category: 'Clothing', stock: 300,
    imageUrl: IMG.tshirt },

  { name: 'Slim Fit Stretch Jeans',
    description: 'Italian denim with 2% elastane. Selvedge edges, YKK hardware, fading that improves with wear.',
    price: 2700, category: 'Clothing', stock: 95,
    imageUrl: IMG.jeans },

  { name: 'Floral Midi Dress',
    description: 'Lightweight viscose floral-print wrap dress with adjustable tie-waist and flutter sleeves.',
    price: 2100, category: 'Clothing', stock: 55,
    imageUrl: IMG.dress },

  { name: 'Vintage Baseball Cap',
    description: 'Unstructured 6-panel cap, adjustable brass buckle, pre-curved brim. 100% washed cotton canvas.',
    price: 1050, category: 'Clothing', stock: 180,
    imageUrl: IMG.tshirt },

  { name: 'Chelsea Leather Boots',
    description: 'Handcrafted full-grain leather, elastic side panels, pull tabs, rubber lug sole. Goodyear welt.',
    price: 6600, category: 'Clothing', stock: 28,
    imageUrl: IMG.sneakers },

  { name: 'Cashmere Crew Neck Sweater',
    description: 'Grade-A Mongolian cashmere, classic crew neck fit, anti-pilling treated. Dry clean or gentle machine wash.',
    price: 5400, category: 'Clothing', stock: 40,
    imageUrl: IMG.hoodie },

  { name: 'Double-Breasted Trench Coat',
    description: 'Water-repellent gabardine, storm flap, D-ring belt, removable lining. A timeless investment piece.',
    price: 9000, category: 'Clothing', stock: 20,
    imageUrl: IMG.jacket },

  { name: 'Athletic Running Shorts',
    description: 'Lightweight 4-way stretch, built-in liner, side pockets, reflective details. 5" inseam.',
    price: 1350, category: 'Clothing', stock: 120,
    imageUrl: IMG.tshirt },

  { name: 'Merino Wool Crew Socks (3-Pack)',
    description: 'Merino wool, arch support, cushioned sole, seamless toe. Odour-resistant, machine washable. 3 pairs.',
    price: 750, category: 'Clothing', stock: 250,
    imageUrl: IMG.sneakers },

  { name: 'Linen Button-Down Shirt',
    description: 'Relaxed-fit linen, mother-of-pearl buttons, chest pocket, side vents. Breathable and wrinkle-resistant.',
    price: 1800, category: 'Clothing', stock: 88,
    imageUrl: IMG.tshirt },

  // ─── BOOKS ─────────────────────────────────────────────────────────────────
  { name: 'Clean Code by Robert C. Martin',
    description: 'Best practices for writing readable, maintainable, efficient code. Required reading for every developer.',
    price: 525, category: 'Books', stock: 200,
    imageUrl: IMG.book },

  { name: 'Atomic Habits by James Clear',
    description: 'Build good habits and break bad ones. Over 10 million copies sold. Strategies backed by science.',
    price: 285, category: 'Books', stock: 300,
    imageUrl: IMG.notebook },

  { name: 'Sapiens: A Brief History of Humankind',
    description: 'Harari explores how biology and history defined us. A sweeping journey through human history.',
    price: 255, category: 'Books', stock: 180,
    imageUrl: IMG.book },

  { name: 'The Design of Everyday Things',
    description: "Don Norman's classic on user-centred design. Indispensable for designers and engineers.",
    price: 345, category: 'Books', stock: 150,
    imageUrl: IMG.notebook },

  { name: 'Rich Dad Poor Dad',
    description: 'Kiyosaki shares lessons about money, investing, and wealth from his two father figures.',
    price: 225, category: 'Books', stock: 220,
    imageUrl: IMG.book },

  { name: 'Thinking, Fast and Slow',
    description: "Kahneman's exploration of System 1 and System 2 thinking and how they shape decisions.",
    price: 270, category: 'Books', stock: 160,
    imageUrl: IMG.notebook },

  { name: 'The Lean Startup',
    description: 'Build-Measure-Learn: the revolutionary approach to building businesses adopted by startups worldwide.',
    price: 300, category: 'Books', stock: 130,
    imageUrl: IMG.book },

  { name: 'The Pragmatic Programmer',
    description: 'Timeless advice on craft, tools, and habits that help developers go from journeyman to master.',
    price: 600, category: 'Books', stock: 110,
    imageUrl: IMG.notebook },

  // ─── HOME & GARDEN ─────────────────────────────────────────────────────────
  { name: 'Minimalist Adjustable Desk Lamp',
    description: 'LED, 5 colour temps, stepless dimming, 360° flexible arm, USB-A charging port. 50,000-hour lifespan.',
    price: 2100, category: 'Home & Garden', stock: 80,
    imageUrl: IMG.lamp },

  { name: 'Handcrafted Pour-Over Coffee Set',
    description: 'Borosilicate glass dripper, bamboo stand, 600ml carafe, 40 paper filters. Dishwasher-safe.',
    price: 2800, category: 'Home & Garden', stock: 45,
    imageUrl: IMG.coffee },

  { name: 'Matte Ceramic Plant Pot Set (3 pcs)',
    description: 'Handmade 4", 6", 8" matte ceramic pots in earth tones. Drainage hole + matching saucer.',
    price: 1575, category: 'Home & Garden', stock: 65,
    imageUrl: IMG.chair },

  { name: 'Luxury Soy Wax Candle',
    description: '300g soy wax, cedarwood & vanilla scent. 55-hour burn, cotton wick, reusable glass vessel.',
    price: 1365, category: 'Home & Garden', stock: 95,
    imageUrl: IMG.candle },

  { name: 'Memory Foam Body Pillow',
    description: 'Shredded memory foam, bamboo-derived cover, adjustable fill, hypoallergenic. Machine-washable cover.',
    price: 2450, category: 'Home & Garden', stock: 55,
    imageUrl: IMG.chair },

  { name: 'High-Speed Professional Blender',
    description: '1800W, 6 hardened steel blades. Crushes ice, blends smoothies. 64oz BPA-free jar, self-cleaning.',
    price: 5250, category: 'Home & Garden', stock: 35,
    imageUrl: IMG.blender },

  { name: 'Smart HEPA Air Purifier',
    description: '500 sq ft coverage. 3-stage HEPA, 99.97% particle removal. Auto mode, air quality sensor, sleep mode.',
    price: 7000, category: 'Home & Garden', stock: 28,
    imageUrl: IMG.blender },

  { name: 'Non-Stick Cookware Set (5 pcs)',
    description: 'Hard-anodised aluminium, PFOA-free coating, riveted handles, glass lids. Oven-safe 400°F.',
    price: 4550, category: 'Home & Garden', stock: 40,
    imageUrl: IMG.blender },

  { name: '15lb Weighted Blanket',
    description: 'Glass-bead filling, breathable cotton shell, duvet-style cover. Reduces anxiety and improves sleep.',
    price: 3150, category: 'Home & Garden', stock: 50,
    imageUrl: IMG.chair },

  { name: 'Bamboo Desk Organizer',
    description: 'Modular bamboo, 7 compartments for pens, cables, notebooks, phones. Lightweight, eco-friendly.',
    price: 1155, category: 'Home & Garden', stock: 90,
    imageUrl: IMG.lamp },

  // ─── SPORTS ────────────────────────────────────────────────────────────────
  { name: 'Premium Natural Rubber Yoga Mat',
    description: '6mm natural rubber, alignment lines, superior grip, antimicrobial coating. Includes carrying strap.',
    price: 2070, category: 'Sports', stock: 90,
    imageUrl: IMG.yogamat },

  { name: 'PowerBlock Adjustable Dumbbells',
    description: 'Replace 16 pairs in one compact set. 5–50 lbs quick-change. Urethane-coated steel.',
    price: 9000, category: 'Sports', stock: 18,
    imageUrl: IMG.dumbbells },

  { name: 'Hydro Flask 32oz Water Bottle',
    description: 'TempShield insulation: cold 24h, hot 12h. 18/8 stainless steel, BPA-free, powder coat, Flex Cap.',
    price: 1500, category: 'Sports', stock: 120,
    imageUrl: IMG.waterbottle },

  { name: 'Resistance Band Set (5 levels)',
    description: 'Latex-free fabric bands in 5 progressive levels. Anti-slip, wide fit, portable carry bag.',
    price: 900, category: 'Sports', stock: 150,
    imageUrl: IMG.dumbbells },

  { name: 'Speed Jump Rope Pro',
    description: 'Ball-bearing rope, adjustable 10ft cable, foam grips, counter. Boxing, HIIT, competitive.',
    price: 750, category: 'Sports', stock: 200,
    imageUrl: IMG.dumbbells },

  { name: 'Road Bike Helmet MIPS',
    description: '25 vents, aerodynamic shell, Fidlock magnetic buckle, LED tail light. CPSC + CE EN1078 certified.',
    price: 3600, category: 'Sports', stock: 32,
    imageUrl: IMG.waterbottle },

  { name: 'Pro Sports Gym Bag 40L',
    description: '600D polyester, shoe compartment, wet pocket, laptop sleeve, water bottle pocket.',
    price: 1800, category: 'Sports', stock: 75,
    imageUrl: IMG.waterbottle },

  { name: 'High-Density Foam Roller',
    description: '13" EPP foam, textured surface for deep-tissue massage. 300 lb capacity. Includes exercise guide.',
    price: 1050, category: 'Sports', stock: 100,
    imageUrl: IMG.yogamat },

  { name: 'Doorframe Pull-Up Bar',
    description: 'No-screw, fits 24–32" doorframes. 330 lb rated. Foam grips, multiple grip positions.',
    price: 1200, category: 'Sports', stock: 85,
    imageUrl: IMG.dumbbells },

  { name: 'Smart Fitness Tracker Band',
    description: '24/7 HR, SpO2, sleep tracking, 5ATM, 14-day battery. 20+ workout modes, smartphone notifications.',
    price: 2400, category: 'Sports', stock: 60,
    imageUrl: IMG.watch },

  { name: 'Insulated Gym Protein Shaker',
    description: '700ml BPA-free, stainless mixing ball, leak-proof lid, carry loop, powder compartment. Dishwasher-safe.',
    price: 600, category: 'Sports', stock: 160,
    imageUrl: IMG.waterbottle },

  // ─── TOYS ──────────────────────────────────────────────────────────────────
  { name: 'LEGO Architecture Skyline Set',
    description: '744-piece skyline with iconic landmarks. Ages 12+. Detailed instructions and backstory booklet.',
    price: 1800, category: 'Toys', stock: 45,
    imageUrl: IMG.book },

  { name: 'Strategy Board Game: Catan',
    description: 'Settlement-building for 3–4 players. Modular hex board, new island every game.',
    price: 1350, category: 'Toys', stock: 55,
    imageUrl: IMG.notebook },

  { name: 'RC Off-Road Truck 1:16',
    description: '4WD, 2.4GHz control, independent suspension, 40+ km/h. LiPo battery included.',
    price: 2400, category: 'Toys', stock: 30,
    imageUrl: IMG.camera },

  { name: 'Mega Building Blocks Set (500 pcs)',
    description: 'Oversized STEM blocks in 10 colours. Fine motor skills, creativity. Ages 3+. BPA-free.',
    price: 1050, category: 'Toys', stock: 70,
    imageUrl: IMG.book },

  { name: '1000-Piece Panoramic Jigsaw Puzzle',
    description: 'Mountain landscape on recycled board, linen finish. Completed size: 70×50 cm.',
    price: 690, category: 'Toys', stock: 80,
    imageUrl: IMG.notebook },

  { name: 'Kids Science Lab Kit',
    description: '30+ STEM experiments in chemistry, physics and biology. Goggles, lab coat, beakers, guide. Ages 8+.',
    price: 1500, category: 'Toys', stock: 40,
    imageUrl: IMG.book },

  // ─── BEAUTY ────────────────────────────────────────────────────────────────
  { name: 'Vitamin C + Hyaluronic Acid Serum',
    description: '20% Vitamin C, ferulic acid stabiliser. Brightens, firms, hydrates. 30ml, all skin types.',
    price: 1650, category: 'Beauty', stock: 115,
    imageUrl: IMG.candle },

  { name: 'Luxury Botanical Perfume Set',
    description: 'Three 30ml EDPs with 100% natural extracts. Jasmine & Sandalwood · Cedar & Bergamot · Rose & Oud.',
    price: 3600, category: 'Beauty', stock: 40,
    imageUrl: IMG.candle },

  { name: 'Velvet Matte Lipstick Set (6 Shades)',
    description: 'Long-wear matte with Vitamin E & argan oil. 6 curated shades. Cruelty-free, vegan.',
    price: 1290, category: 'Beauty', stock: 85,
    imageUrl: IMG.candle },

  { name: 'Deep Hydration Sheet Mask (10-Pack)',
    description: 'Korean beauty masks with hyaluronic acid, niacinamide, green tea. Plump skin in 20 minutes.',
    price: 750, category: 'Beauty', stock: 200,
    imageUrl: IMG.candle },

  { name: 'Retinol Night Repair Cream',
    description: '0.3% encapsulated retinol, peptides, ceramides. Reduces fine lines, evens tone. 50ml, fragrance-free.',
    price: 1950, category: 'Beauty', stock: 70,
    imageUrl: IMG.candle },

  { name: '18-Shade Pro Eyeshadow Palette',
    description: '12 mattes + 6 shimmers, zero fallout, long-wear. Dual-ended brush included. Cruelty-free.',
    price: 1500, category: 'Beauty', stock: 60,
    imageUrl: IMG.candle },

  { name: 'Hair Growth Biotin Serum',
    description: 'Biotin, caffeine & peptides. Reduces hair loss, promotes new growth. 60ml dropper bottle.',
    price: 1350, category: 'Beauty', stock: 90,
    imageUrl: IMG.candle },

  { name: 'Rose Quartz Facial Roller',
    description: 'Dual-ended rose quartz roller. Reduces puffiness, aids absorption. Ergonomic handle + velvet pouch.',
    price: 900, category: 'Beauty', stock: 130,
    imageUrl: IMG.candle },

  { name: 'Artisan Natural Soap Set (6 bars)',
    description: 'Cold-process bars with shea butter, coconut oil, essential oils. Lavender · Eucalyptus · Citrus · Charcoal · Rose · Oatmeal.',
    price: 1110, category: 'Beauty', stock: 100,
    imageUrl: IMG.candle },
];

async function clearCollection(collectionName: string) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) {
    console.log(`  Collection "${collectionName}" is already empty.`);
    return;
  }
  const batchSize = 400;
  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const batch = db.batch();
    snapshot.docs.slice(i, i + batchSize).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  console.log(`  Cleared ${snapshot.docs.length} documents from "${collectionName}"`);
}

async function seed() {
  console.log('Starting database seed...\n');
  console.log('Step 1: Clearing existing products...');
  await clearCollection('products');

  console.log('\nStep 2: Seeding ' + products.length + ' products...');
  const batchSize = 400;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = db.batch();
    products.slice(i, i + batchSize).forEach((p) => {
      const docRef = db.collection('products').doc();
      const extras = EXTRAS[p.category] || [p.imageUrl, p.imageUrl, p.imageUrl];
      batch.set(docRef, {
        ...p,
        images: [p.imageUrl, ...extras],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
    console.log('  Batch ' + (Math.floor(i / batchSize) + 1) + ': added ' + products.slice(i, i + batchSize).length + ' products');
  }

  console.log('\nDone! ' + products.length + ' products seeded successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
