const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUTPUT_FILE = path.join(__dirname, 'product-images.json');
const MAX_IMAGES = 6;
const HEADLESS = true; // Set to false if Amazon shows a CAPTCHA

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const PRODUCTS = [
  [1, 'Sony WH-1000XM5 Wireless Headphones'],
  [2, 'Apple Watch Series 9'],
  [3, 'MacBook Air M3 13"'],
  [4, 'iPhone 15 Pro'],
  [5, 'Sony WF-1000XM5 Earbuds'],
  [6, 'Mechanical Gaming Keyboard'],
  [7, 'Sony Alpha A7 IV Camera'],
  [8, 'JBL Charge 5 Bluetooth Speaker'],
  [9, 'LG 27" 4K UHD Monitor'],
  [10, 'Logitech MX Master 3S Mouse'],
  [11, 'iPad Pro 12.9" M2'],
  [12, 'Anker 15W Wireless Charging Pad'],
  [13, 'GoPro HERO12 Black'],
  [14, 'Nintendo Switch OLED'],
  [15, '12-in-1 USB-C Hub'],
  [16, 'Premium Oversized Hoodie'],
  [17, 'Nike Air Max 270 Sneakers'],
  [18, 'Genuine Leather Bomber Jacket'],
  [19, 'Essential White T-Shirt'],
  [20, 'Slim Fit Stretch Jeans'],
  [21, 'Floral Midi Dress'],
  [22, 'Vintage Baseball Cap'],
  [23, 'Chelsea Leather Boots'],
  [24, 'Cashmere Crew Neck Sweater'],
  [25, 'Double-Breasted Trench Coat'],
  [26, 'Athletic Running Shorts'],
  [27, 'Merino Wool Crew Socks 3-Pack'],
  [28, 'Linen Button-Down Shirt'],
  [29, 'Clean Code by Robert C. Martin'],
  [30, 'Atomic Habits by James Clear'],
  [31, 'Sapiens A Brief History of Humankind'],
  [32, 'The Design of Everyday Things'],
  [33, 'Rich Dad Poor Dad'],
  [34, 'Thinking Fast and Slow'],
  [35, 'The Lean Startup'],
  [36, 'The Pragmatic Programmer'],
  [37, 'Minimalist Adjustable Desk Lamp'],
  [38, 'Handcrafted Pour-Over Coffee Set'],
  [39, 'Matte Ceramic Plant Pot Set 3 pcs'],
  [40, 'Luxury Soy Wax Candle cedarwood vanilla'],
  [41, 'Memory Foam Body Pillow bamboo cover'],
  [42, 'High-Speed Professional Blender 1800W'],
  [43, 'Smart HEPA Air Purifier 500 sq ft'],
  [44, 'Non-Stick Cookware Set 5 piece'],
  [45, '15lb Weighted Blanket'],
  [46, 'Bamboo Desk Organizer'],
  [47, 'Premium Natural Rubber Yoga Mat 6mm'],
  [48, 'PowerBlock Adjustable Dumbbells 5-50 lbs'],
  [49, 'Hydro Flask 32oz Water Bottle'],
  [50, 'Resistance Band Set 5 levels'],
  [51, 'Speed Jump Rope Pro ball bearing'],
  [52, 'Road Bike Helmet MIPS'],
  [53, 'Pro Sports Gym Bag 40L'],
  [54, 'High-Density Foam Roller 13 inch'],
  [55, 'Doorframe Pull-Up Bar no screw'],
  [56, 'Smart Fitness Tracker Band heart rate SpO2'],
  [57, 'Insulated Gym Protein Shaker 700ml'],
  [58, 'LEGO Architecture Skyline Set'],
  [59, 'Catan Board Game'],
  [60, 'RC Off-Road Truck 1:16 4WD'],
  [61, 'Mega Building Blocks Set 500 pieces toddler'],
  [62, '1000-Piece Panoramic Jigsaw Puzzle mountain'],
  [63, 'Kids Science Lab Kit STEM 30 experiments'],
  [64, 'Vitamin C Hyaluronic Acid Face Serum 30ml'],
  [65, 'Luxury Botanical Perfume Gift Set 3 x 30ml'],
  [66, 'Velvet Matte Lipstick Set 6 shades'],
  [67, 'Korean Sheet Face Mask 10-Pack hyaluronic acid'],
  [68, 'Retinol Night Repair Face Cream 50ml'],
  [69, '18-Shade Pro Eyeshadow Palette matte shimmer'],
  [70, 'Hair Growth Biotin Serum 60ml dropper'],
  [71, 'Rose Quartz Facial Roller dual ended'],
  [72, 'Artisan Natural Soap Set 6 bars shea butter'],
];

