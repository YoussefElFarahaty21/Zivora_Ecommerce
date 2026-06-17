"""Generate products-for-image-scraping.md from seed.ts."""
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SEED_PATH = os.path.join(SCRIPT_DIR, "..", "src", "scripts", "seed.ts")
OUT_PATH = os.path.join(SCRIPT_DIR, "products-for-image-scraping.md")


def parse_products(text: str) -> list[dict]:
    block = re.search(r"const products = \[(.*?)\];", text, re.DOTALL)
    if not block:
        raise ValueError("products array not found in seed.ts")

    raw = block.group(1)
    products = []
    for m in re.finditer(
        r"\{\s*name:\s*['\"](.+?)['\"]\s*,\s*"
        r"description:\s*['\"](.+?)['\"]\s*,\s*"
        r"price:\s*(\d+)\s*,\s*category:\s*['\"](.+?)['\"]\s*,\s*stock:\s*(\d+)\s*,\s*"
        r"imageUrl:\s*(IMG\.\w+)",
        raw,
        re.DOTALL,
    ):
        products.append(
            {
                "name": m.group(1),
                "description": m.group(2),
                "price": int(m.group(3)),
                "category": m.group(4),
                "stock": int(m.group(5)),
                "image_ref": m.group(6),
            }
        )
    return products


def resolve_img_urls(text: str) -> dict[str, str]:
    return dict(re.findall(r"(\w+):\s*'(https://[^']+)'", text))


def build_md(products: list[dict], img_urls: dict[str, str]) -> str:
    # Preserve seed.ts order; section headers when category changes
    lines = [
        "# Ecommerce Product Catalog — Image URL Research",
        "",
        "Use this file to find **accurate, direct image URLs** for each product.",
        "Many current images are generic Unsplash placeholders and do not match the product name.",
        "",
        "## Your task",
        "",
        "For each product below:",
        "",
        "1. Find the **real retail product** (prefer official brand site, Amazon product page, or major retailer).",
        "2. Return **direct HTTPS image URLs** (`.jpg`, `.png`, `.webp`) that load without login.",
        "3. Prefer **high resolution** (at least 800×800). Amazon: use `hiRes` / full-size URLs, not thumbnails.",
        "4. Provide **1 main image** (`imageUrl`) plus **up to 5 extra gallery images** (`images`).",
        "5. All URLs must be **hotlinkable** (no data URIs, no pages — only image files).",
        "",
        "## Response format (JSON)",
        "",
        "Return a JSON array with one object per product, in the same order as listed:",
        "",
        "```json",
        "[",
        "  {",
        '    "index": 1,',
        '    "name": "Exact product name from this file",',
        '    "imageUrl": "https://...",',
        '    "images": ["https://...", "https://...", "https://..."]',
        "  }",
        "]",
        "```",
        "",
        "- `imageUrl` = primary thumbnail (first image shoppers see).",
        "- `images` = full gallery including `imageUrl` as first item (max 6 URLs total).",
        "- `searchQuery` (optional): Amazon/search string you used if the name alone is ambiguous.",
        "",
        "## Price note",
        "",
        "Prices in seed data are in **cents** (e.g. `17500` = $175.00).",
        "",
        "---",
        "",
        f"**Total products:** {len(products)}",
        "",
    ]

    index = 0
    current_category = None
    for p in products:
        if p["category"] != current_category:
            current_category = p["category"]
            lines.append(f"## {current_category}")
            lines.append("")
        index += 1
        ref = p["image_ref"].replace("IMG.", "")
        current = img_urls.get(ref, "(unknown)")
        price_usd = p["price"] / 100
        lines.append(f"### {index}. {p['name']}")
        lines.append("")
        lines.append(f"| Field | Value |")
        lines.append(f"|-------|-------|")
        lines.append(f"| **Category** | {p['category']} |")
        lines.append(f"| **Price** | ${price_usd:,.2f} ({p['price']} cents) |")
        lines.append(f"| **Stock** | {p['stock']} |")
        lines.append(f"| **Current placeholder** | `{p['image_ref']}` |")
        lines.append(f"| **Current imageUrl** | {current} |")
        lines.append("")
        lines.append(f"**Description:** {p['description']}")
        lines.append("")
        lines.append(
            f"**Suggested search:** `{p['name']}` "
            f"(or brand + model from description)"
        )
        lines.append("")
        lines.append("**Fill in after research:**")
        lines.append("")
        lines.append("```")
        lines.append("imageUrl: ")
        lines.append("images: [ , , , , , ]")
        lines.append("```")
        lines.append("")

    return "\n".join(lines)


def main():
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    products = parse_products(text)
    img_urls = resolve_img_urls(text)
    md = build_md(products, img_urls)

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(md)

    print(f"Wrote {len(products)} products to {OUT_PATH}")


if __name__ == "__main__":
    main()
