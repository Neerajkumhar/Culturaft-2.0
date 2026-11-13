#!/usr/bin/env node

/**
 * CULTURAFT Product Catalogue Content Extraction & Import Script
 *
 * Scans all product folders, subfolders, images, and .txt files from:
 * /home/tony/Downloads/culturaft website/new web listing/
 *
 * Imports verified content into:
 * /home/tony/culturaft-frontend/src/data/products.json
 *
 * Usage:
 *   node scripts/import-product-content.mjs [--dry-run]
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = '/home/tony/Downloads/culturaft website/new web listing'
const PROJECT_ROOT = path.resolve(__dirname, '..')
const PRODUCTS_JSON_PATH = path.join(PROJECT_ROOT, 'src/data/products.json')
const PUBLIC_PRODUCTS_IMG_DIR = path.join(PROJECT_ROOT, 'public/images/products')

const isDryRun = process.argv.includes('--dry-run')

console.log('='.repeat(70))
console.log('CULTURAFT PRODUCT CATALOGUE IMPORT')
console.log(`Source directory: ${SOURCE_DIR}`)
console.log(`Target file:      ${PRODUCTS_JSON_PATH}`)
console.log(`Mode:             ${isDryRun ? 'DRY RUN (no files modified)' : 'LIVE IMPORT'}`)
console.log('='.repeat(70))

// 1. Verify directories
if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`FATAL: Source directory does not exist: ${SOURCE_DIR}`)
  process.exit(1)
}

if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
  console.error(`FATAL: Existing products.json does not exist: ${PRODUCTS_JSON_PATH}`)
  process.exit(1)
}

// Load existing products for reference and fallback
const existingProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'))
const existingById = new Map(existingProducts.map((p) => [p.id, p]))

// Verified mapping from source folder relative path to existing product ID
const FOLDER_TO_PRODUCT_ID = {
  'BENCHES/Aaranya Handwoven Rope Bench': 'aaranya-handwoven-rope-bench',
  'BENCHES/Brenna Hand-Woven Paper Cord Wooden Bench': 'brenna-hand-woven-paper-cord-bench',
  'BENCHES/Culturaft Handwoven Jute Wooden Bench': 'culturaft-handwoven-jute-bench',
  'BENCHES/Culturaft Legacy Handwoven Wooden Bench': 'culturaft-legacy-handwoven-bench',
  'BENCHES/Natural Rope Wooden Bench': 'natural-rope-wooden-bench',
  'BENCHES/multi colour rope bench': 'multi-colour-rope-bench',

  'Dining chair/Beige Rope & Metal Armchair': 'beige-rope-metal-armchair',
  'Dining chair/Black Outdoor Rope Armchair – Fully Outdoor Use': 'black-outdoor-rope-armchair',
  'Dining chair/Black Rope Outdoor Dining Chair': 'black-rope-outdoor-dining-chair',
  'Dining chair/Charcoal Braided Rope Armchair': 'charcoal-braided-rope-armchair',
  'Dining chair/Fala Acacia Rope Garden Chair': 'fala-acacia-rope-garden-chair',
  'Dining chair/Grey Woven Rope Outdoor Dining Armchair': 'grey-woven-rope-dining-armchair',
  'Dining chair/Rope & Metal Dining Armchair': 'rope-metal-dining-armchair',
  'Dining chair/Rope Back Dining Chair with Cushion': 'rope-back-dining-chair-cushion',
  'Dining chair/Rope Dining Armchair': 'rope-dining-armchair',
  'Dining chair/Sage Grey Rope Armchair': 'sage-grey-rope-armchair',
  'Dining chair/Wooden Rope Folding Armchair': 'wooden-rope-folding-armchair',

  'SOFAS/Artisan Rope Lounge Sofa': 'artisan-rope-lounge-sofa',
  'SOFAS/Culturaft 5-Piece Acacia Wood Outdoor Conversation Set': 'culturaft-5-piece-acacia-set',
  'SOFAS/Culturaft Aria Wooden Frame Sofa': 'culturaft-aria-wooden-sofa',
  'SOFAS/Luma Outdoor Lounge Sofa': 'luma-outdoor-lounge-sofa',

  'Table/Amberstone Coffee Table': 'amberstone-coffee-table',
  'Table/Culturaft Cove Round Rope End Table with Wood Top (17)': 'culturaft-cove-round-end-table',
  'Table/Culturaft Malabar Hand-Woven Oval Coffee Table': 'culturaft-malabar-oval-coffee-table',
  'Table/Culturaft Orion Woven Rope Accent Coffee Table': 'culturaft-orion-coffee-table',
  'Table/Culturaft Tripod Woven Rope Accent Table': 'culturaft-tripod-accent-table',

  'lounge Chair/2-Piece Outdoor Rope Single Seater Sofa': '2-piece-outdoor-rope-sofa',
  'lounge Chair/Grey Woven Rope Lounge Chair': 'grey-woven-rope-lounge-chair',
  'lounge Chair/Haven Taupe Motion Lounge Chair': 'haven-taupe-motion-lounge-chair',
  'lounge Chair/Ocean Blue Woven Rope Lounge Chair': 'ocean-blue-woven-rope-lounge-chair',
  'lounge Chair/Wooden Rope Lounge Chair': 'wooden-rope-lounge-chair',

  'stool/Artisan Rope-Weave X-Frame Bench': 'artisan-rope-weave-x-frame-bench',
  'stool/Artisan Weave Bar Stool': 'artisan-weave-bar-stool',
  'stool/Handwoven Rope Bar Stool Set': 'handwoven-rope-bar-stool-set',
  'stool/Handwoven Rope Wooden Stool': 'handwoven-rope-wooden-stool',
  'stool/Indus Rope Bar Stool': 'indus-rope-bar-stool',
}

// Subcategory assignments based on taxonomy and verified attributes
const PRODUCT_SUBCATEGORY_MAP = {
  'aaranya-handwoven-rope-bench': { parent: 'Benches', subcategory: 'Handwoven Benches', slug: 'handwoven-benches' },
  'brenna-hand-woven-paper-cord-bench': { parent: 'Benches', subcategory: 'Handwoven Benches', slug: 'handwoven-benches' },
  'culturaft-handwoven-jute-bench': { parent: 'Benches', subcategory: 'Handwoven Benches', slug: 'handwoven-benches' },
  'culturaft-legacy-handwoven-bench': { parent: 'Benches', subcategory: 'Handwoven Benches', slug: 'handwoven-benches' },
  'natural-rope-wooden-bench': { parent: 'Benches', subcategory: 'Wooden Benches', slug: 'wooden-benches' },
  'multi-colour-rope-bench': { parent: 'Benches', subcategory: 'Rope Benches', slug: 'rope-benches' },

  'beige-rope-metal-armchair': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'black-outdoor-rope-armchair': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'black-rope-outdoor-dining-chair': { parent: 'Dining Chairs', subcategory: 'Outdoor Dining Chairs', slug: 'outdoor-dining-chairs' },
  'charcoal-braided-rope-armchair': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'fala-acacia-rope-garden-chair': { parent: 'Dining Chairs', subcategory: 'Outdoor Dining Chairs', slug: 'outdoor-dining-chairs' },
  'grey-woven-rope-dining-armchair': { parent: 'Dining Chairs', subcategory: 'Outdoor Dining Chairs', slug: 'outdoor-dining-chairs' },
  'rope-metal-dining-armchair': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'rope-back-dining-chair-cushion': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'rope-dining-armchair': { parent: 'Dining Chairs', subcategory: 'Rope Armchairs', slug: 'rope-armchairs' },
  'sage-grey-rope-armchair': { parent: 'Dining Chairs', subcategory: 'Outdoor Dining Chairs', slug: 'outdoor-dining-chairs' },
  'wooden-rope-folding-armchair': { parent: 'Dining Chairs', subcategory: 'Folding Chairs', slug: 'folding-chairs' },

  'artisan-rope-lounge-sofa': { parent: 'Sofas', subcategory: 'Outdoor Sofas', slug: 'outdoor-sofas' },
  'culturaft-5-piece-acacia-set': { parent: 'Sofas', subcategory: 'Conversation Sets', slug: 'conversation-sets' },
  'culturaft-aria-wooden-sofa': { parent: 'Sofas', subcategory: 'Outdoor Sofas', slug: 'outdoor-sofas' },
  'luma-outdoor-lounge-sofa': { parent: 'Sofas', subcategory: 'Outdoor Sofas', slug: 'outdoor-sofas' },

  'amberstone-coffee-table': { parent: 'Tables', subcategory: 'Coffee Tables', slug: 'coffee-tables' },
  'culturaft-cove-round-end-table': { parent: 'Tables', subcategory: 'End Tables', slug: 'end-tables' },
  'culturaft-malabar-oval-coffee-table': { parent: 'Tables', subcategory: 'Coffee Tables', slug: 'coffee-tables' },
  'culturaft-orion-coffee-table': { parent: 'Tables', subcategory: 'Coffee Tables', slug: 'coffee-tables' },
  'culturaft-tripod-accent-table': { parent: 'Tables', subcategory: 'Accent Tables', slug: 'accent-tables' },

  '2-piece-outdoor-rope-sofa': { parent: 'Lounge Chairs', subcategory: 'Woven Rope Lounge Chairs', slug: 'woven-rope-lounge-chairs' },
  'grey-woven-rope-lounge-chair': { parent: 'Lounge Chairs', subcategory: 'Woven Rope Lounge Chairs', slug: 'woven-rope-lounge-chairs' },
  'haven-taupe-motion-lounge-chair': { parent: 'Lounge Chairs', subcategory: 'Motion Lounge Chairs', slug: 'motion-lounge-chairs' },
  'ocean-blue-woven-rope-lounge-chair': { parent: 'Lounge Chairs', subcategory: 'Woven Rope Lounge Chairs', slug: 'woven-rope-lounge-chairs' },
  'wooden-rope-lounge-chair': { parent: 'Lounge Chairs', subcategory: 'Woven Rope Lounge Chairs', slug: 'woven-rope-lounge-chairs' },

  'artisan-rope-weave-x-frame-bench': { parent: 'Stools', subcategory: 'Handwoven Stools', slug: 'handwoven-stools' },
  'artisan-weave-bar-stool': { parent: 'Stools', subcategory: 'Bar Stools', slug: 'bar-stools' },
  'handwoven-rope-bar-stool-set': { parent: 'Stools', subcategory: 'Bar Stools', slug: 'bar-stools' },
  'handwoven-rope-wooden-stool': { parent: 'Stools', subcategory: 'Handwoven Stools', slug: 'handwoven-stools' },
  'indus-rope-bar-stool': { parent: 'Stools', subcategory: 'Bar Stools', slug: 'bar-stools' },
}

/**
 * Robust TXT file section parser.
 * Handles different line endings, unicode, bullet styles, and section variants.
 */
