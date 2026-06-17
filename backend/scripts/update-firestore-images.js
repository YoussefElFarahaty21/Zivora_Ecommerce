const fs = require('fs');
const path = require('path');

const COLLECTION_NAME = 'products';

// JSON name (product-images.json) → exact Firestore name
const NAME_OVERRIDES = {
  'Luxury Soy Wax Candle cedarwood vanilla': 'Luxury Soy Wax Candle',
  'Memory Foam Body Pillow bamboo cover': 'Memory Foam Body Pillow',
  'High-Speed Professional Blender 1800W': 'High-Speed Professional Blender',
  'Smart HEPA Air Purifier 500 sq ft': 'Smart HEPA Air Purifier',
  'Non-Stick Cookware Set 5 piece': 'Non-Stick Cookware Set (5 pcs)',
  'Premium Natural Rubber Yoga Mat 6mm': 'Premium Natural Rubber Yoga Mat',
  'PowerBlock Adjustable Dumbbells 5-50 lbs': 'PowerBlock Adjustable Dumbbells',
  'Speed Jump Rope Pro ball bearing': 'Speed Jump Rope Pro',
  'High-Density Foam Roller 13 inch': 'High-Density Foam Roller',
  'Doorframe Pull-Up Bar no screw': 'Doorframe Pull-Up Bar',
  'Smart Fitness Tracker Band heart rate SpO2': 'Smart Fitness Tracker Band',
  'Insulated Gym Protein Shaker 700ml': 'Insulated Gym Protein Shaker',
  'Catan Board Game': 'Strategy Board Game: Catan',
  'RC Off-Road Truck 1:16 4WD': 'RC Off-Road Truck 1:16',
  'Mega Building Blocks Set 500 pieces toddler': 'Mega Building Blocks Set (500 pcs)',
  '1000-Piece Panoramic Jigsaw Puzzle mountain': '1000-Piece Panoramic Jigsaw Puzzle',
  'Kids Science Lab Kit STEM 30 experiments': 'Kids Science Lab Kit',
  'Vitamin C Hyaluronic Acid Face Serum 30ml': 'Vitamin C + Hyaluronic Acid Serum',
  'Luxury Botanical Perfume Gift Set 3 x 30ml': 'Luxury Botanical Perfume Set',
  'Korean Sheet Face Mask 10-Pack hyaluronic acid': 'Deep Hydration Sheet Mask (10-Pack)',
  'Retinol Night Repair Face Cream 50ml': 'Retinol Night Repair Cream',
  '18-Shade Pro Eyeshadow Palette matte shimmer': '18-Shade Pro Eyeshadow Palette',
  'Hair Growth Biotin Serum 60ml dropper': 'Hair Growth Biotin Serum',
  'Rose Quartz Facial Roller dual ended': 'Rose Quartz Facial Roller',
  'Artisan Natural Soap Set 6 bars shea butter': 'Artisan Natural Soap Set (6 bars)',
};

const SCRIPT_DIR = __dirname;
const SERVICE_ACCOUNT_PATH = path.join(SCRIPT_DIR, 'serviceAccountKey.json');
const ENV_PATH = path.join(SCRIPT_DIR, '..', '.env');
const PRODUCT_IMAGES_PATH = path.join(SCRIPT_DIR, 'product-images.json');
const FAILED_PRODUCTS_PATH = path.join(SCRIPT_DIR, 'failed-products.json');
const FIRESTORE_NAMES_PATH = path.join(SCRIPT_DIR, 'firestore-product-names.txt');

let mainRunning = false;

// ─── Firebase credentials ─────────────────────────────────────────────────────

function loadFirebaseCredentials() {
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    return { source: 'serviceAccountKey.json', credential: require(SERVICE_ACCOUNT_PATH) };
  }

  require('dotenv').config({ path: ENV_PATH });

  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL) {
    return {
      source: 'backend/.env',
      credential: {
        projectId: FIREBASE_PROJECT_ID,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: FIREBASE_CLIENT_EMAIL,
      },
    };
  }

  console.error(
    'Firebase credentials not found.\n\n' +
      'Option A — place service account JSON at:\n' +
      `  ${SERVICE_ACCOUNT_PATH}\n` +
      '  (Firebase Console → Project Settings → Service Accounts → Generate new private key)\n\n' +
      'Option B — set these in backend/.env (same as seed.ts):\n' +
      '  FIREBASE_PROJECT_ID\n' +
      '  FIREBASE_PRIVATE_KEY\n' +
      '  FIREBASE_CLIENT_EMAIL'
  );
  process.exit(1);
}

function loadProductImages() {
  return JSON.parse(fs.readFileSync(PRODUCT_IMAGES_PATH, 'utf8'));
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const flags = {
    force: false,
    dryRun: false,
    listCollections: false,
    dumpNames: false,
    retryFailed: false,
    index: null,
    from: null,
    to: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') flags.force = true;
    else if (arg === '--dry-run') flags.dryRun = true;
    else if (arg === '--list-collections') flags.listCollections = true;
    else if (arg === '--dump-names') flags.dumpNames = true;
    else if (arg === '--retry-failed') flags.retryFailed = true;
    else if (arg === '--index') flags.index = Number(argv[++i]);
    else if (arg === '--from') flags.from = Number(argv[++i]);
    else if (arg === '--to') flags.to = Number(argv[++i]);
    else {
      console.error(`Unknown flag: ${arg}`);
      process.exit(1);
    }
  }

  return flags;
}

