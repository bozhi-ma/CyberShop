export interface Product {
  id: number | string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  sales?: number;
  imageUrl: string;
  stock: number;
} 