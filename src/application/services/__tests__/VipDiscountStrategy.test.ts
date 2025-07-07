import { VipDiscountStrategy } from '../VipDiscountStrategy';
import { CartEntity } from '../../../domain/entities/Cart';
import { CustomerEntity } from '../../../domain/entities/Customer';
import { ProductEntity } from '../../../domain/entities/Product';
import { PromotionType } from '../../../domain/value-objects/PricingResult';

describe('VipDiscountStrategy', () => {
  let strategy: VipDiscountStrategy;
  let vipCustomer: CustomerEntity;
  let commonCustomer: CustomerEntity;

  beforeEach(() => {
    strategy = new VipDiscountStrategy();
    vipCustomer = CustomerEntity.createVIP('vip-1', 'Jane Smith');
    commonCustomer = CustomerEntity.createCommon('customer-1', 'John Doe');
  });

  describe('canApply', () => {
    it('should return true for VIP customer with items', () => {
      const product = ProductEntity.create('product-1', 'Product 1', 100);
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(product, 1);

      expect(strategy.canApply(cart, vipCustomer)).toBe(true);
    });

    it('should return false for common customer', () => {
      const product = ProductEntity.create('product-1', 'Product 1', 100);
      let cart = CartEntity.create('cart-1', 'customer-1');
      cart = cart.addItem(product, 1);

      expect(strategy.canApply(cart, commonCustomer)).toBe(false);
    });

    it('should return false for VIP customer with empty cart', () => {
      const cart = CartEntity.create('cart-1', 'vip-1');

      expect(strategy.canApply(cart, vipCustomer)).toBe(false);
    });
  });

  describe('calculate', () => {
    it('should apply 15% discount for VIP customer', () => {
      const product = ProductEntity.create('product-1', 'Product 1', 100);
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(product, 1);

      const result = strategy.calculate(cart, vipCustomer);

      expect(result.originalPrice).toBe(100);
      expect(result.finalPrice).toBe(85); // 100 - 15%
      expect(result.discount).toBe(15);
      expect(result.promotionType).toBe(PromotionType.VIP_DISCOUNT);
      expect(result.description).toContain('VIP discount: 15% off');
    });

    it('should handle multiple items', () => {
      const product1 = ProductEntity.create('product-1', 'Product 1', 50);
      const product2 = ProductEntity.create('product-2', 'Product 2', 30);
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(product1, 1);
      cart = cart.addItem(product2, 1);

      const result = strategy.calculate(cart, vipCustomer);

      expect(result.originalPrice).toBe(80);
      expect(result.finalPrice).toBe(68); // 80 - 12 (15% of 80)
      expect(result.discount).toBe(12);
    });

    it('should throw error when cannot be applied', () => {
      const cart = CartEntity.create('cart-1', 'vip-1');

      expect(() => strategy.calculate(cart, vipCustomer)).toThrow('VIP discount strategy cannot be applied');
    });
  });

  describe('getPriority', () => {
    it('should return priority 2', () => {
      expect(strategy.getPriority()).toBe(2);
    });
  });
}); 