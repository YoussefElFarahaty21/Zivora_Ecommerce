export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}