function parseTxtFile(filePath) {
  if (!fs.existsSync(filePath)) return null
  const stats = fs.statSync(filePath)
  if (stats.size === 0) return { isEmpty: true, raw: '' }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  const SECTION_HEADERS = [
    'SHORT NAME',
    'SEO TITLE',
    'PRICE',
    'SIZE / DIMENSIONS',
    'DIMENSIONS',
    'SHORT DESCRIPTION',
    'PRODUCT DESCRIPTION',
    'KEY FEATURES',
    'PRODUCT SPECIFICATIONS',
    'SPECIFICATIONS',
    'IDEAL FOR',
    'CARE INSTRUCTIONS',
    'SEARCH KEYWORDS',
    'SEO TAGS',
    'WEBSITE CATEGORY',
    'USAGE CLASSIFICATION',
    'GLOBAL SELLING & EXPORT',
    'GLOBAL SELLING & EXPORT POSITIONING',
    'GLOBAL SELLING AND EXPORT',
    'SEO META DESCRIPTION',
    'SUGGESTED URL SLUG',
    'IMAGE ALT TEXT',
    'IMAGE TITLE',
    'PRODUCT CATEGORY',
    'INDOOR / OUTDOOR CLASSIFICATION',
    'SEO NOTES',
  ]

  // Pattern matching: optional '##', header name, ':' and optional inline text
  const headerRegex = new RegExp(
    `^(?:#{1,3}\\s*)?(${SECTION_HEADERS.map((h) => h.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')).join('|')})\\s*:\\s*(.*)$`,
    'i'
  )

  const sections = {}
  let currentHeader = null
  let currentBuffer = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const match = line.match(headerRegex)

    if (match) {
      if (currentHeader) {
        sections[currentHeader] = currentBuffer.join('\n').trim()
      }
      currentHeader = match[1].toUpperCase().replace(/\s+/g, ' ')
      currentBuffer = match[2] ? [match[2]] : []
    } else {
      if (currentHeader) {
        currentBuffer.push(lines[i])
      }
    }
  }

  if (currentHeader) {
    sections[currentHeader] = currentBuffer.join('\n').trim()
  }

  return { isEmpty: false, raw: content, sections }
}

