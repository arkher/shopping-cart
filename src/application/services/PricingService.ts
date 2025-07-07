import { CartEntity } from '../../domain/entities/Cart';
import { CustomerEntity } from '../../domain/entities/Customer';
import { PricingResultEntity, PromotionType } from '../../domain/value-objects/PricingResult';
import { PricingService as IPricingService } from '../../domain/services/PricingService';
import { PricingStrategy } from './PricingStrategy';
import { ThreeForTwoStrategy } from './ThreeForTwoStrategy';
import { VipDiscountStrategy } from './VipDiscountStrategy';

export interface PricingServiceResult {
  bestOption: PricingResultEntity;
  allOptions: PricingResultEntity[];
  recommendation: string;
}

export class PricingService implements IPricingService {
  private strategies: PricingStrategy[];

  constructor() {
    this.strategies = [
      new ThreeForTwoStrategy(),
      new VipDiscountStrategy()
    ];
  }

  calculateBestPrice(cart: CartEntity, customer: CustomerEntity): PricingResultEntity {
    if (cart.isEmpty) {
      return PricingResultEntity.noPromotion(0);
    }

    const applicableStrategies = this.strategies.filter(strategy => 
      strategy.canApply(cart, customer)
    );

    if (applicableStrategies.length === 0) {
      return PricingResultEntity.noPromotion(cart.totalPrice);
    }

    const results = applicableStrategies.map(strategy => 
      strategy.calculate(cart, customer)
    );

    // Add no promotion option for comparison
    const noPromotion = PricingResultEntity.noPromotion(cart.totalPrice);
    results.push(noPromotion);

    // Find the best option (lowest final price)
    const bestOption = results.reduce((best, current) => 
      current.finalPrice < best.finalPrice ? current : best
    );

    return bestOption;
  }

  calculateAllOptions(cart: CartEntity, customer: CustomerEntity): PricingServiceResult {
    if (cart.isEmpty) {
      const noPromotion = PricingResultEntity.noPromotion(0);
      return {
        bestOption: noPromotion,
        allOptions: [noPromotion],
        recommendation: 'Cart is empty'
      };
    }

    const applicableStrategies = this.strategies.filter(strategy => 
      strategy.canApply(cart, customer)
    );

    if (applicableStrategies.length === 0) {
      const noPromotion = PricingResultEntity.noPromotion(cart.totalPrice);
      return {
        bestOption: noPromotion,
        allOptions: [noPromotion],
        recommendation: 'No promotions available'
      };
    }

    const results = applicableStrategies.map(strategy => 
      strategy.calculate(cart, customer)
    );

    // Add no promotion option for comparison
    const noPromotion = PricingResultEntity.noPromotion(cart.totalPrice);
    results.push(noPromotion);

    // Find the best option (lowest final price)
    const bestOption = results.reduce((best, current) => 
      current.finalPrice < best.finalPrice ? current : best
    );

    const recommendation = this.generateRecommendation(bestOption);

    return {
      bestOption,
      allOptions: results,
      recommendation
    };
  }

  private generateRecommendation(bestOption: PricingResultEntity): string {
    if (bestOption.promotionType === PromotionType.NONE) {
      return 'No promotion applied - regular pricing';
    }

    const savings = bestOption.discount;
    const savingsPercentage = bestOption.savingsPercentage;

    if (bestOption.promotionType === PromotionType.THREE_FOR_TWO) {
      return `Best deal: ${bestOption.description}. You save $${savings.toFixed(2)} (${savingsPercentage.toFixed(1)}% off)`;
    }

    if (bestOption.promotionType === PromotionType.VIP_DISCOUNT) {
      return `Best deal: ${bestOption.description}. You save $${savings.toFixed(2)} (${savingsPercentage.toFixed(1)}% off)`;
    }

    return `Best deal: ${bestOption.description}`;
  }
} 