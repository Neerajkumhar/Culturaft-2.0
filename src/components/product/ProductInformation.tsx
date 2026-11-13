import type { Product } from '@/types/product'
import { formatPrice, isPriceOnRequest } from '@/lib/price'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * Product information panel — only verified data from products.json and source TXT.
 * Missing information is gracefully hidden; nothing is fabricated.
 */
export function ProductInformation({ product }: { product: Product }) {
  const category = MAIN_CATEGORIES.find((c) => c.productCategory === product.category)
  const categoryLabel = category?.name ?? product.category
  const subcategoryLabel = product.websiteCategory?.subcategory

  const specifications = Object.entries(product.specifications || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  )

  // Split description into distinct paragraphs
  const descriptionParagraphs = product.description
    ? product.description
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  return (
    <div className="space-y-8">
      {/* 1. PRODUCT HEADER */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow text-fog">
            {categoryLabel}
            {subcategoryLabel && subcategoryLabel !== categoryLabel && (
              <span className="text-fog/80"> · {subcategoryLabel}</span>
            )}
          </p>
          {product.usageClassification && (
            <span className="inline-flex items-center border border-brand-primary/40 bg-brand-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
              {product.usageClassification}
            </span>
          )}
        </div>

        <h1 className="mt-2 text-h1 font-normal tracking-tight text-ink">{product.name}</h1>

        {/* Price & Unit */}
        <div className="mt-4 flex items-baseline gap-2">
          {isPriceOnRequest(product.price) ? (
            <span className="text-h3 font-display font-medium text-fog">Price on Request</span>
          ) : (
            <>
              <span className="font-display text-h3 font-bold tracking-tight text-ink">
                {formatPrice(product.price)}
              </span>
              {product.priceUnit && (
                <span className="text-sm font-medium text-fog">{product.priceUnit}</span>
              )}
            </>
          )}
        </div>

        {/* Short description */}
        {product.shortDescription && (
          <p className="mt-4 text-sm leading-relaxed text-charcoal/90 border-l-2 border-brand-primary pl-3.5">
            {product.shortDescription}
          </p>
        )}
      </div>

      <div className="rule" />

      {/* 2. KEY FEATURES */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <section aria-labelledby="key-features-heading">
          <h2 id="key-features-heading" className="eyebrow text-fog">Key Features</h2>
          <ul className="mt-3 space-y-2">
            {product.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-charcoal">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 3. PRODUCT DESCRIPTION */}
      {descriptionParagraphs.length > 0 && (
        <section aria-labelledby="description-heading">
          <h2 id="description-heading" className="eyebrow text-fog">About This Piece</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-charcoal">
            {descriptionParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* 4. DIMENSIONS */}
      {product.dimensions && (
        <section aria-labelledby="dimensions-heading">
          <h2 id="dimensions-heading" className="eyebrow text-fog">Dimensions</h2>
          <p className="mt-2 font-mono text-sm tracking-wide text-ink font-medium">
            {product.dimensions}
          </p>
        </section>
      )}

      {/* 5. MATERIALS */}
      {product.materials && product.materials.length > 0 && (
        <section aria-labelledby="materials-heading">
          <h2 id="materials-heading" className="eyebrow text-fog">Materials & Weave</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.materials.map((material) => (
              <li
                key={material}
                className="border border-line-strong bg-paper px-3 py-1.5 text-xs text-charcoal"
              >
                {material}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 6. PRODUCT SPECIFICATIONS TABLE */}
      {specifications.length > 0 && (
        <section aria-labelledby="specifications-heading">
          <h2 id="specifications-heading" className="eyebrow text-fog">Specifications</h2>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {specifications.map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-3 sm:gap-4 text-sm">
                <dt className="text-fog font-medium">{key}</dt>
                <dd className="text-charcoal sm:col-span-2 font-normal">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 7. IDEAL FOR */}
      {product.idealFor && product.idealFor.length > 0 && (
        <section aria-labelledby="ideal-for-heading">
          <h2 id="ideal-for-heading" className="eyebrow text-fog">Ideal For</h2>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-charcoal">
            {product.idealFor.map((use) => (
              <li key={use} className="border border-line bg-paper px-3 py-1.5">
                {use}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. CARE INSTRUCTIONS */}
      {product.careInstructions && product.careInstructions.length > 0 && (
        <section aria-labelledby="care-heading">
          <h2 id="care-heading" className="eyebrow text-fog">Care Instructions</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-charcoal">
            {product.careInstructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand-primary" aria-hidden="true">—</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 9. GLOBAL SELLING & EXPORT (For Wholesale, Commercial, International) */}
      {product.globalSellingExport && (
        <section
          aria-labelledby="export-heading"
          className="border border-brand-primary/30 bg-sand/30 p-5 mt-6"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-primary" />
            <h2 id="export-heading" className="eyebrow text-ink font-semibold">
              Global Sourcing, Hospitality & Bulk Enquiries
            </h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-charcoal whitespace-pre-line">
            {product.globalSellingExport}
          </p>
          {(product.email || product.website) && (
            <div className="mt-3 pt-3 border-t border-line/60 flex flex-wrap gap-4 text-xs text-charcoal">
              {product.email && (
                <span>
                  <strong className="text-ink">Email:</strong>{' '}
                  <a href={`mailto:${product.email}`} className="text-brand-primary underline hover:text-ink">
                    {product.email}
                  </a>
                </span>
              )}
              {product.website && (
                <span>
                  <strong className="text-ink">Website:</strong>{' '}
                  <span className="text-ink">{product.website}</span>
                </span>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
