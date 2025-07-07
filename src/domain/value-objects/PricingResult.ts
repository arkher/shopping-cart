export enum PromotionType {
  NONE = 'none',
  THREE_FOR_TWO = 'three_for_two',
  VIP_DISCOUNT = 'vip_discount'
}

export interface PricingResult {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  promotionType: PromotionType;
  description: string;
}

export class PricingResultEntity implements PricingResult {
  constructor(
    public readonly originalPrice: number,
    public readonly finalPrice: number,
    public readonly discount: number,
    public readonly promotionType: PromotionType,
    public readonly description: string
  ) {
    if (originalPrice < 0 || finalPrice < 0 || discount < 0) {
      throw new Error('Pricing values cannot be negative');
    }
  }

  static create(
    originalPrice: number,
    finalPrice: number,
    promotionType: PromotionType,
    description: string
  ): PricingResultEntity {
    const discount = originalPrice - finalPrice;
    return new PricingResultEntity(originalPrice, finalPrice, discount, promotionType, description);
  }

  static noPromotion(price: number): PricingResultEntity {
    return new PricingResultEntity(price, price, 0, PromotionType.NONE, 'No promotion applied');
  }

  get savingsPercentage(): number {
    if (this.originalPrice === 0) return 0;
    return (this.discount / this.originalPrice) * 100;
  }
} 