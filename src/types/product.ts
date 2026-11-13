/**
 * Product category - matches one of the 6 main categories for backward compatibility
 */
export type ProductCategory =
  | 'BENCHES'
  | 'Dining chair'
  | 'lounge Chair'
  | 'SOFAS'
  | 'stool'
  | 'Table'

/**
 * Website category hierarchy info
 */
export interface WebsiteCategoryInfo {
  path: string[]
  parent: string
  subcategory: string | null
  slug: string
}

/**
 * Data completeness tracking
 */
export interface DataCompleteness {
  isComplete: boolean
  missingFields: string[]
  warnings: string[]
}

/**
 * Complete Product data model for Culturaft furniture catalogue.
 * Supports all 17 sections from the source TXT specifications.
 * Preserves exact original values alongside structured parsed values.
 */
export interface Product {
  /** Unique product ID (slug-derived) */
  id: string
  /** URL-friendly identifier */
  slug: string

  /** Verified short product name from source .txt file */
  name: string
  /** SEO Title from .txt file (or null) */
  seoTitle: string | null

  /** Numeric price in INR (null if not explicitly provided or on-request) */
  price: number | null
  /** Raw unparsed price string from source .txt (e.g. "₹18,000", "₹15,999 per piece", or null) */
  priceRaw: string | null
  /** Formatted price for display (e.g. "₹18,000", "Price on Request") */
  priceDisplay: string
  /** Currency code - always INR for Culturaft */
  currency: 'INR'
  /** Price unit designation (e.g. "per piece", "1 Piece", "2-Piece Set", or null) */
  priceUnit: string | null
  /** Pricing status: available with numeric price or on-request */
  priceStatus: 'available' | 'on-request'

  /** Dimensions string from .txt file (e.g. "56 cm (W) × 48 cm (D) × 84 cm (H)") */
  dimensions: string | null

  /** Short product description from .txt file */
  shortDescription: string | null
  /** Full product description from .txt file (paragraphs preserved) */
  description: string | null

  /** Array of key features from .txt KEY FEATURES section */
  keyFeatures: string[]

  /** Specifications object parsed from .txt PRODUCT SPECIFICATIONS section */
  specifications: Record<string, string | number | boolean | null>

  /** Array of material names parsed or extracted from .txt file */
  materials: string[] | null

  /** Ideal use cases from .txt IDEAL FOR section */
  idealFor: string[]
  /** Care instructions from .txt CARE INSTRUCTIONS section */
  careInstructions: string[]
  /** Search keywords from .txt SEARCH KEYWORDS section */
  searchKeywords: string[]
  /** SEO tags from .txt SEO TAGS section */
  seoTags: string[]

  /** Website category hierarchy from .txt WEBSITE CATEGORY or navigation taxonomy */
  websiteCategory: WebsiteCategoryInfo | null

  /** Category name for backward compatibility */
  category: ProductCategory
  /** Source folder inventory category for traceability */
  inventoryCategory: string

  /** Indoor / Outdoor usage classification from .txt USAGE CLASSIFICATION */
  usageClassification: string | null

  /** Global selling & export information text */
  globalSellingExport: string | null

  /** Website reference from .txt file (e.g. "www.culturaft.com") */
  website: string | null
  /** Contact email from .txt file (e.g. "infoculturaft@gmail.com") */
  email: string | null

  /** Array of relative image paths from public/ */
  images: string[]

  /** Source .txt filename (preserved exactly as original) */
  sourceTextFile: string | null
  /** Source folder relative path */
  sourceFolder: string

  /** Audit completeness information */
  dataCompleteness: DataCompleteness
}
