import { ProductCartItemDto } from '@/shared/dtos/product.dto';

class LocalStorageCart {
  constructor(private key: string = 'cart') {
    const cart = localStorage.getItem(key);

    if (!cart) {
      this.set([]);
    }
  }

  set(data: ProductCartItemDto[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get(): ProductCartItemDto[] {
    const cart = localStorage.getItem(this.key);
    return cart ? JSON.parse(cart) : [];
  }

  addItem(data: ProductCartItemDto) {
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

  incrementItemAmount(productId: string) {
    const cart = this.get();
    this.set(
      cart.map((product) => {
        if (product.id === productId && product.amount < product.stock) {
          product.amount += 1;
        }
        return product;
      }),
    );
  }

  decrementItemAmount(productId: string) {
    const cart = this.get();
    this.set(
      cart.map((product) => {
        if (product.id === productId && product.amount > 1) {
          product.amount -= 1;
        }
        return product;
      }),
    );
  }

  reset() {
    this.set([]);
  }
}

export const localStorageCart = new LocalStorageCart();
