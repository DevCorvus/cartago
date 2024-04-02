import CategoryList from '@/components/ui/CategoryList';
import HeroImage from '@/components/ui/HeroImage';
import ProductScroller from '@/components/ui/ProductScroller';
import { categoryService } from '@/server/services';

export default async function Home() {
  const categories = await categoryService.findAllTags();

  return (
    <div>
      <div className="h-screen lg:h-[60vh] lg:pt-12">
        <HeroImage />
      </div>
      <div className="container mx-auto p-6">
        <CategoryList categories={categories} />
        <ProductScroller />
      </div>
    </div>
  );
}
