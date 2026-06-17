import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const SEED_PATH = path.join(__dirname, 'seed.ts');
const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;
const DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImageUrl(productName: string): Promise<string | null> {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: API_KEY,
        cx: CX,
        q: `${productName} product`,
        searchType: 'image',
        num: 1,
        imgType: 'photo',
        safe: 'active',
      },
    });
    const items = response.data.items;
    if (items && items.length > 0) {
      return items[0].link;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function extractProductNames(text: string): string[] {
  const nameRegex = /name:\s*['"](.+?)['"]/g;
  const names: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = nameRegex.exec(text)) !== null) {
    names.push(match[1]);
  }
  return names;
}

function replaceImageUrl(seedText: string, productName: string, newUrl: string): string {
  const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Find position of this product's name entry
  const namePattern = new RegExp(`name:\\s*['"]${escapedName}['"]`);
  const nameMatch = namePattern.exec(seedText);
  if (!nameMatch) {
    throw new Error(`Product name not found in seed text: ${productName}`);
  }

  const nameIndex = nameMatch.index;
  const textFromName = seedText.slice(nameIndex);

  // Find the next imageUrl: after the product name
  const imageUrlIndex = textFromName.indexOf('imageUrl:');
  if (imageUrlIndex === -1) {
    throw new Error(`imageUrl not found after product: ${productName}`);
  }

  const absoluteImageUrlIndex = nameIndex + imageUrlIndex;
  const textFromImageUrl = seedText.slice(absoluteImageUrlIndex);

  // Match the current imageUrl value: IMG.xxx, 'url', or "url"
  const valueMatch = /imageUrl:\s*(IMG\.\w+|'[^']*'|"[^"]*")/.exec(textFromImageUrl);
  if (!valueMatch) {
    throw new Error(`Could not parse imageUrl value for: ${productName}`);
  }

  const oldEntry = valueMatch[0];
  const newEntry = `imageUrl: '${newUrl}'`;

  return (
    seedText.slice(0, absoluteImageUrlIndex) +
    textFromImageUrl.replace(oldEntry, newEntry)
  );
}

async function main(): Promise<void> {
  try {
    let seedText = fs.readFileSync(SEED_PATH, 'utf-8');
    const names = extractProductNames(seedText);

    let updated = 0;
    let failed = 0;

    for (const name of names) {
      console.log(`[ImageUpdater] Processing: ${name}`);

      try {
        const imageUrl = await fetchImageUrl(name);

        if (!imageUrl) {
          throw new Error('No image result returned from API');
        }

        seedText = replaceImageUrl(seedText, name, imageUrl);
        console.log(`[ImageUpdater] ✅ Found: ${name}`);
        updated++;
      } catch (error) {
        console.error(`[ImageUpdater] ❌ Failed: ${name}`, error);
        failed++;
      }

      await sleep(DELAY_MS);
    }

    fs.writeFileSync(SEED_PATH, seedText, 'utf-8');
    console.log(`[ImageUpdater] ✅ Done: ${updated} updated, ${failed} failed`);
  } catch (error) {
    console.error('[ImageUpdater] Fatal error:', error);
    process.exit(1);
  }
}

main();
