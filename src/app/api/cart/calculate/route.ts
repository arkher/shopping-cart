import { NextRequest, NextResponse } from 'next/server';
import { CalculateCartPriceUseCase } from '@/use-cases/CalculateCartPriceUseCase';
import { cartRepository, customerRepository } from '@/infrastructure/repositories/Repositories';
import { PricingService } from '@/application/services/PricingService';
import { PricingResultEntity } from '@/domain/value-objects/PricingResult';

const pricingService = new PricingService();
const calculateCartPriceUseCase = new CalculateCartPriceUseCase(
  cartRepository,
  customerRepository,
  pricingService
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, customerId } = body;

    if (!cartId || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: cartId, customerId' },
        { status: 400 }
      );
    }

    const result = await calculateCartPriceUseCase.execute({
      cartId,
      customerId
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      pricing: {
        bestOption: {
          originalPrice: result.pricingResult?.bestOption.originalPrice,
          finalPrice: result.pricingResult?.bestOption.finalPrice,
          discount: result.pricingResult?.bestOption.discount,
          promotionType: result.pricingResult?.bestOption.promotionType,
          description: result.pricingResult?.bestOption.description,
          savingsPercentage: result.pricingResult?.bestOption.savingsPercentage
        },
        allOptions: result.pricingResult?.allOptions.map((option: PricingResultEntity) => ({
          originalPrice: option.originalPrice,
          finalPrice: option.finalPrice,
          discount: option.discount,
          promotionType: option.promotionType,
          description: option.description,
          savingsPercentage: option.savingsPercentage
        })),
        recommendation: result.pricingResult?.recommendation
      }
    });
  } catch (error) {
    console.error('Error calculating cart price:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 