/**
 * Parse specifications key-values, handling single-line and two-line formats.
 */
function parseSpecifications(text) {
  if (!text) return {}
  const specs = {}
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    // Clean leading bullets, asterisks, markdown bold
    const line = rawLine.replace(/^[*\s•-]+/, '').replace(/\*\*/g, '').trim()

    if (line.includes(':')) {
      const colonIdx = line.indexOf(':')
      const key = line.substring(0, colonIdx).trim()
      let val = line.substring(colonIdx + 1).trim()

      // If value is empty on this line, check the next line
      if (!val && i + 1 < lines.length && !lines[i + 1].includes(':')) {
        val = lines[i + 1].trim()
        i++
      }

      if (key && val) {
        specs[key] = val
      }
    }
  }

  return specs
}

/**
 * Parse list items (Key Features, Ideal For, Care Instructions)
 */
function parseList(text) {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[*\s•-]+/, '').replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(Boolean)
}

/**
 * Parse keywords and tags (handling commas, pipes, and numbered lists)
 */
function parseKeywordsOrTags(text) {
  if (!text) return []
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

  // If numbered list lines (1. Tag)
  if (lines.length > 1 && lines.some((l) => /^\d+[\.\)]/.test(l))) {
    return lines
      .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim().replace(/[.,;]+$/, ''))
      .filter(Boolean)
  }

  // Otherwise split by commas or pipes
  const items = []
  for (const line of lines) {
    const parts = line.split(/[,|]/)
    for (const part of parts) {
      const clean = part.replace(/^\d+[\.\)]\s*/, '').trim().replace(/[.,;]+$/, '')
      if (clean && !items.includes(clean)) {
        items.push(clean)
      }
    }
  }
  return items
}

