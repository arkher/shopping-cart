import { CartEntity } from '../entities/Cart';
import { CustomerEntity } from '../entities/Customer';
import { PricingResultEntity } from '../value-objects/PricingResult';

export interface PricingService {
  calculateBestPrice(cart: CartEntity, customer: CustomerEntity): PricingResultEntity;
} 