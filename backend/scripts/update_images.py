import re
import time
import json
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_PATH = os.path.join(SCRIPT_DIR, "..", "src", "scripts", "seed.ts")
DELAY_SECONDS = 3
MAX_IMAGES = 6


# ─── Browser ──────────────────────────────────────────────────────────────────

def create_driver():
    try:
        options = Options()
        options.add_argument("--start-maximized")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)
        options.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {"source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"},
        )
        return driver
    except Exception as e:
        raise RuntimeError(f"Failed to launch Chrome: {e}")


# ─── Amazon image extraction ───────────────────────────────────────────────────

def extract_from_color_images_json(page_source):
    """Pull high-res URLs from the colorImages JSON Amazon embeds in the page."""
    try:
        match = re.search(
            r"'colorImages'\s*:\s*\{\s*'initial'\s*:\s*(\[.*?\])\s*\}\s*,\s*'colorAsin'",
            page_source,
            re.DOTALL,
        )
        if not match:
            return []
        images_data = json.loads(match.group(1))
        urls = []
        for img in images_data:
            url = img.get("hiRes") or img.get("large")
            if url and url not in urls:
                urls.append(url)
        return urls
    except Exception:
        return []


def extract_from_landing_image(page_source):
    """Get highest-res URL from #landingImage data attributes."""
    try:
        soup = BeautifulSoup(page_source, "html.parser")
        landing = soup.find("img", {"id": "landingImage"})
        if not landing:
            return []

        urls = []

        hires = landing.get("data-old-hires", "")
        if hires:
            urls.append(hires)

        dynamic = landing.get("data-a-dynamic-image", "")
        if dynamic:
            img_dict = json.loads(dynamic)
            best = max(img_dict.keys(), key=lambda u: img_dict[u][0] * img_dict[u][1])
            if best not in urls:
                urls.append(best)

        return urls
    except Exception:
        return []


def extract_from_alt_thumbnails(page_source):
    """Convert #altImages thumbnails to full-res by stripping the size suffix."""
    try:
        soup = BeautifulSoup(page_source, "html.parser")
        urls = []
        for img in soup.select("#altImages li img"):
            src = img.get("src", "")
            if not src or "sprite" in src or "play-button" in src:
                continue
            # Remove Amazon thumbnail size suffix e.g. ._AC_US40_.jpg → .jpg
            full_res = re.sub(r"\._[A-Z0-9_,]+_\.", ".", src)
            if full_res not in urls:
                urls.append(full_res)
        return urls
    except Exception:
        return []


def get_product_images(driver, product_name):
    try:
        # ── Step 1: search ──────────────────────────────────────────────────
        search_url = f"https://www.amazon.com/s?k={product_name.replace(' ', '+')}"
        driver.get(search_url)

        WebDriverWait(driver, 12).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "[data-component-type='s-search-result'] h2 a")
            )
        )

        # ── Step 2: navigate to first product page ──────────────────────────
        first_link = driver.find_element(
            By.CSS_SELECTOR, "[data-component-type='s-search-result'] h2 a"
        )
        product_url = first_link.get_attribute("href")
        driver.get(product_url)

        # ── Step 3: wait for product page ───────────────────────────────────
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "landingImage"))
        )
        time.sleep(2)  # allow JS image data to fully render

        page_source = driver.page_source

        # ── Step 4: extract images (priority order) ─────────────────────────
        images = extract_from_color_images_json(page_source)

        if not images:
            images = extract_from_landing_image(page_source)
            alt = extract_from_alt_thumbnails(page_source)
            for url in alt:
                if url not in images:
                    images.append(url)

        if not images:
            # Last resort: whatever src is on the landing image element
            elem = driver.find_element(By.ID, "landingImage")
            src = elem.get_attribute("src")
            if src:
                images = [src]

        return images[:MAX_IMAGES]

    except Exception as e:
        raise RuntimeError(f"Amazon scrape failed: {e}")


