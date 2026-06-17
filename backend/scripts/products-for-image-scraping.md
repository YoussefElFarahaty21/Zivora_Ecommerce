# Ecommerce Product Catalog — Image URL Research

Use this file to find **accurate, direct image URLs** for each product.
Many current images are generic Unsplash placeholders and do not match the product name.

## Your task

For each product below:

1. Find the **real retail product** (prefer official brand site, Amazon product page, or major retailer).
2. Return **direct HTTPS image URLs** (`.jpg`, `.png`, `.webp`) that load without login.
3. Prefer **high resolution** (at least 800×800). Amazon: use `hiRes` / full-size URLs, not thumbnails.
4. Provide **1 main image** (`imageUrl`) plus **up to 5 extra gallery images** (`images`).
5. All URLs must be **hotlinkable** (no data URIs, no pages — only image files).

## Response format (JSON)

Return a JSON array with one object per product, in the same order as listed:

```json
[
  {
    "index": 1,
    "name": "Exact product name from this file",
    "imageUrl": "https://...",
    "images": ["https://...", "https://...", "https://..."]
  }
]
```

- `imageUrl` = primary thumbnail (first image shoppers see).
- `images` = full gallery including `imageUrl` as first item (max 6 URLs total).
- `searchQuery` (optional): Amazon/search string you used if the name alone is ambiguous.

## Price note

Prices in seed data are in **cents** (e.g. `17500` = $175.00).

---

**Total products:** 72

## Electronics

### 1. Sony WH-1000XM5 Wireless Headphones

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $175.00 (17500 cents) |
| **Stock** | 38 |
| **Current placeholder** | `IMG.headphones` |
| **Current imageUrl** | https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop |

**Description:** Industry-leading noise cancellation with 30-hour battery life, multipoint connection, and crystal-clear hands-free calling.

**Suggested search:** `Sony WH-1000XM5 Wireless Headphones` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 2. Apple Watch Series 9

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $215.00 (21500 cents) |
| **Stock** | 25 |
| **Current placeholder** | `IMG.watch` |
| **Current imageUrl** | https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop |

**Description:** Advanced health sensors including blood oxygen, ECG, and crash detection. Bright always-on Retina display. Water resistant 50m.

**Suggested search:** `Apple Watch Series 9` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 3. MacBook Air M3 13"

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $550.00 (55000 cents) |
| **Stock** | 15 |
| **Current placeholder** | `IMG.laptop` |
| **Current imageUrl** | https://images.unsplash.com/photo-1496181206931-135228935ed8?w=400&h=400&fit=crop |

**Description:** Supercharged by M3 chip. Up to 18-hour battery, 8GB unified memory, Liquid Retina display. Fanless and completely silent.

**Suggested search:** `MacBook Air M3 13"` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 4. iPhone 15 Pro

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $500.00 (50000 cents) |
| **Stock** | 20 |
| **Current placeholder** | `IMG.iphone` |
| **Current imageUrl** | https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop |

**Description:** Titanium design with A17 Pro chip, 48MP camera, 5x optical zoom, customizable Action button, USB-C with USB 3 speeds.

**Suggested search:** `iPhone 15 Pro` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 5. Sony WF-1000XM5 Earbuds

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $140.00 (14000 cents) |
| **Stock** | 44 |
| **Current placeholder** | `IMG.headphones` |
| **Current imageUrl** | https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop |

**Description:** Best-in-class noise cancellation, LDAC Hi-Res audio, 8-hour battery (24 total with case). IPX4 splash resistant.

**Suggested search:** `Sony WF-1000XM5 Earbuds` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 6. Mechanical Gaming Keyboard

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $70.00 (7000 cents) |
| **Stock** | 60 |
| **Current placeholder** | `IMG.monitor` |
| **Current imageUrl** | https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop |

**Description:** TKL keyboard with Cherry MX switches, per-key RGB, aircraft-grade aluminium frame. Detachable USB-C cable, PBT keycaps.

**Suggested search:** `Mechanical Gaming Keyboard` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 7. Sony Alpha A7 IV Camera

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $1,250.00 (125000 cents) |
| **Stock** | 8 |
| **Current placeholder** | `IMG.camera` |
| **Current imageUrl** | https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop |

**Description:** Full-frame mirrorless, 33MP sensor, real-time AF, 4K 60fps video, 5-axis IBIS. Professional grade.

**Suggested search:** `Sony Alpha A7 IV Camera` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 8. JBL Charge 5 Bluetooth Speaker

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $90.00 (9000 cents) |
| **Stock** | 55 |
| **Current placeholder** | `IMG.speaker` |
| **Current imageUrl** | https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop |

**Description:** 20-hour playtime, IP67 waterproof, built-in powerbank, bold JBL Pro Sound. PartyBoost compatible.

**Suggested search:** `JBL Charge 5 Bluetooth Speaker` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 9. LG 27" 4K UHD Monitor

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $275.00 (27500 cents) |
| **Stock** | 18 |
| **Current placeholder** | `IMG.monitor` |
| **Current imageUrl** | https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop |

**Description:** IPS panel, 3840×2160, 99% sRGB, HDR10, USB-C PD 96W. Ergonomic stand with height, tilt and swivel.

**Suggested search:** `LG 27" 4K UHD Monitor` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 10. Logitech MX Master 3S Mouse

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $50.00 (5000 cents) |
| **Stock** | 72 |
| **Current placeholder** | `IMG.monitor` |
| **Current imageUrl** | https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop |

**Description:** MagSpeed electromagnetic scrolling, 8K DPI, quiet clicks, multi-device connectivity. 70-day battery life.

**Suggested search:** `Logitech MX Master 3S Mouse` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 11. iPad Pro 12.9" M2

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $550.00 (55000 cents) |
| **Stock** | 12 |
| **Current placeholder** | `IMG.tablet` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544244015-0df4cec9d125?w=400&h=400&fit=crop |

**Description:** M2 chip, Liquid Retina XDR, Apple Pencil hover, Wi-Fi 6E, Thunderbolt. ProRes video recording.

**Suggested search:** `iPad Pro 12.9" M2` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 12. Anker 15W Wireless Charging Pad

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $18.00 (1800 cents) |
| **Stock** | 110 |
| **Current placeholder** | `IMG.iphone` |
| **Current imageUrl** | https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop |

**Description:** 15W Qi fast charger. Slim profile, LED indicator, temperature control, anti-slip surface. Charges through cases up to 5mm.

**Suggested search:** `Anker 15W Wireless Charging Pad` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 13. GoPro HERO12 Black

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $200.00 (20000 cents) |
| **Stock** | 22 |
| **Current placeholder** | `IMG.camera` |
| **Current imageUrl** | https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop |

**Description:** 5.3K60 video, 27MP photos, HyperSmooth 6.0. Waterproof to 33ft without housing.

**Suggested search:** `GoPro HERO12 Black` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 14. Nintendo Switch OLED

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $175.00 (17500 cents) |
| **Stock** | 30 |
| **Current placeholder** | `IMG.tablet` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544244015-0df4cec9d125?w=400&h=400&fit=crop |

**Description:** Play at home or on the go with a vibrant 7" OLED screen, enhanced audio, wide adjustable stand and 64GB storage.

**Suggested search:** `Nintendo Switch OLED` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 15. 12-in-1 USB-C Hub

| Field | Value |
|-------|-------|
| **Category** | Electronics |
| **Price** | $35.00 (3500 cents) |
| **Stock** | 85 |
| **Current placeholder** | `IMG.monitor` |
| **Current imageUrl** | https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop |

**Description:** 4K HDMI, 3×USB-A, 2×USB-C, SD card reader, Ethernet, 100W PD pass-through in a compact aluminium body.

**Suggested search:** `12-in-1 USB-C Hub` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Clothing

### 16. Premium Oversized Hoodie

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $24.00 (2400 cents) |
| **Stock** | 140 |
| **Current placeholder** | `IMG.hoodie` |
| **Current imageUrl** | https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop |

**Description:** Ultra-soft 400GSM cotton fleece, relaxed fit, kangaroo pocket, ribbed cuffs. Preshrunk garment-dyed.