function dedupeByIndex(items) {
  const byIndex = new Map();
  for (const item of items) {
    if (!byIndex.has(item.index)) {
      byIndex.set(item.index, item);
    }
  }
  return [...byIndex.values()].sort((a, b) => a.index - b.index);
}

function filterItems(items, flags) {
  let filtered = dedupeByIndex(items);

  if (flags.retryFailed) {
    const failed = loadFailedIndexes();
    if (failed.length === 0) {
      console.log('No failed products in failed-products.json — nothing to retry.');
      return [];
    }
    filtered = filtered.filter(
      (item) =>
        failed.includes(item.index) &&
        item.imageUrl != null &&
        (item.images?.length ?? 0) > 0
    );
  } else if (flags.index != null) {
    filtered = filtered.filter((item) => item.index === flags.index);
  } else {
    if (flags.from != null) {
      filtered = filtered.filter((item) => item.index >= flags.from);
    }
    if (flags.to != null) {
      filtered = filtered.filter((item) => item.index <= flags.to);
    }
  }

  return filtered;
}

function resolveName(jsonName) {
  return NAME_OVERRIDES[jsonName] ?? jsonName;
}

// ─── Failed products tracking ─────────────────────────────────────────────────

function loadFailedIndexes() {
  if (!fs.existsSync(FAILED_PRODUCTS_PATH)) {
    return [];
  }
  try {
    const data = JSON.parse(fs.readFileSync(FAILED_PRODUCTS_PATH, 'utf8'));
    return Array.isArray(data.indexes) ? data.indexes : [];
  } catch {
    return [];
  }
}

function loadFailedData() {
  if (!fs.existsSync(FAILED_PRODUCTS_PATH)) {
    return { indexes: [], entries: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(FAILED_PRODUCTS_PATH, 'utf8'));
    return {
      indexes: Array.isArray(data.indexes) ? data.indexes : [],
      entries: Array.isArray(data.entries) ? data.entries : [],
    };
  } catch {
    return { indexes: [], entries: [] };
  }
}

