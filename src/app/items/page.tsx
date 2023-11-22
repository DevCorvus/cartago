import ProductList from '@/components/ui/ProductList';
import { productService } from '@/server/services';

export default async function ProductItems() {
  const products = await productService.findAll();

  return <ProductList products={products} />;
}
