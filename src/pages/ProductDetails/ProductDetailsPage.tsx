import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { Breadcrumb } from '@/components/catalog/CatalogChrome'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ProductInformation } from '@/components/product/ProductInformation'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import WhatsAppButton from '@/components/product/WhatsAppButton'
import AddToCartButton from '@/components/cart/AddToCartButton'
import QuantitySelector from '@/components/cart/QuantitySelector'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * Product detail page — gallery beside information on desktop,
 * stacked on mobile. Uses verified source .txt content for rich specifications,
 * SEO titles, meta descriptions, and structured data.
 * Route: /product/:slug
 */
export default function ProductDetailsPage() {
  const { slug } = useParams()
  const products = useProducts()
  const [selectedQuantity, setSelectedQuantity] = useState({ slug, value: 1 })
  const quantity = selectedQuantity.slug === slug ? selectedQuantity.value : 1

  const product = products.find((p) => p.slug === slug)

  // SEO: Update document title and meta description based on verified TXT content
  useEffect(() => {
    if (!product) return

    const pageTitle = product.seoTitle
      ? `${product.seoTitle} | CULTURAFT`
      : `${product.name} | CULTURAFT`
    document.title = pageTitle

    if (product.shortDescription) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', product.shortDescription)
    }

    return () => {
      document.title = 'CULTURAFT — Handcrafted Indian Furniture'
    }
  }, [product])

  // JSON-LD Structured Data (Product Schema) with verified data only
  const structuredDataJson = useMemo(() => {
    if (!product) return null
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription || product.description || undefined,
      category: product.websiteCategory?.subcategory || product.category,
      brand: {
        '@type': 'Brand',
        name: 'CULTURAFT',
      },
    }

    if (product.images.length > 0) {
      schema.image = product.images.map((img) =>
        img.startsWith('http') ? img : `https://culturaft.com${img}`
      )
    }

    if (product.price !== null) {
      schema.offers = {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        url: `https://culturaft.com/product/${product.slug}`,
      }
    }

    return JSON.stringify(schema)
  }, [product])

  if (!product) {
    return (
      <div className="wrap py-20 text-center lg:py-28">
        <p className="eyebrow text-fog">Error 404</p>
        <h1 className="mt-3 text-h1">Product Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-charcoal">
          This piece doesn't exist or may no longer be available.
          Browse the full collection instead.
        </p>
        <div className="mt-10">
          <Link to="/shop" className="btn btn-primary">
            Browse All Furniture
          </Link>
        </div>
        <nav aria-label="Available collections" className="mt-6 flex flex-wrap justify-center gap-2">
          {MAIN_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="inline-flex min-h-11 items-center border border-line-strong bg-paper px-4 text-sm text-charcoal transition-colors hover:border-brand-primary hover:text-ink"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  const category = MAIN_CATEGORIES.find((c) => c.productCategory === product.category)
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  const breadcrumbTrail = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    ...(category ? [{ label: category.name, to: `/category/${category.slug}` }] : []),
    ...(product.websiteCategory?.subcategory
      ? [
          {
            label: product.websiteCategory.subcategory,
            to: `/category/${category?.slug || 'shop'}?subcategory=${product.websiteCategory.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ]

  return (
    <div className="wrap">
      {/* Structured data */}
      {structuredDataJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
      )}

      <Breadcrumb trail={breadcrumbTrail} />

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-14 gap-y-10 pb-16 pt-4 lg:grid-cols-2 lg:pb-24">
        {/* Gallery — sticky beside the information column on desktop */}
        <div className="lg:sticky lg:top-24">
          <ImageGallery product={product} />
        </div>

        {/* Information + enquiry */}
        <div>
          <ProductInformation product={product} />
          <div className="mt-8 border-t border-line pt-8">
            <div className="flex flex-wrap items-center gap-3">
              <QuantitySelector
                value={quantity}
                onChange={(value) => setSelectedQuantity({ slug, value })}
                label={`Quantity for ${product.name}`}
              />
              <AddToCartButton
                product={product}
                quantity={quantity}
                className="flex-1 sm:flex-none"
              />
            </div>
            <div className="mt-6 border-t border-line pt-6">
              <WhatsAppButton
                productName={product.name}
                productSlug={product.slug}
                category={product.category}
                productPrice={product.price}
                priceUnit={product.priceUnit}
              />
              <p className="mt-3 text-xs text-fog">
                Enquiries are answered directly on WhatsApp — ask about this piece,
                custom dimensions, wholesale, or international shipping.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <RelatedProducts heading={`More ${category?.name.toLowerCase() ?? 'pieces'}`} products={related} />
      )}
    </div>
  )
}
