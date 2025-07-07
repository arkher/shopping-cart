import { PricingResultEntity, PromotionType } from '../PricingResult';

describe('PricingResultEntity', () => {
  describe('create', () => {
    it('should create a pricing result with valid data', () => {
      const result = PricingResultEntity.create(100, 80, PromotionType.THREE_FOR_TWO, 'Test promotion');
      
      expect(result.originalPrice).toBe(100);
      expect(result.finalPrice).toBe(80);
      expect(result.discount).toBe(20);
      expect(result.promotionType).toBe(PromotionType.THREE_FOR_TWO);
      expect(result.description).toBe('Test promotion');
    });

    it('should calculate discount automatically', () => {
      const result = PricingResultEntity.create(100, 75, PromotionType.VIP_DISCOUNT, 'VIP discount');
      
      expect(result.discount).toBe(25);
    });

    it('should throw error when original price is negative', () => {
      expect(() => {
        PricingResultEntity.create(-10, 80, PromotionType.THREE_FOR_TWO, 'Test');
      }).toThrow('Pricing values cannot be negative');
    });

    it('should throw error when final price is negative', () => {
      expect(() => {
        PricingResultEntity.create(100, -5, PromotionType.THREE_FOR_TWO, 'Test');
      }).toThrow('Pricing values cannot be negative');
    });
  });

  describe('noPromotion', () => {
    it('should create a no promotion result', () => {
      const result = PricingResultEntity.noPromotion(100);
      
      expect(result.originalPrice).toBe(100);
      expect(result.finalPrice).toBe(100);
      expect(result.discount).toBe(0);
      expect(result.promotionType).toBe(PromotionType.NONE);
      expect(result.description).toBe('No promotion applied');
    });

    it('should handle zero price', () => {
      const result = PricingResultEntity.noPromotion(0);
      
      expect(result.originalPrice).toBe(0);
      expect(result.finalPrice).toBe(0);
      expect(result.discount).toBe(0);
    });
  });

  describe('savingsPercentage', () => {
    it('should calculate savings percentage correctly', () => {
      const result = PricingResultEntity.create(100, 80, PromotionType.THREE_FOR_TWO, 'Test');
      
      expect(result.savingsPercentage).toBe(20);
    });

    it('should return zero when original price is zero', () => {
      const result = PricingResultEntity.create(0, 0, PromotionType.NONE, 'Test');
      
      expect(result.savingsPercentage).toBe(0);
    });

    it('should handle 50% discount', () => {
      const result = PricingResultEntity.create(100, 50, PromotionType.VIP_DISCOUNT, 'Test');
      
      expect(result.savingsPercentage).toBe(50);
    });
  });
}); 