# ─── seed.ts patching ─────────────────────────────────────────────────────────

def extract_product_names(text):
    try:
        return re.findall(r"name:\s*['\"](.+?)['\"]", text)
    except Exception as e:
        raise RuntimeError(f"Failed to extract product names: {e}")


def replace_image_data(seed_text, product_name, image_urls):
    """
    Replaces imageUrl and adds/updates an images:[...] array for one product.
    Handles both IMG.ref values and existing URL strings.
    """
    try:
        escaped = re.escape(product_name)
        name_pattern = re.compile(r"name:\s*['\"]" + escaped + r"['\"]")
        name_match = name_pattern.search(seed_text)
        if not name_match:
            raise ValueError(f"Product name not found: {product_name}")

        text_from_name = seed_text[name_match.start():]
        image_url_index = text_from_name.find("imageUrl:")
        if image_url_index == -1:
            raise ValueError(f"imageUrl not found for: {product_name}")

        abs_index = name_match.start() + image_url_index
        text_from_image_url = seed_text[abs_index:]

        # Match imageUrl value, optionally followed by an existing images:[...]
        pattern = re.compile(
            r"imageUrl:\s*(?:IMG\.\w+|'[^']*'|\"[^\"]*\")"
            r"(?:\s*,\s*\n\s*images:\s*\[[^\]]*\])?",
            re.DOTALL,
        )
        value_match = pattern.match(text_from_image_url)
        if not value_match:
            raise ValueError(f"Could not parse imageUrl block for: {product_name}")

        old_block = value_match.group(0)
        main_url = image_urls[0]
        images_js = ", ".join(f"'{u}'" for u in image_urls)
        new_block = f"imageUrl: '{main_url}',\n    images: [{images_js}]"

        return seed_text[:abs_index] + text_from_image_url.replace(old_block, new_block, 1)

    except Exception as e:
        raise RuntimeError(f"Replace failed: {e}")


def patch_seed_function(seed_text):
    """
    Make the seed() function use per-product images when present,
    falling back to the category EXTRAS when not.
    """
    old_line = "images: [p.imageUrl, ...extras],"
    new_line = "images: (p as any).images?.length ? (p as any).images : [p.imageUrl, ...extras],"
    if old_line in seed_text and new_line not in seed_text:
        return seed_text.replace(old_line, new_line, 1)
    return seed_text


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    try:
        with open(SEED_PATH, "r", encoding="utf-8") as f:
            seed_text = f.read()
    except Exception as e:
        print(f"[Amazon] Fatal: could not read seed.ts — {e}")
        return

    try:
        names = extract_product_names(seed_text)
    except Exception as e:
        print(f"[Amazon] Fatal: could not extract product names — {e}")
        return

    print(f"[Amazon] Found {len(names)} products\n")

    # Patch seed function once before processing products
    seed_text = patch_seed_function(seed_text)

    driver = None
    updated = 0
    failed = 0

    try:
        driver = create_driver()

        for name in names:
            print(f"[Amazon] Processing: {name}")
            try:
                image_urls = get_product_images(driver, name)
                if not image_urls:
                    raise ValueError("No images found on product page")

                seed_text = replace_image_data(seed_text, name, image_urls)
                print(f"[Amazon] SUCCESS: {name} -> {len(image_urls)} images")
                updated += 1
            except Exception as e:
                print(f"[Amazon] FAILED: {name} - {e}")
                failed += 1

            time.sleep(DELAY_SECONDS)

    finally:
        if driver:
            driver.quit()

    try:
        with open(SEED_PATH, "w", encoding="utf-8") as f:
            f.write(seed_text)
    except Exception as e:
        print(f"[Amazon] Fatal: could not write seed.ts — {e}")
        return

    print(f"\n[Amazon] Done: {updated} updated, {failed} failed")


if __name__ == "__main__":
    main()