**Suggested search:** `Premium Oversized Hoodie` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 17. Nike Air Max 270 Sneakers

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $45.00 (4500 cents) |
| **Stock** | 65 |
| **Current placeholder** | `IMG.sneakers` |
| **Current imageUrl** | https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop |

**Description:** Max Air heel cushioning, breathable mesh upper, rubber outsole. Iconic everyday design.

**Suggested search:** `Nike Air Max 270 Sneakers` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 18. Genuine Leather Bomber Jacket

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $117.00 (11700 cents) |
| **Stock** | 14 |
| **Current placeholder** | `IMG.jacket` |
| **Current imageUrl** | https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop |

**Description:** Full-grain cowhide leather, wool-blend lining, YKK zippers, ribbed collar and cuffs. Gets better with age.

**Suggested search:** `Genuine Leather Bomber Jacket` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 19. Essential White T-Shirt

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $9.00 (900 cents) |
| **Stock** | 300 |
| **Current placeholder** | `IMG.tshirt` |
| **Current imageUrl** | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop |

**Description:** Premium 200GSM Supima cotton, tailored fit, crew neck, pre-shrunk, anti-fade, reinforced seams.

**Suggested search:** `Essential White T-Shirt` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 20. Slim Fit Stretch Jeans

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $27.00 (2700 cents) |
| **Stock** | 95 |
| **Current placeholder** | `IMG.jeans` |
| **Current imageUrl** | https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop |

**Description:** Italian denim with 2% elastane. Selvedge edges, YKK hardware, fading that improves with wear.

**Suggested search:** `Slim Fit Stretch Jeans` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 21. Floral Midi Dress

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $21.00 (2100 cents) |
| **Stock** | 55 |
| **Current placeholder** | `IMG.dress` |
| **Current imageUrl** | https://images.unsplash.com/photo-1496747986635-d4d2f8cd4fd5?w=400&h=400&fit=crop |

**Description:** Lightweight viscose floral-print wrap dress with adjustable tie-waist and flutter sleeves.

**Suggested search:** `Floral Midi Dress` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 22. Vintage Baseball Cap

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $10.50 (1050 cents) |
| **Stock** | 180 |
| **Current placeholder** | `IMG.tshirt` |
| **Current imageUrl** | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop |

**Description:** Unstructured 6-panel cap, adjustable brass buckle, pre-curved brim. 100% washed cotton canvas.

**Suggested search:** `Vintage Baseball Cap` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 23. Chelsea Leather Boots

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $66.00 (6600 cents) |
| **Stock** | 28 |
| **Current placeholder** | `IMG.sneakers` |
| **Current imageUrl** | https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop |

**Description:** Handcrafted full-grain leather, elastic side panels, pull tabs, rubber lug sole. Goodyear welt.

**Suggested search:** `Chelsea Leather Boots` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 24. Cashmere Crew Neck Sweater

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $54.00 (5400 cents) |
| **Stock** | 40 |
| **Current placeholder** | `IMG.hoodie` |
| **Current imageUrl** | https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop |

**Description:** Grade-A Mongolian cashmere, classic crew neck fit, anti-pilling treated. Dry clean or gentle machine wash.

**Suggested search:** `Cashmere Crew Neck Sweater` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 25. Double-Breasted Trench Coat

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $90.00 (9000 cents) |
| **Stock** | 20 |
| **Current placeholder** | `IMG.jacket` |
| **Current imageUrl** | https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop |

**Description:** Water-repellent gabardine, storm flap, D-ring belt, removable lining. A timeless investment piece.

**Suggested search:** `Double-Breasted Trench Coat` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 26. Athletic Running Shorts

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $13.50 (1350 cents) |
| **Stock** | 120 |
| **Current placeholder** | `IMG.tshirt` |
| **Current imageUrl** | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop |

**Description:** Lightweight 4-way stretch, built-in liner, side pockets, reflective details. 5" inseam.

**Suggested search:** `Athletic Running Shorts` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 27. Merino Wool Crew Socks (3-Pack)

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $7.50 (750 cents) |
| **Stock** | 250 |
| **Current placeholder** | `IMG.sneakers` |
| **Current imageUrl** | https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop |

