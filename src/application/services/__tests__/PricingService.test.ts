import { PricingService } from '../PricingService';
import { CartEntity } from '../../../domain/entities/Cart';
import { CustomerEntity } from '../../../domain/entities/Customer';
import { ProductEntity } from '../../../domain/entities/Product';
import { PromotionType } from '../../../domain/value-objects/PricingResult';

describe('PricingService', () => {
  let service: PricingService;
  let tshirt: ProductEntity;
  let dress: ProductEntity;
  let commonCustomer: CustomerEntity;
  let vipCustomer: CustomerEntity;

  beforeEach(() => {
    service = new PricingService();
    tshirt = ProductEntity.create('tshirt', 'T-shirt', 35.99);
    dress = ProductEntity.create('dress', 'Dress', 80.75);
    commonCustomer = CustomerEntity.createCommon('customer-1', 'John Doe');
    vipCustomer = CustomerEntity.createVIP('vip-1', 'Jane Smith');
  });

  describe('calculateBestPrice', () => {
    it('should return no promotion for empty cart', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      const result = service.calculateBestPrice(cart, commonCustomer);

      expect(result.promotionType).toBe(PromotionType.NONE);
      expect(result.finalPrice).toBe(0);
    });

    it('should apply 3 for 2 promotion for common customer with 3 items', () => {
      let cart = CartEntity.create('cart-1', 'customer-1');
      cart = cart.addItem(tshirt, 1); // 35.99
      cart = cart.addItem(dress, 1);   // 80.75
      cart = cart.addItem(tshirt, 1);  // 35.99 (cheapest, will be free)

      const result = service.calculateBestPrice(cart, commonCustomer);

      expect(result.promotionType).toBe(PromotionType.THREE_FOR_TWO);
      expect(result.originalPrice).toBeCloseTo(152.73, 2);
      expect(result.finalPrice).toBeCloseTo(116.74, 2); // 152.73 - 35.99
    });

    it('should apply VIP discount for VIP customer with single item', () => {
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(dress, 1);

      const result = service.calculateBestPrice(cart, vipCustomer);

      expect(result.promotionType).toBe(PromotionType.VIP_DISCOUNT);
      expect(result.originalPrice).toBeCloseTo(80.75, 2);
      expect(result.finalPrice).toBeCloseTo(68.64, 2); // 80.75 - 15%
    });

    it('should choose 3 for 2 over VIP discount when it is better deal', () => {
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(tshirt, 1);
      cart = cart.addItem(dress, 1);
      cart = cart.addItem(tshirt, 1);

      const result = service.calculateBestPrice(cart, vipCustomer);

      // 3 for 2: 152.73 - 35.99 = 116.74
      // VIP: 152.73 - 22.91 = 129.82
      // 3 for 2 is better
      expect(result.promotionType).toBe(PromotionType.THREE_FOR_TWO);
      expect(result.finalPrice).toBeCloseTo(116.74, 2);
    });

    it('should choose VIP discount over 3 for 2 when it is better deal', () => {
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(dress, 1); // Single expensive item

      const result = service.calculateBestPrice(cart, vipCustomer);

      // VIP: 80.75 - 12.11 = 68.64
      // No 3 for 2 available
      expect(result.promotionType).toBe(PromotionType.VIP_DISCOUNT);
      expect(result.finalPrice).toBeCloseTo(68.64, 2);
    });
  });

  describe('calculateAllOptions', () => {
    it('should include all available options in result', () => {
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(tshirt, 1);
      cart = cart.addItem(dress, 1);
      cart = cart.addItem(tshirt, 1);

      const result = service.calculateAllOptions(cart, vipCustomer);

      expect(result.allOptions).toHaveLength(3); // 3 for 2, VIP, No promotion
      expect(result.allOptions.some(option => option.promotionType === PromotionType.THREE_FOR_TWO)).toBe(true);
      expect(result.allOptions.some(option => option.promotionType === PromotionType.VIP_DISCOUNT)).toBe(true);
      expect(result.allOptions.some(option => option.promotionType === PromotionType.NONE)).toBe(true);
    });

    it('should provide meaningful recommendation', () => {
      let cart = CartEntity.create('cart-1', 'vip-1');
      cart = cart.addItem(tshirt, 1);
      cart = cart.addItem(dress, 1);
      cart = cart.addItem(tshirt, 1);

      const result = service.calculateAllOptions(cart, vipCustomer);

      expect(result.recommendation).toContain('Best deal:');
      expect(result.recommendation).toContain('You save');
    });
  });
}); 