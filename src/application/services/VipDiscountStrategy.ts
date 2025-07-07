import { CartEntity } from '../../domain/entities/Cart';
import { CustomerEntity } from '../../domain/entities/Customer';
import { PricingResultEntity, PromotionType } from '../../domain/value-objects/PricingResult';
import { PricingStrategy } from './PricingStrategy';

export class VipDiscountStrategy implements PricingStrategy {
  private readonly VIP_DISCOUNT_PERCENTAGE = 15;

  canApply(cart: CartEntity, customer: CustomerEntity): boolean {
    return customer.type === 'vip' && cart.totalItems > 0;
  }

  calculate(cart: CartEntity, _customer: CustomerEntity): PricingResultEntity {
    if (!this.canApply(cart, _customer)) {
      throw new Error('VIP discount strategy cannot be applied');
    }

    const discount = (cart.totalPrice * this.VIP_DISCOUNT_PERCENTAGE) / 100;
    const finalPrice = cart.totalPrice - discount;

    return new PricingResultEntity(
      cart.totalPrice,
      finalPrice,
      discount,
      PromotionType.VIP_DISCOUNT,
      `VIP discount: ${this.VIP_DISCOUNT_PERCENTAGE}% off total purchase`
    );
  }

  getPriority(): number {
    return 2; // Lower priority than Three for Two
  }
} 