**Description:** Merino wool, arch support, cushioned sole, seamless toe. Odour-resistant, machine washable. 3 pairs.

**Suggested search:** `Merino Wool Crew Socks (3-Pack)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 28. Linen Button-Down Shirt

| Field | Value |
|-------|-------|
| **Category** | Clothing |
| **Price** | $18.00 (1800 cents) |
| **Stock** | 88 |
| **Current placeholder** | `IMG.tshirt` |
| **Current imageUrl** | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop |

**Description:** Relaxed-fit linen, mother-of-pearl buttons, chest pocket, side vents. Breathable and wrinkle-resistant.

**Suggested search:** `Linen Button-Down Shirt` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Books

### 29. Clean Code by Robert C. Martin

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $5.25 (525 cents) |
| **Stock** | 200 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** Best practices for writing readable, maintainable, efficient code. Required reading for every developer.

**Suggested search:** `Clean Code by Robert C. Martin` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 30. Atomic Habits by James Clear

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $2.85 (285 cents) |
| **Stock** | 300 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Build good habits and break bad ones. Over 10 million copies sold. Strategies backed by science.

**Suggested search:** `Atomic Habits by James Clear` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 31. Sapiens: A Brief History of Humankind

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $2.55 (255 cents) |
| **Stock** | 180 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** Harari explores how biology and history defined us. A sweeping journey through human history.

**Suggested search:** `Sapiens: A Brief History of Humankind` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 32. The Design of Everyday Things

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $3.45 (345 cents) |
| **Stock** | 150 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Don Norman's classic on user-centred design. Indispensable for designers and engineers.

**Suggested search:** `The Design of Everyday Things` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 33. Rich Dad Poor Dad

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $2.25 (225 cents) |
| **Stock** | 220 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** Kiyosaki shares lessons about money, investing, and wealth from his two father figures.

**Suggested search:** `Rich Dad Poor Dad` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 34. Thinking, Fast and Slow

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $2.70 (270 cents) |
| **Stock** | 160 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Kahneman's exploration of System 1 and System 2 thinking and how they shape decisions.

**Suggested search:** `Thinking, Fast and Slow` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 35. The Lean Startup

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $3.00 (300 cents) |
| **Stock** | 130 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** Build-Measure-Learn: the revolutionary approach to building businesses adopted by startups worldwide.

**Suggested search:** `The Lean Startup` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 36. The Pragmatic Programmer

| Field | Value |
|-------|-------|
| **Category** | Books |
| **Price** | $6.00 (600 cents) |
| **Stock** | 110 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Timeless advice on craft, tools, and habits that help developers go from journeyman to master.

**Suggested search:** `The Pragmatic Programmer` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Home & Garden

### 37. Minimalist Adjustable Desk Lamp

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $21.00 (2100 cents) |
| **Stock** | 80 |
| **Current placeholder** | `IMG.lamp` |
| **Current imageUrl** | https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop |

**Description:** LED, 5 colour temps, stepless dimming, 360° flexible arm, USB-A charging port. 50,000-hour lifespan.

**Suggested search:** `Minimalist Adjustable Desk Lamp` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 38. Handcrafted Pour-Over Coffee Set

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $28.00 (2800 cents) |
| **Stock** | 45 |
| **Current placeholder** | `IMG.coffee` |
| **Current imageUrl** | https://images.unsplash.com/photo-1495474472359-6f175b4a73ca?w=400&h=400&fit=crop |

**Description:** Borosilicate glass dripper, bamboo stand, 600ml carafe, 40 paper filters. Dishwasher-safe.

**Suggested search:** `Handcrafted Pour-Over Coffee Set` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 39. Matte Ceramic Plant Pot Set (3 pcs)

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $15.75 (1575 cents) |
| **Stock** | 65 |
| **Current placeholder** | `IMG.chair` |
| **Current imageUrl** | https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop |

**Description:** Handmade 4", 6", 8" matte ceramic pots in earth tones. Drainage hole + matching saucer.

**Suggested search:** `Matte Ceramic Plant Pot Set (3 pcs)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 40. Luxury Soy Wax Candle

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $13.65 (1365 cents) |
| **Stock** | 95 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** 300g soy wax, cedarwood & vanilla scent. 55-hour burn, cotton wick, reusable glass vessel.

