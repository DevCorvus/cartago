import { ProductCardWithSalesDto } from '@/shared/dtos/product.dto';

class LocalStorageWished {
  constructor(private key: string = 'wished') {}

  set(data: ProductCardWithSalesDto[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get(): ProductCardWithSalesDto[] {
    const wishedItems = localStorage.getItem(this.key);
    return wishedItems ? JSON.parse(wishedItems) : [];
  }

  addItem(data: ProductCardWithSalesDto) {
    const wishedItems = this.get();

    const alreadyWished = wishedItems.some((item) => item.id === data.id);

    if (!alreadyWished) {
      wishedItems.push(data);
      this.set(wishedItems);
    }
  }

  remove(productId: string) {
    const wishedItems = this.get();
    this.set(wishedItems.filter((item) => item.id !== productId));
  }

  reset() {
    localStorage.removeItem(this.key);
  }
}

export const localStorageWished = new LocalStorageWished();