/**
 * Parse price string according to exact CULTURAFT rules.
 */
function parsePrice(priceSection, noteText = '') {
  if (!priceSection) {
    return {
      price: null,
      priceRaw: null,
      priceDisplay: 'Price on Request',
      priceUnit: null,
      priceStatus: 'on-request',
    }
  }

  const rawTrimmed = priceSection.trim()

  // Check for "To Be Confirmed" or "To be confirmed"
  if (/to\s+be\s+confirmed/i.test(rawTrimmed)) {
    return {
      price: null,
      priceRaw: rawTrimmed,
      priceDisplay: 'Price on Request',
      priceUnit: null,
      priceStatus: 'on-request',
    }
  }

  // Check unit notes (e.g. "per piece", "2-Piece Set", "1 Piece")
  let priceUnit = null
  if (/per\s+piece/i.test(rawTrimmed)) {
    priceUnit = 'per piece'
  } else if (/2-piece\s+set/i.test(rawTrimmed)) {
    priceUnit = '2-Piece Set'
  } else if (/price.*?(?:is\s+for|for)\s+(?:1\s+piece|\*\*1\s+piece\*\*)/i.test(noteText)) {
    priceUnit = '1 Piece'
  }

  // Extract numeric digits
  // Formats: "₹18,000", "32500₹", "85000₹", "₹15,999 per piece", "₹26,000 (2-Piece Set)"
  const numMatch = rawTrimmed.match(/(?:₹\s*([0-9,]+)|([0-9,]+)\s*₹)/)
  if (numMatch) {
    const digitsStr = (numMatch[1] || numMatch[2]).replace(/,/g, '')
    const numeric = parseInt(digitsStr, 10)
    if (!isNaN(numeric)) {
      const formatted = '₹' + numeric.toLocaleString('en-IN')
      return {
        price: numeric,
        priceRaw: rawTrimmed,
        priceDisplay: priceUnit ? `${formatted} ${priceUnit}` : formatted,
        priceUnit,
        priceStatus: 'available',
      }
    }
  }

  return {
    price: null,
    priceRaw: rawTrimmed,
    priceDisplay: 'Price on Request',
    priceUnit,
    priceStatus: 'on-request',
  }
}

