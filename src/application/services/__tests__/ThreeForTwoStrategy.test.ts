import { ThreeForTwoStrategy } from '../ThreeForTwoStrategy';
import { CartEntity } from '../../../domain/entities/Cart';
import { CustomerEntity } from '../../../domain/entities/Customer';
import { ProductEntity } from '../../../domain/entities/Product';
import { PromotionType } from '../../../domain/value-objects/PricingResult';

describe('ThreeForTwoStrategy', () => {
  let strategy: ThreeForTwoStrategy;
  let customer: CustomerEntity;

  beforeEach(() => {
    strategy = new ThreeForTwoStrategy();
    customer = CustomerEntity.createCommon('customer-1', 'John Doe');
  });

  describe('canApply', () => {
    it('should return true when cart has 3 or more items', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 10);
      const product2 = ProductEntity.create('product-2', 'Product 2', 20);
      const product3 = ProductEntity.create('product-3', 'Product 3', 30);

      let cart = CartEntity.create('cart-1', 'customer-1');
      cart = cart.addItem(product1, 1);
      cart = cart.addItem(product2, 1);
      cart = cart.addItem(product3, 1);

      expect(strategy.canApply(cart, customer)).toBe(true);
    });

    it('should return false when cart has less than 3 items', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 10);
      const product2 = ProductEntity.create('product-2', 'Product 2', 20);

      const cart = CartEntity.create('cart-1', 'customer-1');
      cart.addItem(product1, 1);
      cart.addItem(product2, 1);

      expect(strategy.canApply(cart, customer)).toBe(false);
    });
  });

  describe('calculate', () => {
    it('should apply 3-for-2 promotion correctly', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 10); // Cheapest
      const product2 = ProductEntity.create('product-2', 'Product 2', 20);
      const product3 = ProductEntity.create('product-3', 'Product 3', 30);

      let cart = CartEntity.create('cart-1', 'customer-1');
      cart = cart.addItem(product1, 1);
      cart = cart.addItem(product2, 1);
      cart = cart.addItem(product3, 1);

      const result = strategy.calculate(cart, customer);

      expect(result.originalPrice).toBe(60); // 10 + 20 + 30
      expect(result.finalPrice).toBe(50); // 60 - 10 (cheapest item free)
      expect(result.discount).toBe(10);
      expect(result.promotionType).toBe(PromotionType.THREE_FOR_TWO);
      expect(result.description).toContain('Get 3 for 2');
    });

    it('should handle multiple groups of 3', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 5); // Cheapest
      const product2 = ProductEntity.create('product-2', 'Product 2', 15);
      const product3 = ProductEntity.create('product-3', 'Product 3', 25);
      const product4 = ProductEntity.create('product-4', 'Product 4', 10); // Cheapest in second group
      const product5 = ProductEntity.create('product-5', 'Product 5', 20);
      const product6 = ProductEntity.create('product-6', 'Product 6', 30);

      let cart = CartEntity.create('cart-1', 'customer-1');
      cart = cart.addItem(product1, 1);
      cart = cart.addItem(product2, 1);
      cart = cart.addItem(product3, 1);
      cart = cart.addItem(product4, 1);
      cart = cart.addItem(product5, 1);
      cart = cart.addItem(product6, 1);

      const result = strategy.calculate(cart, customer);

      expect(result.originalPrice).toBe(105); // 5 + 15 + 25 + 10 + 20 + 30
      expect(result.finalPrice).toBe(80); // 105 - 5 - 20 (cheapest items free)
      expect(result.discount).toBe(25);
    });

    it('should throw error when cannot be applied', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 10);
      const product2 = ProductEntity.create('product-2', 'Product 2', 20);

      const cart = CartEntity.create('cart-1', 'customer-1');
      cart.addItem(product1, 1);
      cart.addItem(product2, 1);

      expect(() => strategy.calculate(cart, customer)).toThrow('Three for Two strategy cannot be applied');
    });
  });

  describe('getPriority', () => {
    it('should return priority 1', () => {
      expect(strategy.getPriority()).toBe(1);
    });
  });
}); 