function saveFailedData(data) {
  data.indexes = [...new Set(data.indexes)].sort((a, b) => a - b);
  fs.writeFileSync(FAILED_PRODUCTS_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function recordNotFound(item) {
  const data = loadFailedData();
  if (!data.indexes.includes(item.index)) {
    data.indexes.push(item.index);
    data.entries.push({
      index: item.index,
      jsonName: item.name,
      resolvedName: resolveName(item.name),
    });
    saveFailedData(data);
  }
}

function clearFailedIndex(index) {
  const data = loadFailedData();
  data.indexes = data.indexes.filter((i) => i !== index);
  data.entries = data.entries.filter((e) => e.index !== index);
  saveFailedData(data);
}

// ─── Matching ─────────────────────────────────────────────────────────────────

function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

function buildDocLookups(docs) {
  const byIndex = new Map();
  const byNameExact = new Map();
  const byNameFuzzy = new Map();

  for (const doc of docs) {
    const data = doc.data();

    if (typeof data.index === 'number') {
      byIndex.set(data.index, doc);
    }

    if (typeof data.name === 'string') {
      const exactKey = data.name.trim().toLowerCase();
      if (!byNameExact.has(exactKey)) {
        byNameExact.set(exactKey, doc);
      }

      const fuzzyKey = normalizeName(data.name);
      if (!byNameFuzzy.has(fuzzyKey)) {
        byNameFuzzy.set(fuzzyKey, doc);
      }
    }
  }

  return { byIndex, byNameExact, byNameFuzzy };
}

function findDocument(item, lookups) {
  const { byIndex, byNameExact, byNameFuzzy } = lookups;
  const name = resolveName(item.name);

  if (byIndex.has(item.index)) {
    return { doc: byIndex.get(item.index), strategy: 'index', resolvedName: name };
  }

  const exactKey = name.trim().toLowerCase();
  if (byNameExact.has(exactKey)) {
    return { doc: byNameExact.get(exactKey), strategy: 'name-exact', resolvedName: name };
  }

  const fuzzyKey = normalizeName(name);
  if (byNameFuzzy.has(fuzzyKey)) {
    return { doc: byNameFuzzy.get(fuzzyKey), strategy: 'name-fuzzy', resolvedName: name };
  }

  return null;
}

// ─── Logging ──────────────────────────────────────────────────────────────────

function padIndex(itemIndex, total) {
  const width = String(total).length;
  return `[${String(itemIndex).padStart(width)}/${total}]`;
}

function logLine(prefix, item, message) {
  console.log(`${prefix} ${item.name} → ${message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function listCollections(db) {
  const collections = await db.listCollections();
  console.log('\nFirestore top-level collections:');
  if (collections.length === 0) {
    console.log('  (none)');
  } else {
    for (const col of collections) {
      console.log(`  - ${col.id}`);
    }
  }
  console.log('');
}

async function dumpNames(db) {
  const snapshot = await db.collection(COLLECTION_NAME).get();
  const rows = snapshot.docs
    .map((doc) => {
      const name = doc.data().name;
      return typeof name === 'string' ? { id: doc.id, name } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  const lines = rows.map((row, i) => `${String(i + 1).padStart(2)}. ${row.name}  (doc: ${row.id})`);
  const output = [
    `Firestore collection: ${COLLECTION_NAME}`,
    `Total products: ${rows.length}`,
    '',
    ...lines,
    '',
  ].join('\n');

  fs.writeFileSync(FIRESTORE_NAMES_PATH, output, 'utf8');
  console.log(output);
  console.log(`Saved to ${FIRESTORE_NAMES_PATH}`);
}

async function main() {
  if (mainRunning) {
    console.error('Script is already running — aborting duplicate invocation.');
    process.exit(1);
  }
  mainRunning = true;

  const flags = parseArgs(process.argv);

  const admin = require('firebase-admin');
  const { source, credential } = loadFirebaseCredentials();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credential),
    });
  }

  const db = admin.firestore();

  if (flags.listCollections) {
    await listCollections(db);
    process.exit(0);
  }

  if (flags.dumpNames) {
    console.log(`Credentials: ${source}\n`);
    await dumpNames(db);
    process.exit(0);
  }

  if (!fs.existsSync(PRODUCT_IMAGES_PATH)) {
    console.error(`Missing ${PRODUCT_IMAGES_PATH} — run scrape-product-images.js first`);
    process.exit(1);
  }

  const productImages = loadProductImages();
  const items = filterItems(productImages, flags);
  const totalAll = dedupeByIndex(productImages).length;
  const total = items.length;

  if (total === 0) {
    process.exit(0);
  }

  console.log(
    `Updating Firestore collection "${COLLECTION_NAME}"` +
      (flags.dryRun ? ' (DRY RUN)' : '') +
      (flags.force ? ' (FORCE)' : '') +
      (flags.retryFailed ? ' (RETRY FAILED)' : '') +
      `\nCredentials: ${source}` +
      `\nProcessing ${total} product(s) from product-images.json\n`
  );

  const snapshot = await db.collection(COLLECTION_NAME).get();
  const lookups = buildDocLookups(snapshot.docs);

  const stats = { updated: 0, skipped: 0, notFound: 0, errors: 0 };

  for (const item of items) {
    const prefix = padIndex(item.index, totalAll);

    if (item.imageUrl == null && (!item.images || item.images.length === 0)) {
      stats.skipped++;
      logLine(`${prefix} ⏭️ `, item, 'skipped (failed scrape — no images)');
      continue;
    }

    const match = findDocument(item, lookups);
    if (!match) {
      stats.notFound++;
      recordNotFound(item);
      logLine(`${prefix} ❌`, item, `NOT FOUND in Firestore (tried: "${resolveName(item.name)}")`);
      continue;
    }

    const { doc, strategy, resolvedName } = match;
    const data = doc.data();

    if (data.imagesUpdatedAt && !flags.force && !flags.retryFailed) {
      stats.skipped++;
      logLine(`${prefix} ⏭️ `, item, 'skipped (already updated)');
      continue;
    }

    const updatePayload = {
      imageUrl: item.imageUrl,
      images: item.images || [],
      imagesUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const imageCount = (item.images || []).length;
    const lowImageNote = imageCount === 1 ? ` with ${imageCount} image only` : '';
    const overrideNote =
      item.name !== resolvedName ? ` [override → "${resolvedName}"]` : '';
    const strategyNote =
      strategy !== 'index' && item.name === resolvedName ? ` [matched by ${strategy}]` : '';

    try {
      if (flags.dryRun) {
        stats.updated++;
        const icon = imageCount === 1 ? '⚠️ ' : '✅';
        logLine(
          `${prefix} ${icon}`,
          item,
          `would update (doc: ${doc.id})${lowImageNote}${overrideNote}${strategyNote}`
        );
      } else {
        await doc.ref.update(updatePayload);
        stats.updated++;
        clearFailedIndex(item.index);
        const icon = imageCount === 1 ? '⚠️ ' : '✅';
        logLine(
          `${prefix} ${icon}`,
          item,
          `updated (doc: ${doc.id})${lowImageNote}${overrideNote}${strategyNote}`
        );
      }
    } catch (err) {
      stats.errors++;
      logLine(`${prefix} 💥`, item, `ERROR: ${err.message}`);
    }
  }

  console.log(
    `\nDone. Updated: ${stats.updated} | Skipped: ${stats.skipped} | Not found: ${stats.notFound} | Errors: ${stats.errors}`
  );

  if (stats.notFound > 0) {
    console.log(`\nFailed indexes saved to ${FAILED_PRODUCTS_PATH}`);
  }

  if (stats.notFound > 3) {
    console.log('\n⚠️  Run with --list-collections to see all collection names in your Firestore');
    console.log('    Run with --dump-names to see exact Firestore product names');
  }

  process.exit(stats.errors > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
