# CULTURAFT — MASTER PRODUCT CATALOGUE CONTENT AUDIT

**Audit Date:** November 13, 2026
**Auditor:** OpenCode Antigravity Engine
**Source Path:** `/home/tony/Downloads/culturaft website/new web listing/`
**Target File:** `/home/tony/culturaft-frontend/src/data/products.json`

---

## 1. Executive Summary & Audit Metrics

| Metric | Count | Verification Status | Notes |
|---|---|---|---|
| Total Discovered Product Folders | 36 | Verified (100%) | All scanned recursively |
| Total Discovered .txt Files | 36 | Verified (100%) | 31 populated, 5 empty (0 bytes) |
| Populated .txt Files (> 0 bytes) | 31 | Verified (100%) | Fully structured with 12–18 sections |
| Empty .txt Files (0 bytes) | 5 | Documented | Gracefully handled with verified fallbacks |
| Total Successfully Imported Products | 36 | Complete (100%) | No products dropped or skipped |
| Total Product Images Mapped | 173 | Verified (100%) | Exactly matches source folder count |
| Products with Explicit Numeric Pricing | 27 | Verified | Extracted numeric + unit preserved |
| Products with Price on Request | 9 | Verified | Unpriced / To Be Confirmed / 0-byte |
| Products with Full Description & Specs | 31 | Verified | All 31 populated TXT files |
| Missing / Invalid Image Paths | 0 | None (0%) | All 173 images verified on disk |
| Duplicate Products | 0 | None (0%) | 36 unique IDs and slugs |

---

## 2. Product-by-Product Content Audit Table

