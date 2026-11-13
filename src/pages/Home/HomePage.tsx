import { HeroSection } from '@/components/home/HeroSection'
import { BrandIntroduction } from '@/components/home/BrandIntroduction'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { CraftsmanshipSection } from '@/components/home/CraftsmanshipSection'
import { CollectionSpotlight } from '@/components/home/CollectionSpotlight'
import { FinalCTA } from '@/components/home/FinalCTA'

/**
 * Homepage — seven editorial sections told entirely through real
 * catalogue photography and verified data. The document <main> landmark
 * is provided by MainLayout; pages compose sections only.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroduction />
      <CategoryShowcase />
      <FeaturedCollection />
      <CraftsmanshipSection />
      <CollectionSpotlight />
      <FinalCTA />
    </>
  )
}
