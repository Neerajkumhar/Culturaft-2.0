import { Link } from 'react-router-dom'
import { HOME_BANNER, toSrcSet } from '@/config/site'

const bannerWebpSrcSet = toSrcSet(HOME_BANNER.webp)
const bannerJpegSrcSet = toSrcSet(HOME_BANNER.jpeg)

/**
 * Promo banner — the full-bleed strip that opens the homepage. The artwork
 * is a designed 4.8:1 image (2560×533), served as WebP with a JPEG fallback
 * and two widths so phones do not download the large file.
 *
 * Sits above the fold, so it loads eagerly at high priority. Update `alt`
 * and the `to` destination to match the current campaign.
 */
export function PromoBanner() {
  return (
    <section aria-label="Current offer" className="bg-sand">
      <Link
        to="/shop"
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
      >
        <picture>
          <source
            type="image/webp"
            sizes="100vw"
            srcSet={bannerWebpSrcSet}
          />
          <img
            src={HOME_BANNER.jpeg[1].src}
            srcSet={bannerJpegSrcSet}
            sizes="100vw"
            alt="CULTURAFT — new arrivals and current offers"
            width={2560}
            height={533}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      </Link>
    </section>
  )
}
