import { CartEntity } from '../entities/Cart';
import { CustomerEntity } from '../entities/Customer';
import { PricingResultEntity } from '../value-objects/PricingResult';

export interface PricingStrategy {
  calculate(cart: CartEntity, customer: CustomerEntity): PricingResultEntity;
  canApply(cart: CartEntity, customer: CustomerEntity): boolean;
  getPriority(): number; // Higher priority strategies are applied first
} 