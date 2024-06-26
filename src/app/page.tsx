import CategorySlider from '@/components/ui/CategorySlider';
import HeroImage from '@/components/ui/HeroImage';
import ProductScroller from '@/components/ui/ProductScroller';
import { categoryService } from '@/server/services';

export default async function Home() {
  const categories = await categoryService.findAllTags();

  return (
    <div>
      <HeroImage />
      <div className="container mx-auto space-y-4 p-4">
        <CategorySlider categories={categories} />
        <ProductScroller />
      </div>
    </div>
  );
}