**Suggested search:** `Luxury Soy Wax Candle` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 41. Memory Foam Body Pillow

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $24.50 (2450 cents) |
| **Stock** | 55 |
| **Current placeholder** | `IMG.chair` |
| **Current imageUrl** | https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop |

**Description:** Shredded memory foam, bamboo-derived cover, adjustable fill, hypoallergenic. Machine-washable cover.

**Suggested search:** `Memory Foam Body Pillow` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 42. High-Speed Professional Blender

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $52.50 (5250 cents) |
| **Stock** | 35 |
| **Current placeholder** | `IMG.blender` |
| **Current imageUrl** | https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop |

**Description:** 1800W, 6 hardened steel blades. Crushes ice, blends smoothies. 64oz BPA-free jar, self-cleaning.

**Suggested search:** `High-Speed Professional Blender` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 43. Smart HEPA Air Purifier

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $70.00 (7000 cents) |
| **Stock** | 28 |
| **Current placeholder** | `IMG.blender` |
| **Current imageUrl** | https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop |

**Description:** 500 sq ft coverage. 3-stage HEPA, 99.97% particle removal. Auto mode, air quality sensor, sleep mode.

**Suggested search:** `Smart HEPA Air Purifier` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 44. Non-Stick Cookware Set (5 pcs)

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $45.50 (4550 cents) |
| **Stock** | 40 |
| **Current placeholder** | `IMG.blender` |
| **Current imageUrl** | https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop |

**Description:** Hard-anodised aluminium, PFOA-free coating, riveted handles, glass lids. Oven-safe 400°F.

**Suggested search:** `Non-Stick Cookware Set (5 pcs)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 45. 15lb Weighted Blanket

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $31.50 (3150 cents) |
| **Stock** | 50 |
| **Current placeholder** | `IMG.chair` |
| **Current imageUrl** | https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop |

**Description:** Glass-bead filling, breathable cotton shell, duvet-style cover. Reduces anxiety and improves sleep.

**Suggested search:** `15lb Weighted Blanket` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 46. Bamboo Desk Organizer

| Field | Value |
|-------|-------|
| **Category** | Home & Garden |
| **Price** | $11.55 (1155 cents) |
| **Stock** | 90 |
| **Current placeholder** | `IMG.lamp` |
| **Current imageUrl** | https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop |

**Description:** Modular bamboo, 7 compartments for pens, cables, notebooks, phones. Lightweight, eco-friendly.

**Suggested search:** `Bamboo Desk Organizer` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Sports

### 47. Premium Natural Rubber Yoga Mat

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $20.70 (2070 cents) |
| **Stock** | 90 |
| **Current placeholder** | `IMG.yogamat` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544367654-df4f64d02619?w=400&h=400&fit=crop |

**Description:** 6mm natural rubber, alignment lines, superior grip, antimicrobial coating. Includes carrying strap.

**Suggested search:** `Premium Natural Rubber Yoga Mat` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 48. PowerBlock Adjustable Dumbbells

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $90.00 (9000 cents) |
| **Stock** | 18 |
| **Current placeholder** | `IMG.dumbbells` |
| **Current imageUrl** | https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop |

**Description:** Replace 16 pairs in one compact set. 5–50 lbs quick-change. Urethane-coated steel.

**Suggested search:** `PowerBlock Adjustable Dumbbells` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 49. Hydro Flask 32oz Water Bottle

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $15.00 (1500 cents) |
| **Stock** | 120 |
| **Current placeholder** | `IMG.waterbottle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop |

**Description:** TempShield insulation: cold 24h, hot 12h. 18/8 stainless steel, BPA-free, powder coat, Flex Cap.

**Suggested search:** `Hydro Flask 32oz Water Bottle` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 50. Resistance Band Set (5 levels)

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $9.00 (900 cents) |
| **Stock** | 150 |
| **Current placeholder** | `IMG.dumbbells` |
| **Current imageUrl** | https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop |

