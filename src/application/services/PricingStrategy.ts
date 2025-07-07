import { CartEntity } from '../../domain/entities/Cart';
import { CustomerEntity } from '../../domain/entities/Customer';
import { PricingResultEntity } from '../../domain/value-objects/PricingResult';

export interface PricingStrategy {
  calculate(cart: CartEntity, customer: CustomerEntity): PricingResultEntity;
  canApply(cart: CartEntity, customer: CustomerEntity): boolean;
  getPriority(): number; // Higher priority strategies are applied first
} 