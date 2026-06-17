// npm install sharp canvas
//
// Usage:
//   node enhance-screenshots.js

import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import { mkdir, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_DIR = path.join(__dirname, 'portfolio-screenshots');
const OUTPUT_DIR = path.join(INPUT_DIR, 'enhanced');

const CANVAS_W = 1600;
const CANVAS_H = 900;
const BG_COLOR = '#0f172a';
const PADDING = 20;
const LABEL_MARGIN = 36;

const JOBS = [
  {
    input: '01_home.png',
    output: '01_home.png',
    cropHeight: 900,
    label: 'Zivora — Home',
    shadow: true,
    glow: false,
  },
  {
    input: '02_products.png',
    output: '02_products.png',
    cropHeight: 1100,
    label: 'Zivora — Product Catalog',
    shadow: false,
    glow: false,
  },
  {
    input: '03_product_detail.png',
    output: '03_product_detail.png',
    cropHeight: null,
    label: 'Zivora — Product Detail',
    shadow: false,
    glow: true,
  },
  {
    input: '04_cart.png',
    output: '04_cart.png',
    cropHeight: 500,
    label: 'Zivora — Shopping Cart',
    shadow: false,
    glow: false,
  },
  {
    input: '05_auth.png',
    output: '05_auth.png',
    cropHeight: null,
    label: 'Zivora — Authentication',
    shadow: false,
    glow: false,
  },
];

async function loadSourceBuffer(filePath, cropHeight) {
  const image = sharp(filePath);
  const meta = await image.metadata();

  if (!cropHeight || cropHeight >= meta.height) {
    return image.png().toBuffer();
  }

  return image
    .extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: Math.min(cropHeight, meta.height),
    })
    .png()
    .toBuffer();
}

function fitSize(srcW, srcH, maxW, maxH) {
  const scale = Math.min(maxW / srcW, maxH / srcH);
  return {
    width: Math.round(srcW * scale),
    height: Math.round(srcH * scale),
  };
}

function drawBottomGradient(ctx) {
  const gradient = ctx.createLinearGradient(0, CANVAS_H - 260, 0, CANVAS_H);
  gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.08)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawLabel(ctx, text) {
  ctx.save();
  ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 8;
  ctx.fillText(text, LABEL_MARGIN, CANVAS_H - LABEL_MARGIN);
  ctx.restore();
}

async function createPortfolioImage({ sourcePath, cropHeight, label, shadow, glow }) {
  const sourceBuffer = await loadSourceBuffer(sourcePath, cropHeight);
  const sourceMeta = await sharp(sourceBuffer).metadata();
  const sourceImage = await loadImage(sourceBuffer);

  const maxW = CANVAS_W - PADDING * 2;
  const maxH = CANVAS_H - PADDING * 2;
  const { width, height } = fitSize(sourceMeta.width, sourceMeta.height, maxW, maxH);
  const x = Math.round((CANVAS_W - width) / 2);
  const y = Math.round((CANVAS_H - height) / 2);

  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.save();

  if (shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 14;
  }

  if (glow) {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 1, y - 1, width + 2, height + 2);
  }

  ctx.drawImage(sourceImage, x, y, width, height);
  ctx.restore();

  drawBottomGradient(ctx);
  drawLabel(ctx, label);

  return canvas.toBuffer('image/png');
}

async function createHeroCombined(assets) {
  const byName = Object.fromEntries(assets.map((item) => [item.name, item.buffer]));

  const leftSource = await loadImage(byName['03_product_detail.png']);
  const cartSource = await loadImage(byName['04_cart.png']);
  const authSource = await loadImage(byName['05_auth.png']);

  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Ambient background accents
  const accent = ctx.createRadialGradient(220, 120, 20, 220, 120, 420);
  accent.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
  accent.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const accent2 = ctx.createRadialGradient(1320, 760, 20, 1320, 760, 360);
  accent2.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
  accent2.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = accent2;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title
  ctx.save();
  ctx.font = '700 34px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
  ctx.fillText('Zivora — Full Stack E-Commerce', 48, 58);
  ctx.restore();

  const drawCard = (image, box, rotationDeg) => {
    const fitted = fitSize(image.width, image.height, box.width, box.height);
    const drawW = fitted.width;
    const drawH = fitted.height;
    const drawX = box.x + (box.width - drawW) / 2;
    const drawY = box.y + (box.height - drawH) / 2;
    const cx = drawX + drawW / 2;
    const cy = drawY + drawH / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  drawCard(leftSource, { x: 44, y: 96, width: 860, height: 760 }, 0);
  drawCard(cartSource, { x: 930, y: 118, width: 610, height: 330 }, -2);
  drawCard(authSource, { x: 950, y: 500, width: 610, height: 330 }, 2);

  drawBottomGradient(ctx);

  return canvas.toBuffer('image/png');
}

async function ensureInputsExist() {
  const files = await readdir(INPUT_DIR);
  const missing = JOBS.map((job) => job.input).filter((name) => !files.includes(name));

  if (missing.length > 0) {
    throw new Error(`Missing screenshots in ${INPUT_DIR}: ${missing.join(', ')}`);
  }
}

async function main() {
  console.log('🎨  Enhancing Zivora portfolio screenshots...\n');

  await ensureInputsExist();
  await mkdir(OUTPUT_DIR, { recursive: true });

  const enhancedAssets = [];

  for (const job of JOBS) {
    const sourcePath = path.join(INPUT_DIR, job.input);
    const outputPath = path.join(OUTPUT_DIR, job.output);

    console.log(`→  Processing ${job.input}`);
    const buffer = await createPortfolioImage({
      sourcePath,
      cropHeight: job.cropHeight,
      label: job.label,
      shadow: job.shadow,
      glow: job.glow,
    });

    await sharp(buffer).png().toFile(outputPath);
    enhancedAssets.push({ name: job.output, buffer });
    console.log(`   Saved ${outputPath}`);
  }

  console.log('\n→  Building hero_combined.png');
  const heroBuffer = await createHeroCombined(enhancedAssets);
  const heroPath = path.join(OUTPUT_DIR, 'hero_combined.png');
  await sharp(heroBuffer).png().toFile(heroPath);
  console.log(`   Saved ${heroPath}`);

  console.log('\n✅  Done! Enhanced images are in portfolio-screenshots/enhanced/');
}

main().catch((error) => {
  console.error('❌  Enhancement failed:', error.message);
  process.exitCode = 1;
});