**Description:** Latex-free fabric bands in 5 progressive levels. Anti-slip, wide fit, portable carry bag.

**Suggested search:** `Resistance Band Set (5 levels)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 51. Speed Jump Rope Pro

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $7.50 (750 cents) |
| **Stock** | 200 |
| **Current placeholder** | `IMG.dumbbells` |
| **Current imageUrl** | https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop |

**Description:** Ball-bearing rope, adjustable 10ft cable, foam grips, counter. Boxing, HIIT, competitive.

**Suggested search:** `Speed Jump Rope Pro` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 52. Road Bike Helmet MIPS

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $36.00 (3600 cents) |
| **Stock** | 32 |
| **Current placeholder** | `IMG.waterbottle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop |

**Description:** 25 vents, aerodynamic shell, Fidlock magnetic buckle, LED tail light. CPSC + CE EN1078 certified.

**Suggested search:** `Road Bike Helmet MIPS` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 53. Pro Sports Gym Bag 40L

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $18.00 (1800 cents) |
| **Stock** | 75 |
| **Current placeholder** | `IMG.waterbottle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop |

**Description:** 600D polyester, shoe compartment, wet pocket, laptop sleeve, water bottle pocket.

**Suggested search:** `Pro Sports Gym Bag 40L` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 54. High-Density Foam Roller

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $10.50 (1050 cents) |
| **Stock** | 100 |
| **Current placeholder** | `IMG.yogamat` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544367654-df4f64d02619?w=400&h=400&fit=crop |

**Description:** 13" EPP foam, textured surface for deep-tissue massage. 300 lb capacity. Includes exercise guide.

**Suggested search:** `High-Density Foam Roller` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 55. Doorframe Pull-Up Bar

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $12.00 (1200 cents) |
| **Stock** | 85 |
| **Current placeholder** | `IMG.dumbbells` |
| **Current imageUrl** | https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop |

**Description:** No-screw, fits 24–32" doorframes. 330 lb rated. Foam grips, multiple grip positions.

**Suggested search:** `Doorframe Pull-Up Bar` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 56. Smart Fitness Tracker Band

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $24.00 (2400 cents) |
| **Stock** | 60 |
| **Current placeholder** | `IMG.watch` |
| **Current imageUrl** | https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop |

**Description:** 24/7 HR, SpO2, sleep tracking, 5ATM, 14-day battery. 20+ workout modes, smartphone notifications.

**Suggested search:** `Smart Fitness Tracker Band` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 57. Insulated Gym Protein Shaker

| Field | Value |
|-------|-------|
| **Category** | Sports |
| **Price** | $6.00 (600 cents) |
| **Stock** | 160 |
| **Current placeholder** | `IMG.waterbottle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop |

**Description:** 700ml BPA-free, stainless mixing ball, leak-proof lid, carry loop, powder compartment. Dishwasher-safe.

**Suggested search:** `Insulated Gym Protein Shaker` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Toys

### 58. LEGO Architecture Skyline Set

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $18.00 (1800 cents) |
| **Stock** | 45 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** 744-piece skyline with iconic landmarks. Ages 12+. Detailed instructions and backstory booklet.

**Suggested search:** `LEGO Architecture Skyline Set` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 59. Strategy Board Game: Catan

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $13.50 (1350 cents) |
| **Stock** | 55 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Settlement-building for 3–4 players. Modular hex board, new island every game.

**Suggested search:** `Strategy Board Game: Catan` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 60. RC Off-Road Truck 1:16

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $24.00 (2400 cents) |
| **Stock** | 30 |
| **Current placeholder** | `IMG.camera` |
| **Current imageUrl** | https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop |

**Description:** 4WD, 2.4GHz control, independent suspension, 40+ km/h. LiPo battery included.

**Suggested search:** `RC Off-Road Truck 1:16` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 61. Mega Building Blocks Set (500 pcs)

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $10.50 (1050 cents) |
| **Stock** | 70 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** Oversized STEM blocks in 10 colours. Fine motor skills, creativity. Ages 3+. BPA-free.

