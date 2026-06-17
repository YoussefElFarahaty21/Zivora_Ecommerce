/**
 * Portfolio screenshot script for Zivora e-commerce app.
 *
 * Prerequisites:
 *   1. Backend running  → http://localhost:5000
 *   2. Frontend running → http://localhost:5173 (Vite default)
 *      If yours runs on port 3000, set BASE_URL=http://localhost:3000
 *
 * Optional env vars for admin dashboard screenshot:
 *   SCREENSHOT_ADMIN_EMAIL
 *   SCREENSHOT_ADMIN_PASSWORD
 *
 * Usage:
 *   npm run screenshots
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'portfolio-screenshots');

// Vite serves on 5173 by default; override with BASE_URL if needed.
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000';

const VIEWPORT = { width: 1440, height: 900 };

async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle');
}

async function screenshot(page, filename, label) {
  const filepath = path.join(OUTPUT_DIR, filename);
  console.log(`📸  Saving ${label} → ${filename}`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✅  Saved ${filepath}\n`);
}

async function waitForProducts(page) {
  await page.waitForSelector('a[href^="/product/"]', { timeout: 30_000 });
}

async function seedCartFromCurrentProduct(page) {
  const productId = page.url().split('/product/')[1]?.split(/[?#]/)[0];
  if (!productId) throw new Error('Could not read product ID from URL');

  const response = await fetch(`${API_URL}/api/products/${productId}`);
  if (!response.ok) throw new Error(`API returned ${response.status} for product ${productId}`);

  const json = await response.json();
  const product = json.data;
  if (!product?.id || !product?.name) {
    throw new Error(`Unexpected API shape for product ${productId}`);
  }

  await page.evaluate((cartItem) => {
    localStorage.setItem('ecommerce_cart', JSON.stringify([cartItem]));
  }, { product, quantity: 1 });

  console.log(`🛒  Seeded cart with "${product.name}"`);
}

async function loginAsAdmin(page) {
  const email = process.env.SCREENSHOT_ADMIN_EMAIL;
  const password = process.env.SCREENSHOT_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('⚠️   Skipping admin dashboard — set SCREENSHOT_ADMIN_EMAIL and SCREENSHOT_ADMIN_PASSWORD to capture it.\n');
    return false;
  }

  console.log('🔐  Logging in as admin...');
  await page.goto(`${BASE_URL}/login`);
  await waitForPageReady(page);

  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL(/\/admin\/dashboard/, { timeout: 15_000 });
  await waitForPageReady(page);
  console.log('✅  Admin login successful\n');
  return true;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log('🚀  Starting portfolio screenshot capture');
  console.log(`    Frontend: ${BASE_URL}`);
  console.log(`    API:      ${API_URL}`);
  console.log(`    Output:   ${OUTPUT_DIR}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  try {
    // ── 01 Home / Landing ──────────────────────────────────────────────
    console.log('🏠  Step 1/6 — Home / Landing page');
    await page.goto(BASE_URL);
    await waitForPageReady(page);
    await waitForProducts(page);
    await screenshot(page, '01_home.png', 'home page');

    // ── 02 Product listing ─────────────────────────────────────────────
    // Home and catalog share "/" — scroll to the #products grid section.
    console.log('🛍️   Step 2/6 — Product listing');
    await page.locator('#products').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await waitForPageReady(page);
    await screenshot(page, '02_products.png', 'product listing');

    // ── 03 Product detail ──────────────────────────────────────────────
    console.log('📦  Step 3/6 — Product detail (first product)');
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.click();
    await page.waitForURL(/\/product\//);
    await waitForPageReady(page);
    await page.getByRole('button', { name: 'Add to Cart' }).waitFor({ timeout: 15_000 });
    await screenshot(page, '03_product_detail.png', 'product detail');

    // ── 04 Shopping cart ───────────────────────────────────────────────
    // Add-to-cart in the UI requires auth; seed localStorage instead.
    console.log('🛒  Step 4/6 — Shopping cart');
    await seedCartFromCurrentProduct(page);
    await page.goto(`${BASE_URL}/cart`);
    await waitForPageReady(page);
    await page.getByText(/your cart|shopping cart|cart/i).first().waitFor({ timeout: 15_000 }).catch(() => {});
    await screenshot(page, '04_cart.png', 'shopping cart');

    // ── 05 Login / Register ────────────────────────────────────────────
    console.log('🔑  Step 5/6 — Login page');
    await page.goto(`${BASE_URL}/login`);
    await waitForPageReady(page);
    await page.getByRole('heading', { name: /welcome back/i }).waitFor();
    await screenshot(page, '05_auth.png', 'login page');

    // ── 06 Admin dashboard ─────────────────────────────────────────────
    console.log('📊  Step 6/6 — Admin dashboard');
    const adminReady = await loginAsAdmin(page);
    if (adminReady) {
      await screenshot(page, '06_dashboard.png', 'admin dashboard');
    } else {
      console.log('    (06_dashboard.png not created — admin credentials not provided)');
    }

    console.log('🎉  Done! Screenshots saved to portfolio-screenshots/');
  } catch (error) {
    console.error('❌  Screenshot capture failed:', error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