/**
 * Extract clean materials array.
 */
function extractMaterials(specifications, existingMaterials) {
  const specMat = specifications['Material'] || specifications['Materials']
  if (specMat) {
    // Clean string: remove parenthetical notes
    const cleaned = specMat.replace(/\(.*?\)/g, '').trim()
    const split = cleaned.split(/[,/]|(?:\band\b)/i).map((s) => s.trim()).filter(Boolean)
    if (split.length > 0) return split
  }
  return existingMaterials && existingMaterials.length > 0 ? existingMaterials : null
}

/**
 * Extract contact information.
 */
function extractContact(text) {
  if (!text) return { website: null, email: null }
  const websiteMatch = text.match(/Website:\s*([^\r\n]+)/i)
  const emailMatch = text.match(/Email:\s*([^\r\n]+)/i)
  return {
    website: websiteMatch ? websiteMatch[1].trim() : null,
    email: emailMatch ? emailMatch[1].trim() : null,
  }
}

/**
 * Extract dimensions string.
 */
function extractDimensions(rawDim, specDimensions, existingDim) {
  if (rawDim) {
    // If multi-line, take the first line that contains dimension numbers
    const lines = rawDim.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    const dimLine = lines.find((l) => /\d+\s*(?:cm|w|d|h)/i.test(l)) || lines[0]
    if (dimLine) return dimLine
  }
  if (specDimensions) return specDimensions
  return existingDim || null
}

/**
 * Build the updated product catalogue.
 */
const migratedProducts = []
const auditReport = []

