export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  images: string[];
}

export interface CartProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}
