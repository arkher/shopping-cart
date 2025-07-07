import { Product } from '../entities/Product';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
} 