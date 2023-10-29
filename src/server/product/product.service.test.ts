import { CreateProductDto, ProductDto } from '@/shared/dtos/product.dto';
import { ProductService } from './product.service';

const newProductMock: CreateProductDto = {
  title: 'Shoes',
  description: 'Just shoes',
  price: 200,
  stock: 4,
  images: [],
  categories: [],
};

const newProductWithImagesMock: CreateProductDto = {
  title: 'Shirt',
  description: 'Just a shirt',
  price: 100,
  stock: 7,
  images: ['/path/to/image', '/path/to/image', '/path/to/image'],
  categories: [],
};

describe('ProductService', () => {
  let service = new ProductService();

  describe('before product created', () => {
    let product: ProductDto;

    afterEach(async () => {
      if (product) {
        await service.delete(product.id);
      }
    });

    it('should not found product', async () => {
      await expect(service.find('uwu')).resolves.toBeNull();
    });

    it('should create a product', async () => {
      product = await service.create(newProductMock);

      expect(product).toMatchObject<ProductDto>({
        id: expect.any(String),
        title: newProductMock.title,
        description: newProductMock.description,
        price: newProductMock.price,
        stock: newProductMock.stock,
        images: expect.any(Array),
        categories: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should create a product with images', async () => {
      product = await service.create(newProductWithImagesMock);

      expect(product).toEqual<ProductDto>({
        id: expect.any(String),
        title: newProductWithImagesMock.title,
        description: newProductWithImagesMock.description,
        price: newProductWithImagesMock.price,
        stock: newProductWithImagesMock.stock,
        images: expect.arrayContaining([
          {
            id: expect.any(String),
            path: expect.any(String),
            productId: product.id,
            createdAt: expect.any(Date),
          },
        ]),
        categories: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('after product created', () => {
    let product: ProductDto;

    beforeEach(async () => {
      product = await service.create(newProductMock);

      return async () => {
        await service.delete(product.id);
      };
    });

    it('should check if product exists', async () => {
      await expect(service.exists(product.id)).resolves.toBeTruthy();
    });

    it('should found product', async () => {
      await expect(service.find(product.id)).resolves.toEqual<ProductDto>({
        id: expect.any(String),
        title: newProductMock.title,
        description: newProductMock.description,
        price: newProductMock.price,
        stock: newProductMock.stock,
        images: expect.any(Array),
        categories: expect.any(Array),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
