import { Product, ProductEntity } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [
    ProductEntity.create('tshirt', 'T-shirt', 35.99),
    ProductEntity.create('jeans', 'Jeans', 65.50),
    ProductEntity.create('dress', 'Dress', 80.75)
  ];

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    // For now, all products are in the same category
    return this.products.filter(p => p.name.toLowerCase().includes(category.toLowerCase()));
  }
} 