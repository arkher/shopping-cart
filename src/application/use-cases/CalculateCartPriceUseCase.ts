import { CartRepository } from '@/domain/repositories/CartRepository';
import { CustomerRepository } from '@/domain/repositories/CustomerRepository';
import { PricingService, PricingServiceResult } from '@/application/services/PricingService';

export interface CalculateCartPriceRequest {
  cartId: string;
  customerId: string;
}

export interface CalculateCartPriceResponse {
  success: boolean;
  message: string;
  pricingResult?: PricingServiceResult;
}

export class CalculateCartPriceUseCase {
  constructor(
    private cartRepository: CartRepository,
    private customerRepository: CustomerRepository,
    private pricingService: PricingService
  ) {}

  async execute(request: CalculateCartPriceRequest): Promise<CalculateCartPriceResponse> {
    try {
      const cart = await this.cartRepository.findById(request.cartId);
      if (!cart) {
        return {
          success: false,
          message: 'Cart not found'
        };
      }

      const customer = await this.customerRepository.findById(request.customerId);
      if (!customer) {
        return {
          success: false,
          message: 'Customer not found'
        };
      }

      const pricingResult = this.pricingService.calculateAllOptions(cart, customer);

      return {
        success: true,
        message: 'Price calculated successfully',
        pricingResult
      };
    } catch (error) {
      return {
        success: false,
        message: `Error calculating price: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
} 