import CategorySlider from '@/components/ui/CategorySlider';
import HeroImage from '@/components/ui/HeroImage';
import ProductScroller from '@/components/ui/ProductScroller';
import { categoryService } from '@/server/services';

export default async function Home() {
  const categories = await categoryService.findAllTags();

  return (
    <div>
      <div className="h-[75vh] pt-10 md:h-[50vh] md:pt-14 xl:h-[40vh] 2xl:h-[30vh]">
        <HeroImage />
      </div>
      <div className="container mx-auto space-y-4 p-4">
        <CategorySlider categories={categories} />
        <ProductScroller />
      </div>
    </div>
  );
}
