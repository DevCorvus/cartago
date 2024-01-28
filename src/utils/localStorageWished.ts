class LocalStorageWished {
  constructor(private key: string = 'wished') {}

  set(data: string[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get(): string[] {
    const wishedItems = localStorage.getItem(this.key);
    return wishedItems ? JSON.parse(wishedItems) : [];
  }

  addItem(productId: string) {
    const wishedItems = this.get();

    const alreadyWished = wishedItems.some(
      (wishedItemId) => wishedItemId === productId,
    );

    if (!alreadyWished) {
      wishedItems.push(productId);
      this.set(wishedItems);
    }
  }

  remove(productId: string) {
    const wishedItems = this.get();
    this.set(wishedItems.filter((wishedItemId) => wishedItemId !== productId));
  }

  reset() {
    localStorage.removeItem(this.key);
  }
}

export const localStorageWished = new LocalStorageWished();
