import HeroImage from '@/components/ui/HeroImage';
import ProductList from '@/components/ui/ProductList';
import { productService } from '@/server/services';

export default async function Home() {
  const products = await productService.findAll();

  return (
    <div>
      <div className="h-screen lg:h-[60vh] lg:pt-12">
        <HeroImage />
      </div>
      <div className="container mx-auto p-6">
        <ProductList products={products} />
      </div>
    </div>
  );
}