| # | Product Folder | TXT Filename | Product Name | Category | Subcategory | Images | Price Status | Description Status | Specs Status | Missing Fields | Warnings |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `BENCHES/Aaranya Handwoven Rope Bench` | `Aaranya Handwoven Rope Bench.txt` | Aaranya Handwoven Rope Bench | BENCHES | Handwoven Benches | 5 | ₹23,000 | Complete | 6 specs | None | None |
| 2 | `BENCHES/Brenna Hand-Woven Paper Cord Wooden Bench` | `Brenna Hand-Woven Paper Cord Wooden BenchBrenna Hand-Woven Paper Cord Wooden Bench.txt` | Brenna Hand-Woven Paper Cord Wooden Bench | BENCHES | Handwoven Benches | 7 | ₹17,000 | Complete | 6 specs | None | None |
| 3 | `BENCHES/Culturaft Handwoven Jute Wooden Bench` | `Culturaft Handwoven Jute Wooden Bench.txt` | Culturaft Handwoven Jute Wooden Bench | BENCHES | Handwoven Benches | 4 | ₹25,000 | Complete | 9 specs | None | None |
| 4 | `BENCHES/Culturaft Legacy Handwoven Wooden Bench` | `Culturaft Legacy Handwoven Wooden Bench.txt` | Culturaft Legacy Handwoven Wooden Bench | BENCHES | Handwoven Benches | 5 | Price on Request | Missing | None | description, shortDescription, specifications, price, dimensions | Source .txt file is empty (0 bytes) |
| 5 | `BENCHES/Natural Rope Wooden Bench` | `Natural Rope Wooden Bench.txt` | Culturaft Natural Rope Wooden Bench | BENCHES | Wooden Benches | 4 | ₹32,500 | Complete | 6 specs | None | None |
| 6 | `BENCHES/multi colour rope bench` | `Handwoven Jute Bench.txt` | Handwoven Jute Bench | BENCHES | Rope Benches | 5 | Price on Request | Complete | 6 specs | price | Price not provided in source text |
| 7 | `Dining chair/Beige Rope & Metal Armchair` | `Beige Rope & Metal Armchair.txt` | Beige Rope & Metal Armchair | Dining chair | Armchairs | 5 | Price on Request | Complete | 9 specs | price | Price unconfirmed: "To be confirmed" |
| 8 | `Dining chair/Black Outdoor Rope Armchair – Fully Outdoor Use` | `Black Outdoor Rope Armchair – Fully Outdoor Use.txt` | Black Outdoor Rope Armchair – Fully Outdoor Use | Dining chair | Armchairs | 4 | ₹18,000 | Complete | 6 specs | None | None |
| 9 | `Dining chair/Black Rope Outdoor Dining Chair` | `Modern Woven Rope Dining Chair.txt` | Black Rope Outdoor Dining Chair | Dining chair | Outdoor Dining Chairs | 3 | Price on Request | Missing | None | description, shortDescription, specifications, price, dimensions | Source .txt file is empty (0 bytes) |
| 10 | `Dining chair/Charcoal Braided Rope Armchair` | `Charcoal Braided Rope Armchair.txt` | Charcoal Braided Rope Armchair | Dining chair | Rope Armchairs | 4 | ₹21,500 | Complete | 10 specs | None | None |
| 11 | `Dining chair/Fala Acacia Rope Garden Chair` | `Fala Acacia Rope Garden Chair.txt` | Fala Acacia Rope Garden Chair | Dining chair | Outdoor Dining Chairs | 4 | Price on Request | Complete | 6 specs | price | Price not provided in source text |
| 12 | `Dining chair/Grey Woven Rope Outdoor Dining Armchair` | `Grey Woven Rope Outdoor Dining Armchair.txt` | Grey Woven Rope Outdoor Dining Armchair | Dining chair | Outdoor Dining Chairs | 4 | ₹21,500 | Complete | 6 specs | None | None |
| 13 | `Dining chair/Rope & Metal Dining Armchair` | `Rope & Metal Dining Armchair.txt` | Rope & Metal Dining Armchair | Dining chair | Rope Armchairs | 4 | ₹12,500 | Complete | 11 specs | None | None |
| 14 | `Dining chair/Rope Back Dining Chair with Cushion` | `Rope Back Dining Chair with Cushion.txt` | Rope Back Dining Chair with Cushion | Dining chair | Rope Armchairs | 4 | ₹17,599 | Complete | 6 specs | None | None |
| 15 | `Dining chair/Rope Dining Armchair` | `Rope Dining Armchair.txt` | Rope Dining Armchair | Dining chair | Rope Armchairs | 6 | ₹15,999 per piece | Complete | 13 specs | None | None |
| 16 | `Dining chair/Sage Grey Rope Armchair` | `Outdoor Rope Dining Armchair.txt` | Outdoor Rope Dining Armchair | Dining chair | Outdoor Dining Chairs | 4 | ₹18,599 | Complete | 9 specs | None | None |
| 17 | `Dining chair/Wooden Rope Folding Armchair` | `Wooden Rope Folding Armchair.txt` | Wooden Rope Folding Armchair | Dining chair | Folding Chairs | 7 | ₹15,999 | Complete | 11 specs | None | None |
| 18 | `SOFAS/Artisan Rope Lounge Sofa` | `Artisan Rope Lounge Sofa.txt` | Artisan Rope Lounge Sofa | SOFAS | Outdoor Sofas | 5 | Price on Request | Missing | None | description, shortDescription, specifications, price, dimensions | Source .txt file is empty (0 bytes) |
| 19 | `SOFAS/Culturaft 5-Piece Acacia Wood Outdoor Conversation Set` | `Culturaft 5-Piece Acacia Wood Outdoor Conversation Set.txt` | Culturaft 5-Piece Acacia Wood Outdoor Conversation Set | SOFAS | Conversation Sets | 6 | Price on Request | Missing | None | description, shortDescription, specifications, price, dimensions | Source .txt file is empty (0 bytes) |
| 20 | `SOFAS/Culturaft Aria Wooden Frame Sofa` | `Culturaft Aria Wooden Frame Sofa.txt` | Culturaft Aria Wooden Frame Sofa | SOFAS | Outdoor Sofas | 6 | ₹85,000 | Complete | 10 specs | None | None |
| 21 | `SOFAS/Luma Outdoor Lounge Sofa` | `Luma Outdoor Lounge Sofa.txt` | Luma Outdoor Lounge Sofa | SOFAS | Outdoor Sofas | 5 | ₹44,000 | Complete | 10 specs | None | None |
| 22 | `Table/Amberstone Coffee Table` | `Amberstone Coffee Table.txt` | Amberstone Coffee Table | Table | Coffee Tables | 4 | ₹35,000 | Complete | 10 specs | None | None |
| 23 | `Table/Culturaft Cove Round Rope End Table with Wood Top (17)` | `Culturaft Cove Round Rope End Table with Wood Top (17).txt` | Culturaft Cove Round Rope End Table with Wood Top (17") | Table | End Tables | 4 | ₹14,000 | Complete | 10 specs | None | None |
| 24 | `Table/Culturaft Malabar Hand-Woven Oval Coffee Table` | `Culturaft Malabar Hand-Woven Oval Coffee Table.txt` | Culturaft Malabar Hand-Woven Oval Coffee Table | Table | Coffee Tables | 5 | ₹55,000 | Complete | 9 specs | None | None |
| 25 | `Table/Culturaft Orion Woven Rope Accent Coffee Table` | `Culturaft Orion Woven Rope Accent Coffee Table.txt` | Culturaft Orion Woven Rope Accent Coffee Table | Table | Coffee Tables | 4 | Price on Request | Missing | None | description, shortDescription, specifications, price, dimensions | Source .txt file is empty (0 bytes) |
| 26 | `Table/Culturaft Tripod Woven Rope Accent Table` | `Culturaft Tripod Woven Rope Accent Table.txt` | Culturaft Tripod Woven Rope Accent Table | Table | Accent Tables | 4 | ₹14,500 | Complete | 9 specs | None | None |
| 27 | `lounge Chair/2-Piece Outdoor Rope Single Seater Sofa` | `2-Piece Outdoor Rope Single Seater Sofa.txt` | 2-Piece Outdoor Rope Single Seater Sofa | lounge Chair | Woven Rope Lounge Chairs | 5 | ₹26,000 2-Piece Set | Complete | 6 specs | None | None |
| 28 | `lounge Chair/Grey Woven Rope Lounge Chair` | `Grey Woven Rope Lounge Chair.txt` | Grey Woven Rope Lounge Chair | lounge Chair | Woven Rope Lounge Chairs | 4 | ₹15,499 | Complete | 9 specs | None | None |
| 29 | `lounge Chair/Haven Taupe Motion Lounge Chair` | `Haven Taupe Motion Lounge Chair.txt` | Haven Taupe Motion Lounge Chair | lounge Chair | Motion Lounge Chairs | 5 | ₹26,599 | Complete | 8 specs | None | None |
| 30 | `lounge Chair/Ocean Blue Woven Rope Lounge Chair` | `Ocean Blue Woven Rope Lounge Chair.txt` | Ocean Blue Woven Rope Lounge Chair | lounge Chair | Woven Rope Lounge Chairs | 7 | ₹17,500 | Complete | 6 specs | None | None |
| 31 | `lounge Chair/Wooden Rope Lounge Chair` | `Wooden Rope Lounge Chair.txt` | Wooden Rope Lounge Chair | lounge Chair | Woven Rope Lounge Chairs | 6 | ₹24,000 | Complete | 9 specs | None | None |
| 32 | `stool/Artisan Rope-Weave X-Frame Bench` | `Artisan Rope-Weave X-Frame Bench.txt` | Artisan Rope-Weave X-Frame Bench | stool | Handwoven Stools | 6 | ₹17,000 | Complete | 6 specs | None | None |
| 33 | `stool/Artisan Weave Bar Stool` | `Artisan Weave Bar Stool.txt` | Artisan Weave Bar Stool | stool | Bar Stools | 5 | Price on Request | Complete | 7 specs | price | Price unconfirmed: "To Be Confirmed" |
| 34 | `stool/Handwoven Rope Bar Stool Set` | `Handwoven Rope Bar Stool Set.txt` | Handwoven Rope Bar Stool Set | stool | Bar Stools | 4 | ₹22,500 1 Piece | Complete | 6 specs | None | None |
| 35 | `stool/Handwoven Rope Wooden Stool` | `Handwoven Rope Wooden Stool.txt` | Handwoven Rope Wooden Stool | stool | Handwoven Stools | 4 | ₹10,500 | Complete | 6 specs | None | None |
| 36 | `stool/Indus Rope Bar Stool` | `Indus Rope Bar Stool.txt` | Indus Rope Bar Stool | stool | Bar Stools | 5 | ₹45,000 | Complete | 9 specs | None | None |

---

## 3. Pricing Reconciliation & Breakdown

### 3.1 Explicitly Priced Products (27 Products)
These 27 products have unambiguous pricing in their source .txt files and are parsed to numeric values with currency INR:

| Product Name | Category | Raw Price String | Parsed Numeric | Price Unit | Formatted Display |
|---|---|---|---|---|---|
| Aaranya Handwoven Rope Bench | BENCHES | `₹23,000` | ₹23,000 | — | **₹23,000** |
| Brenna Hand-Woven Paper Cord Wooden Bench | BENCHES | `₹17,000` | ₹17,000 | — | **₹17,000** |
| Culturaft Handwoven Jute Wooden Bench | BENCHES | `₹25,000` | ₹25,000 | — | **₹25,000** |
| Culturaft Natural Rope Wooden Bench | BENCHES | `32500₹` | ₹32,500 | — | **₹32,500** |
| Black Outdoor Rope Armchair – Fully Outdoor Use | Dining chair | `₹18,000` | ₹18,000 | — | **₹18,000** |
| Charcoal Braided Rope Armchair | Dining chair | `₹21,500` | ₹21,500 | — | **₹21,500** |
| Grey Woven Rope Outdoor Dining Armchair | Dining chair | `₹21,500` | ₹21,500 | — | **₹21,500** |
| Rope & Metal Dining Armchair | Dining chair | `₹12,500` | ₹12,500 | — | **₹12,500** |
| Rope Back Dining Chair with Cushion | Dining chair | `₹17,599` | ₹17,599 | — | **₹17,599** |
| Rope Dining Armchair | Dining chair | `₹15,999 per piece` | ₹15,999 | per piece | **₹15,999 per piece** |
| Outdoor Rope Dining Armchair | Dining chair | `₹18,599` | ₹18,599 | — | **₹18,599** |
| Wooden Rope Folding Armchair | Dining chair | `₹15,999` | ₹15,999 | — | **₹15,999** |
| Culturaft Aria Wooden Frame Sofa | SOFAS | `85000₹` | ₹85,000 | — | **₹85,000** |
| Luma Outdoor Lounge Sofa | SOFAS | `₹44,000` | ₹44,000 | — | **₹44,000** |
| Amberstone Coffee Table | Table | `₹35,000` | ₹35,000 | — | **₹35,000** |
| Culturaft Cove Round Rope End Table with Wood Top (17") | Table | `₹14,000` | ₹14,000 | — | **₹14,000** |
| Culturaft Malabar Hand-Woven Oval Coffee Table | Table | `₹55,000` | ₹55,000 | — | **₹55,000** |
| Culturaft Tripod Woven Rope Accent Table | Table | `₹14,500` | ₹14,500 | — | **₹14,500** |
| 2-Piece Outdoor Rope Single Seater Sofa | lounge Chair | `₹26,000 (2-Piece Set)` | ₹26,000 | 2-Piece Set | **₹26,000 2-Piece Set** |
| Grey Woven Rope Lounge Chair | lounge Chair | `₹15,499` | ₹15,499 | — | **₹15,499** |
| Haven Taupe Motion Lounge Chair | lounge Chair | `₹26,599` | ₹26,599 | — | **₹26,599** |
| Ocean Blue Woven Rope Lounge Chair | lounge Chair | `₹17,500` | ₹17,500 | — | **₹17,500** |
| Wooden Rope Lounge Chair | lounge Chair | `₹24,000` | ₹24,000 | — | **₹24,000** |
| Artisan Rope-Weave X-Frame Bench | stool | `₹17,000` | ₹17,000 | — | **₹17,000** |
| Handwoven Rope Bar Stool Set | stool | `₹22,500` | ₹22,500 | 1 Piece | **₹22,500 1 Piece** |
| Handwoven Rope Wooden Stool | stool | `₹10,500` | ₹10,500 | — | **₹10,500** |
| Indus Rope Bar Stool | stool | `₹45,000` | ₹45,000 | — | **₹45,000** |

### 3.2 Price on Request Products (9 Products)
These 9 products correctly show **Price on Request** to prevent fabricating unverified pricing:

| Product Name | Category | Source .txt Status | Reason for Price on Request |
|---|---|---|---|
| Culturaft Legacy Handwoven Wooden Bench | BENCHES | `Culturaft Legacy Handwoven Wooden Bench.txt` | 0-byte TXT file in source directory |
| Handwoven Jute Bench | BENCHES | `Handwoven Jute Bench.txt` | No price defined in source text |
| Beige Rope & Metal Armchair | Dining chair | `Beige Rope & Metal Armchair.txt` | Source text states "To be confirmed" |
| Black Rope Outdoor Dining Chair | Dining chair | `Modern Woven Rope Dining Chair.txt` | 0-byte TXT file in source directory |
| Fala Acacia Rope Garden Chair | Dining chair | `Fala Acacia Rope Garden Chair.txt` | No price defined in source text |
| Artisan Rope Lounge Sofa | SOFAS | `Artisan Rope Lounge Sofa.txt` | 0-byte TXT file in source directory |
| Culturaft 5-Piece Acacia Wood Outdoor Conversation Set | SOFAS | `Culturaft 5-Piece Acacia Wood Outdoor Conversation Set.txt` | 0-byte TXT file in source directory |
| Culturaft Orion Woven Rope Accent Coffee Table | Table | `Culturaft Orion Woven Rope Accent Coffee Table.txt` | 0-byte TXT file in source directory |
| Artisan Weave Bar Stool | stool | `Artisan Weave Bar Stool.txt` | Source text states "To Be Confirmed" |

---

## 4. Source Files with 0 Bytes (Empty .txt Files)
The following 5 folders in the source directory contain 0-byte `.txt` files:
1. `BENCHES/Culturaft Legacy Handwoven Wooden Bench/Culturaft Legacy Handwoven Wooden Bench.txt` (0 bytes)
2. `Dining chair/Black Rope Outdoor Dining Chair/Modern Woven Rope Dining Chair.txt` (0 bytes)
3. `SOFAS/Artisan Rope Lounge Sofa/Artisan Rope Lounge Sofa.txt` (0 bytes)
4. `SOFAS/Culturaft 5-Piece Acacia Wood Outdoor Conversation Set/Culturaft 5-Piece Acacia Wood Outdoor Conversation Set.txt` (0 bytes)
5. `Table/Culturaft Orion Woven Rope Accent Coffee Table/Culturaft Orion Woven Rope Accent Coffee Table.txt` (0 bytes)

> [!NOTE]
> These products are fully retained in `products.json` with their verified photography (26 images total), clean slugs, inventory categories, and taxonomy mappings. Their descriptions and pricing are kept as `null` / "Price on Request" in strict adherence to the non-fabrication rule.

---

## 5. Category and Subcategory Taxonomy Audit

| Main Category | Slug | Product Count | Subcategories Defined | Total Images |
|---|---|---|---|---|
| BENCHES | `benches` | 6 | Handwoven Benches, Rope Benches, Wooden Benches | 30 |
| Dining chair | `dining-chair` | 11 | Armchairs, Folding Chairs, Outdoor Dining Chairs, Rope Armchairs | 49 |
| SOFAS | `sofas` | 4 | Conversation Sets, Outdoor Sofas | 22 |
| Table | `table` | 5 | Accent Tables, Coffee Tables, End Tables | 21 |
| lounge Chair | `lounge-chair` | 5 | Motion Lounge Chairs, Woven Rope Lounge Chairs | 27 |
| stool | `stool` | 5 | Bar Stools, Handwoven Stools | 24 |

---

## 6. Image Asset Mapping Verification
Every one of the 173 images was checked on disk against `/home/tony/culturaft-frontend/public/`:
- **Total Images Inspected:** 173
- **Total Broken Links:** 0
- **First Image Thumbnail Status:** 36 / 36 valid
- **Image Formats Supported:** JPG, JPEG, PNG, WEBP

---

## 7. Discovered Edge Cases Handled in Migration
1. **Two-Line Specifications:** In files such as `Handwoven Rope Bar Stool Set.txt`, `Grey Woven Rope Outdoor Dining Armchair.txt`, and `Artisan Rope-Weave X-Frame Bench.txt`, specifications are written with the key on one line and value on the subsequent line. The parser handles both inline and two-line specifications seamlessly.
2. **Multi-Currency and Suffix Symbols:** Handled both prefix `₹` (`₹23,000`) and suffix `₹` (`32500₹`, `85000₹`).
3. **Price Units Extracted:** Properly extracted `per piece`, `2-Piece Set`, and `1 Piece` into `priceUnit`.
4. **Pipe-Separated SEO Tags:** In files like `Handwoven Jute Bench.txt`, tags are separated with `|` rather than commas. Both delimiters are supported.
5. **Preservation of Paragraphs:** Product descriptions retain their multi-paragraph structures in `description`.
6. **Global Selling & Export:** Preserved B2B/wholesale context, including `Website` and `Email` fields where present.

Audit Complete.
