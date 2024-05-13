import { ProductCartItemMinimalDto } from '@/shared/dtos/product.dto';

class LocalStorageCart {
  constructor(private key: string = 'cart') {}

  set(data: ProductCartItemMinimalDto[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get(): ProductCartItemMinimalDto[] {
    const cart = localStorage.getItem(this.key);
    return cart ? JSON.parse(cart) : [];
  }

  addItem(data: ProductCartItemMinimalDto) {
    const cart = this.get();

    const productAlreadyExists = cart.some((product) => product.id === data.id);

    if (!productAlreadyExists) {
      cart.push(data);
      this.set(cart);
    }
  }

  remove(productId: string) {
    const cart = this.get();
    this.set(cart.filter((product) => product.id !== productId));
  }

  setItemAmount(productId: string, amount: number) {
    const cart = this.get();

    this.set(
      cart.map((product) => {
        if (product.id === productId) {
          product.amount = amount;
        }
        return product;
      }),
    );
  }

  reset() {
    localStorage.removeItem(this.key);
  }
}

export const localStorageCart = new LocalStorageCart();