**Suggested search:** `Mega Building Blocks Set (500 pcs)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 62. 1000-Piece Panoramic Jigsaw Puzzle

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $6.90 (690 cents) |
| **Stock** | 80 |
| **Current placeholder** | `IMG.notebook` |
| **Current imageUrl** | https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop |

**Description:** Mountain landscape on recycled board, linen finish. Completed size: 70×50 cm.

**Suggested search:** `1000-Piece Panoramic Jigsaw Puzzle` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 63. Kids Science Lab Kit

| Field | Value |
|-------|-------|
| **Category** | Toys |
| **Price** | $15.00 (1500 cents) |
| **Stock** | 40 |
| **Current placeholder** | `IMG.book` |
| **Current imageUrl** | https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop |

**Description:** 30+ STEM experiments in chemistry, physics and biology. Goggles, lab coat, beakers, guide. Ages 8+.

**Suggested search:** `Kids Science Lab Kit` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

## Beauty

### 64. Vitamin C + Hyaluronic Acid Serum

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $16.50 (1650 cents) |
| **Stock** | 115 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** 20% Vitamin C, ferulic acid stabiliser. Brightens, firms, hydrates. 30ml, all skin types.

**Suggested search:** `Vitamin C + Hyaluronic Acid Serum` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 65. Luxury Botanical Perfume Set

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $36.00 (3600 cents) |
| **Stock** | 40 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Three 30ml EDPs with 100% natural extracts. Jasmine & Sandalwood · Cedar & Bergamot · Rose & Oud.

**Suggested search:** `Luxury Botanical Perfume Set` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 66. Velvet Matte Lipstick Set (6 Shades)

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $12.90 (1290 cents) |
| **Stock** | 85 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Long-wear matte with Vitamin E & argan oil. 6 curated shades. Cruelty-free, vegan.

**Suggested search:** `Velvet Matte Lipstick Set (6 Shades)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 67. Deep Hydration Sheet Mask (10-Pack)

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $7.50 (750 cents) |
| **Stock** | 200 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Korean beauty masks with hyaluronic acid, niacinamide, green tea. Plump skin in 20 minutes.

**Suggested search:** `Deep Hydration Sheet Mask (10-Pack)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 68. Retinol Night Repair Cream

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $19.50 (1950 cents) |
| **Stock** | 70 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** 0.3% encapsulated retinol, peptides, ceramides. Reduces fine lines, evens tone. 50ml, fragrance-free.

**Suggested search:** `Retinol Night Repair Cream` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 69. 18-Shade Pro Eyeshadow Palette

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $15.00 (1500 cents) |
| **Stock** | 60 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** 12 mattes + 6 shimmers, zero fallout, long-wear. Dual-ended brush included. Cruelty-free.

**Suggested search:** `18-Shade Pro Eyeshadow Palette` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 70. Hair Growth Biotin Serum

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $13.50 (1350 cents) |
| **Stock** | 90 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Biotin, caffeine & peptides. Reduces hair loss, promotes new growth. 60ml dropper bottle.

**Suggested search:** `Hair Growth Biotin Serum` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 71. Rose Quartz Facial Roller

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $9.00 (900 cents) |
| **Stock** | 130 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Dual-ended rose quartz roller. Reduces puffiness, aids absorption. Ergonomic handle + velvet pouch.

**Suggested search:** `Rose Quartz Facial Roller` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```

### 72. Artisan Natural Soap Set (6 bars)

| Field | Value |
|-------|-------|
| **Category** | Beauty |
| **Price** | $11.10 (1110 cents) |
| **Stock** | 100 |
| **Current placeholder** | `IMG.candle` |
| **Current imageUrl** | https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop |

**Description:** Cold-process bars with shea butter, coconut oil, essential oils. Lavender · Eucalyptus · Citrus · Charcoal · Rose · Oatmeal.

**Suggested search:** `Artisan Natural Soap Set (6 bars)` (or brand + model from description)

**Fill in after research:**

```
imageUrl: 
images: [ , , , , , ]
```
