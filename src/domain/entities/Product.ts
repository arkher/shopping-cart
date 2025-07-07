export interface Product {
  id: string;
  name: string;
  price: number;
}

export class ProductEntity implements Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {
    if (price < 0) {
      throw new Error('Product price cannot be negative');
    }
  }

  static create(id: string, name: string, price: number): ProductEntity {
    return new ProductEntity(id, name, price);
  }
} 