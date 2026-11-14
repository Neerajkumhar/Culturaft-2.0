import { PromoBanner } from '@/components/home/PromoBanner'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { CraftsmanshipSection } from '@/components/home/CraftsmanshipSection'
import { CollectionSpotlight } from '@/components/home/CollectionSpotlight'
import { FinalCTA } from '@/components/home/FinalCTA'

/**
 * Homepage — editorial sections told entirely through real catalogue
 * photography and verified data, opened by the promotional banner. The
 * document <main> landmark is provided by MainLayout; pages compose
 * sections only.
 */
export default function HomePage() {
  return (
    <>
      <PromoBanner />
      <CategoryShowcase />
      <FeaturedCollection />
      <CraftsmanshipSection />
      <CollectionSpotlight />
      <FinalCTA />
    </>
  )
}
