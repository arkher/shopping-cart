import { CartEntity } from '../../domain/entities/Cart';
import { CustomerEntity } from '../../domain/entities/Customer';
import { PricingResultEntity, PromotionType } from '../../domain/value-objects/PricingResult';
import { PricingStrategy } from './PricingStrategy';

export class ThreeForTwoStrategy implements PricingStrategy {
  canApply(cart: CartEntity, _customer: CustomerEntity): boolean {
    return cart.totalItems >= 3;
  }

  calculate(cart: CartEntity, _customer: CustomerEntity): PricingResultEntity {
    if (!this.canApply(cart, _customer)) {
      throw new Error('Three for Two strategy cannot be applied');
    }

    // Create a flat list of all items (considering quantities)
    const allItems: Array<{ product: { id: string; name: string; price: number }; price: number }> = [];
    cart.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        allItems.push({ product: item.product, price: item.product.price });
      }
    });

    // Sort by price (cheapest first)
    allItems.sort((a, b) => a.price - b.price);

    const totalItems = allItems.length;
    const groupsOfThree = Math.floor(totalItems / 3);
    let totalDiscount = 0;

    // For each group of 3, the cheapest item is free
    for (let i = 0; i < groupsOfThree; i++) {
      const groupStart = i * 3;
      const cheapestItemInGroup = allItems[groupStart];
      totalDiscount += cheapestItemInGroup.price;
    }

    const finalPrice = cart.totalPrice - totalDiscount;
    const discount = totalDiscount;

    return new PricingResultEntity(
      cart.totalPrice,
      finalPrice,
      discount,
      PromotionType.THREE_FOR_TWO,
      `Get 3 for 2: ${groupsOfThree} group(s) of 3 items, cheapest item free in each group`
    );
  }

  getPriority(): number {
    return 1; // Higher priority than VIP discount
  }
} 