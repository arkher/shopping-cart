import { ProductEntity } from '../Product';

describe('ProductEntity', () => {
  describe('create', () => {
    it('should create a product with valid data', () => {
      const product = ProductEntity.create('tshirt', 'T-shirt', 35.99);
      
      expect(product.id).toBe('tshirt');
      expect(product.name).toBe('T-shirt');
      expect(product.price).toBe(35.99);
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        ProductEntity.create('tshirt', 'T-shirt', -10);
      }).toThrow('Product price cannot be negative');
    });

    it('should allow zero price', () => {
      const product = ProductEntity.create('free', 'Free Item', 0);
      expect(product.price).toBe(0);
    });
  });

  describe('constructor', () => {
    it('should create product with valid parameters', () => {
      const product = new ProductEntity('jeans', 'Jeans', 65.50);
      
      expect(product.id).toBe('jeans');
      expect(product.name).toBe('Jeans');
      expect(product.price).toBe(65.50);
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        new ProductEntity('jeans', 'Jeans', -5);
      }).toThrow('Product price cannot be negative');
    });
  });
}); 