class LocalStorageWished {
  constructor(private key: string = 'wished') {}

  set(productIds: string[]) {
    localStorage.setItem(this.key, JSON.stringify(productIds));
  }

  get(): string[] {
    const wishedItems = localStorage.getItem(this.key);
    return wishedItems ? JSON.parse(wishedItems) : [];
  }

  addItem(id: string) {
    const wishedItems = this.get();

    const alreadyWished = wishedItems.includes(id);

    if (!alreadyWished) {
      wishedItems.push(id);
      this.set(wishedItems);
    }
  }

  remove(id: string) {
    const wishedItems = this.get();
    this.set(wishedItems.filter((productId) => productId !== id));
  }

  reset() {
    localStorage.removeItem(this.key);
  }
}

export const localStorageWished = new LocalStorageWished();
