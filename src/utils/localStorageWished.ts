import { ProductCardDto } from '@/shared/dtos/product.dto';

class LocalStorageWished {
  constructor(private key: string = 'wished') {}

  set(data: ProductCardDto[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get(): ProductCardDto[] {
    const wishedItems = localStorage.getItem(this.key);
    return wishedItems ? JSON.parse(wishedItems) : [];
  }

  addItem(data: ProductCardDto) {
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
