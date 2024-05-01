import CategorySlider from '@/components/ui/CategorySlider';
import HeroImage from '@/components/ui/HeroImage';
import ProductScroller from '@/components/ui/ProductScroller';
import { categoryService } from '@/server/services';

export default async function Home() {
  const categories = await categoryService.findAllTags();

  return (
    <div>
      <div className="h-[34vh] pt-14 md:h-[40vh] lg:h-[54vh] lg:pt-14">
        <HeroImage />
      </div>
      <div className="container mx-auto space-y-6 p-6">
        <CategorySlider categories={categories} />
        <ProductScroller />
      </div>
    </div>
  );
}