function randomDelay(minMs = 2000, maxMs = 4000) {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadResults() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveResults(results) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');
}

function upsertResult(results, entry) {
  const idx = results.findIndex((r) => r.index === entry.index);
  if (idx >= 0) {
    results[idx] = entry;
  } else {
    results.push(entry);
  }
  results.sort((a, b) => a.index - b.index);
  saveResults(results);
}

function parseJsonArrayFrom(html, startIndex) {
  const arrStart = html.indexOf('[', startIndex);
  if (arrStart < 0) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = arrStart; i < html.length; i++) {
    const ch = html[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        return html.slice(arrStart, i + 1);
      }
    }
  }

  return null;
}

function extractImageUrls(html) {
  const urls = [];

  const colorImagesIdx =
    html.indexOf("'colorImages'") >= 0
      ? html.indexOf("'colorImages'")
      : html.indexOf('"colorImages"');

  if (colorImagesIdx >= 0) {
    const chunk = html.slice(colorImagesIdx);
    const initialIdx =
      chunk.indexOf("'initial':") >= 0
        ? chunk.indexOf("'initial':")
        : chunk.indexOf('"initial":');

    if (initialIdx >= 0) {
      const arrJson = parseJsonArrayFrom(chunk, initialIdx);
      if (arrJson) {
        try {
          const images = JSON.parse(arrJson);
          for (const img of images) {
            const url = img.hiRes || img.large || img.main;
            if (typeof url === 'string' && url && !urls.includes(url)) {
              urls.push(url);
            } else if (url && typeof url === 'object') {
              const best = Object.keys(url).sort(
                (a, b) => url[b][0] * url[b][1] - url[a][0] * url[a][1]
              )[0];
              if (best && !urls.includes(best)) {
                urls.push(best);
              }
            }
          }
        } catch {
          // fall through to imageGalleryData
        }
      }
    }
  }

  if (urls.length === 0) {
    const galleryIdx =
      html.indexOf("'imageGalleryData'") >= 0
        ? html.indexOf("'imageGalleryData'")
        : html.indexOf('"imageGalleryData"');

    if (galleryIdx >= 0) {
      const arrJson = parseJsonArrayFrom(html, galleryIdx);
      if (arrJson) {
        try {
          const gallery = JSON.parse(arrJson);
          for (const item of gallery) {
            const url = item.hiRes || item.large || item.main || item.thumb;
            if (url && !urls.includes(url)) {
              urls.push(url);
            }
          }
        } catch {
          // no images found
        }
      }
    }
  }

  return urls.slice(0, MAX_IMAGES);
}

async function isCaptchaPage(page) {
  const url = page.url();
  if (url.includes('/errors/validateCaptcha') || url.includes('captcha')) {
    return true;
  }
  return page.evaluate(() => {
    return (
      !!document.querySelector('form[action*="validateCaptcha"]') ||
      !!document.querySelector('#captchacharacters') ||
      !!document.querySelector('input[name="field-keywords"][placeholder*="captcha" i]')
    );
  });
}

