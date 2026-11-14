import { HeroSection } from '@/components/home/HeroSection'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { CraftsmanshipSection } from '@/components/home/CraftsmanshipSection'
import { CollectionSpotlight } from '@/components/home/CollectionSpotlight'
import { FinalCTA } from '@/components/home/FinalCTA'

/**
 * Homepage — six editorial sections told entirely through real catalogue
 * photography and verified data. The document <main> landmark is provided
 * by MainLayout; pages compose sections only.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedCollection />
      <CraftsmanshipSection />
      <CollectionSpotlight />
      <FinalCTA />
    </>
  )
}