for (const [folderRel, productId] of Object.entries(FOLDER_TO_PRODUCT_ID)) {
  const folderAbs = path.join(SOURCE_DIR, folderRel)
  const existing = existingById.get(productId) || {}
  const [folderCat, folderName] = folderRel.split('/', 2)

  // Find TXT files in folder
  const files = fs.readdirSync(folderAbs)
  const txtFiles = files.filter((f) => f.endsWith('.txt'))
  const imageFiles = files
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => {
      // Sort numerically by file basename if possible
      const numA = parseInt(path.parse(a).name, 10)
      const numB = parseInt(path.parse(b).name, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.localeCompare(b)
    })

  const primaryTxtName = txtFiles[0] || null
  const txtPath = primaryTxtName ? path.join(folderAbs, primaryTxtName) : null
  const parsedTxt = txtPath ? parseTxtFile(txtPath) : null

  const warnings = []
  const missingFields = []

  let name = existing.name || folderName
  let seoTitle = null
  let priceRaw = null
  let price = null
  let priceUnit = null
  let priceDisplay = 'Price on Request'
  let priceStatus = 'on-request'
  let dimensions = null
  let shortDescription = null
  let description = null
  let keyFeatures = []
  let specifications = {}
  let materials = existing.materials || null
  let idealFor = []
  let careInstructions = []
  let searchKeywords = []
  let seoTags = []
  let websiteCategory = null
  let usageClassification = null
  let globalSellingExport = null
  let website = null
  let email = null

  if (!txtPath) {
    warnings.push('No .txt file found in source folder')
    missingFields.push('sourceTextFile')
  } else if (parsedTxt.isEmpty) {
    warnings.push('Source .txt file is empty (0 bytes)')
    missingFields.push('description', 'shortDescription', 'specifications', 'price', 'dimensions')
  } else {
    const sec = parsedTxt.sections

    // 1. Name
    if (sec['SHORT NAME']) {
      name = sec['SHORT NAME']
    } else {
      missingFields.push('name')
    }

    // 2. SEO Title
    seoTitle = sec['SEO TITLE'] || null

    // 3. Price
    const priceParsed = parsePrice(sec['PRICE'], parsedTxt.raw)
    price = priceParsed.price
    priceRaw = priceParsed.priceRaw
    priceDisplay = priceParsed.priceDisplay
    priceUnit = priceParsed.priceUnit
    priceStatus = priceParsed.priceStatus

    if (price === null) {
      if (priceRaw) {
        warnings.push(`Price unconfirmed: "${priceRaw}"`)
      } else {
        warnings.push('Price not provided in source text')
      }
      missingFields.push('price')
    }

    // 4. Specifications
    specifications = parseSpecifications(sec['PRODUCT SPECIFICATIONS'] || sec['SPECIFICATIONS'])

    // 5. Dimensions
    dimensions = extractDimensions(
      sec['SIZE / DIMENSIONS'] || sec['DIMENSIONS'],
      specifications['Dimensions'],
      existing.dimensions
    )
    if (!dimensions) missingFields.push('dimensions')

    // 6. Descriptions
    shortDescription = sec['SHORT DESCRIPTION'] || null
    if (!shortDescription) missingFields.push('shortDescription')

    description = sec['PRODUCT DESCRIPTION'] || null
    if (!description) missingFields.push('description')

    // 7. Key Features
    keyFeatures = parseList(sec['KEY FEATURES'])
    if (keyFeatures.length === 0) missingFields.push('keyFeatures')

    // 8. Materials
    materials = extractMaterials(specifications, existing.materials)
    if (!materials) missingFields.push('materials')

    // 9. Ideal For
    idealFor = parseList(sec['IDEAL FOR'])
    if (idealFor.length === 0) missingFields.push('idealFor')

    // 10. Care Instructions
    careInstructions = parseList(sec['CARE INSTRUCTIONS'])
    if (careInstructions.length === 0) missingFields.push('careInstructions')

    // 11. Search Keywords & SEO Tags
    searchKeywords = parseKeywordsOrTags(sec['SEARCH KEYWORDS'])
    seoTags = parseKeywordsOrTags(sec['SEO TAGS'])

    // 12. Website Category
    if (sec['WEBSITE CATEGORY']) {
      const rawCat = sec['WEBSITE CATEGORY'].split(/\r?\n/)[0].trim()
      const parts = rawCat.split(/→|->/).map((p) => p.trim()).filter(Boolean)
      const parent = parts[parts.length - 2] || parts[0]
      const sub = parts[parts.length - 1] || null
      websiteCategory = {
        path: parts,
        parent: parent,
        subcategory: sub,
        slug: sub ? sub.toLowerCase().replace(/[^a-z0-9]+/g, '-') : parent.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      }
    } else {
      const defaultTax = PRODUCT_SUBCATEGORY_MAP[productId]
      if (defaultTax) {
        websiteCategory = {
          path: [defaultTax.parent, defaultTax.subcategory],
          parent: defaultTax.parent,
          subcategory: defaultTax.subcategory,
          slug: defaultTax.slug,
        }
      }
    }

    // 13. Usage Classification
    usageClassification =
      sec['USAGE CLASSIFICATION'] ||
      sec['INDOOR / OUTDOOR CLASSIFICATION'] ||
      specifications['Usage Classification'] ||
      specifications['Usage'] ||
      null
    if (usageClassification) {
      // Clean leading markdown
      usageClassification = usageClassification.replace(/^[*\s•-]+/, '').replace(/\*\*/g, '').trim()
    }

    // 14. Global Selling & Export
    globalSellingExport =
      sec['GLOBAL SELLING & EXPORT'] ||
      sec['GLOBAL SELLING & EXPORT POSITIONING'] ||
      sec['GLOBAL SELLING AND EXPORT'] ||
      null

    // 15. Contact info
    const contact = extractContact(globalSellingExport || parsedTxt.raw)
    website = contact.website
    email = contact.email
  }

  // Fallbacks from existing products.json if missing in TXT
  if (!name) name = existing.name
  if (!dimensions && existing.dimensions) dimensions = existing.dimensions
  if (!shortDescription && existing.shortDescription) shortDescription = existing.shortDescription
  if (!description && existing.description) description = existing.description
  if (keyFeatures.length === 0 && existing.keyFeatures) keyFeatures = existing.keyFeatures
  if (Object.keys(specifications).length === 0 && existing.specifications) specifications = existing.specifications
  if (!materials && existing.materials) materials = existing.materials
  if (idealFor.length === 0 && existing.idealFor) idealFor = existing.idealFor
  if (searchKeywords.length === 0 && existing.searchKeywords) searchKeywords = existing.searchKeywords

  // Category fallback
  if (!websiteCategory) {
    const defaultTax = PRODUCT_SUBCATEGORY_MAP[productId]
    if (defaultTax) {
      websiteCategory = {
        path: [defaultTax.parent, defaultTax.subcategory],
        parent: defaultTax.parent,
        subcategory: defaultTax.subcategory,
        slug: defaultTax.slug,
      }
    }
  }

  // Preserve working public images paths
  const images = existing.images || []
  if (images.length === 0) {
    warnings.push('No images in existing product record')
    missingFields.push('images')
  }

  // Verify all image paths exist on disk
  for (const img of images) {
    const diskPath = path.join(PROJECT_ROOT, 'public', img.replace(/^\//, ''))
    if (!fs.existsSync(diskPath)) {
      warnings.push(`Image not found on disk: ${img}`)
    }
  }

  const isComplete = missingFields.length === 0

  const productRecord = {
    id: productId,
    slug: existing.slug || productId,
    name,
    seoTitle,
    price,
    priceRaw,
    priceDisplay,
    currency: 'INR',
    priceUnit,
    priceStatus,
    dimensions,
    shortDescription,
    description,
    keyFeatures,
    specifications,
    materials,
    idealFor,
    careInstructions,
    searchKeywords,
    seoTags,
    websiteCategory,
    category: folderCat, // Backward compatibility
    inventoryCategory: folderCat,
    usageClassification,
    globalSellingExport,
    website,
    email,
    images,
    sourceTextFile: primaryTxtName,
    sourceFolder: folderRel,
    dataCompleteness: {
      isComplete,
      missingFields,
      warnings,
    },
  }

  migratedProducts.push(productRecord)

  auditReport.push({
    folder: folderRel,
    txtFile: primaryTxtName || 'MISSING',
    name,
    category: folderCat,
    subcategory: websiteCategory?.subcategory || 'N/A',
    imageCount: images.length,
    priceStatus: priceStatus === 'available' ? priceDisplay : 'on-request',
    descriptionStatus: description ? 'complete' : 'missing',
    specificationsCount: Object.keys(specifications).length,
    missingFields,
    warnings,
  })
}

// 7. Write to products.json if not dry-run
if (!isDryRun) {
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(migratedProducts, null, 2) + '\n', 'utf-8')
  console.log(`\nSUCCESS: Wrote ${migratedProducts.length} verified products to ${PRODUCTS_JSON_PATH}`)
} else {
  console.log(`\nDRY RUN: Evaluated ${migratedProducts.length} products without modifying disk.`)
}

// Summary Statistics
const totalWithPrice = migratedProducts.filter((p) => p.priceStatus === 'available').length
const totalOnRequest = migratedProducts.filter((p) => p.priceStatus === 'on-request').length
const totalComplete = migratedProducts.filter((p) => p.dataCompleteness.isComplete).length
const totalWithDesc = migratedProducts.filter((p) => p.description !== null).length
const totalWithSpecs = migratedProducts.filter((p) => Object.keys(p.specifications).length > 0).length
const totalImages = migratedProducts.reduce((sum, p) => sum + p.images.length, 0)

console.log('\n--- MIGRATION AUDIT SUMMARY ---')
console.log(`Total Products Discovered:       ${migratedProducts.length}`)
console.log(`Products With Explicit Price:   ${totalWithPrice}`)
console.log(`Products Price on Request:      ${totalOnRequest}`)
console.log(`Products With Full Description: ${totalWithDesc}`)
console.log(`Products With Specifications:   ${totalWithSpecs}`)
console.log(`Total Images Mapped:            ${totalImages}`)
console.log(`Products Fully Complete:        ${totalComplete} / ${migratedProducts.length}`)
console.log('-------------------------------\n')