async function waitForCaptchaResolution(page) {
  if (!(await isCaptchaPage(page))) {
    return;
  }

  console.log('\n[CAPTCHA] Amazon CAPTCHA detected.');
  if (HEADLESS) {
    throw new Error('CAPTCHA detected — set HEADLESS to false, re-run, and solve it manually');
  }

  console.log('[CAPTCHA] Solve the CAPTCHA in the browser window. Waiting...');
  await page.waitForFunction(
    () =>
      !document.querySelector('form[action*="validateCaptcha"]') &&
      !document.querySelector('#captchacharacters'),
    { timeout: 300000 }
  );
  console.log('[CAPTCHA] Resolved, continuing.\n');
}

async function clickFirstOrganicResult(page) {
  await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 15000 });

  const productUrl = await page.evaluate(() => {
    const results = document.querySelectorAll('[data-component-type="s-search-result"]');

    function pickLink(result) {
      const titleLink = result.querySelector(
        'a.s-line-clamp-2[href*="/dp/"], a.s-line-clamp-3[href*="/dp/"], a.a-link-normal[href*="/dp/"]'
      );
      if (titleLink?.href) {
        return titleLink.href.split('#')[0];
      }
      const anyLink = result.querySelector('a[href*="/dp/"], a[href*="/gp/product/"]');
      return anyLink?.href?.split('#')[0] || null;
    }

    for (const result of results) {
      const isSponsored =
        result.querySelector('.puis-sponsored-label-text') ||
        result.querySelector('[aria-label="Sponsored"]') ||
        result.closest('[data-component-type="sp-sponsored-result"]') ||
        /Sponsored/i.test(result.querySelector('.a-color-secondary')?.textContent || '');

      if (isSponsored) {
        continue;
      }

      const href = pickLink(result);
      if (href) {
        return href;
      }
    }

    const fallback = document.querySelector('[data-component-type="s-search-result"]');
    return fallback ? pickLink(fallback) : null;
  });

  if (!productUrl) {
    throw new Error('No search results found');
  }

  await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
}

async function scrapeProduct(page, index, name) {
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });

  await waitForCaptchaResolution(page);
  await clickFirstOrganicResult(page);
  await waitForCaptchaResolution(page);

  await page.waitForSelector('#landingImage, #imgBlkFront', { timeout: 15000 }).catch(() => {});
  await randomDelay(1500, 2500);

  const html = await page.content();
  const images = extractImageUrls(html);

  if (images.length === 0) {
    throw new Error('No images extracted from product page');
  }

  return {
    index,
    name,
    imageUrl: images[0],
    images,
  };
}

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: HEADLESS ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1366,768',
    ],
    defaultViewport: { width: 1366, height: 768 },
  });

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  return { browser, page };
}

async function main() {
  console.log(`Scraping ${PRODUCTS.length} products → ${OUTPUT_FILE}`);
  console.log(`Headless: ${HEADLESS}\n`);

  const results = loadResults();
  let browser;
  let page;

  try {
    ({ browser, page } = await launchBrowser());

    for (let i = 0; i < PRODUCTS.length; i++) {
      const [index, name] = PRODUCTS[i];
      const label = `[${index}/${PRODUCTS.length}] ${name}`;

      const existing = results.find((r) => r.index === index && r.imageUrl);
      if (existing) {
        console.log(`${label} — skipped (already scraped)`);
        continue;
      }

      try {
        const entry = await scrapeProduct(page, index, name);
        upsertResult(results, entry);
        console.log(`${label} — found ${entry.images.length} images`);
      } catch (err) {
        const failedEntry = { index, name, imageUrl: null, images: [] };
        upsertResult(results, failedEntry);
        console.error(`${label} — FAILED: ${err.message}`);
      }

      if (i < PRODUCTS.length - 1) {
        await randomDelay();
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  const successCount = results.filter((r) => r.imageUrl).length;
  console.log(`\nDone: ${successCount}/${PRODUCTS.length} products with images`);
  console.log(`Results saved to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
