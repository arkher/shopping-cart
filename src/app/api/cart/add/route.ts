import { NextRequest, NextResponse } from 'next/server';
import { AddItemToCartUseCase } from '@/use-cases/AddItemToCartUseCase';
import { cartRepository, productRepository } from '@/infrastructure/repositories/Repositories';
import { CartItemEntity } from '@/domain/entities/CartItem';

const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository, productRepository);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, productId, quantity, customerId } = body;

    if (!cartId || !productId || quantity === undefined || !customerId) {
      return NextResponse.json(
        { error: 'Missing required fields: cartId, productId, quantity, customerId' },
        { status: 400 }
      );
    }

    const result = await addItemToCartUseCase.execute({
      cartId,
      productId,
      quantity: Number(quantity),
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
      cart: {
        id: result.cart?.id,
        customerId: result.cart?.customerId,
        items: result.cart?.items.map((item: CartItemEntity) => ({
          product: item.product,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        })),
        totalItems: result.cart?.totalItems,
        totalPrice: result.cart?.totalPrice
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 