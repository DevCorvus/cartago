import ProductItemDetails from '@/components/ui/ProductItemDetails';

export default function ProductItem() {
  return (
    <ProductItemDetails
      id="3243"
      name="shoes"
      price="100.00"
      createdAt="25/03/2023"
      description="loresdfhnkdjlsgvkdfmgkl"
      stock={4}
      tags={['clothes', 'shirt']}
      images={[
        'https://images.pexels.com/photos/18542177/pexels-photo-18542177/free-photo-of-moda-zapatos-monitor-tienda.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/18542177/pexels-photo-18542177/free-photo-of-moda-zapatos-monitor-tienda.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8499861/pexels-photo-8499861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/18542177/pexels-photo-18542177/free-photo-of-moda-zapatos-monitor-tienda.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/6920411/pexels-photo-6920411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      ]}
    />
  );
}
