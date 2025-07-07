import { NextRequest, NextResponse } from 'next/server';
import { cartRepository } from '@/infrastructure/repositories/Repositories';
import { CartItemEntity } from '@/domain/entities/CartItem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Missing required field: cartId' },
        { status: 400 }
      );
    }

    const cart = await cartRepository.findById(cartId);

    if (!cart) {
      return NextResponse.json({
        success: true,
        cart: null,
        message: 'Cart not found'
      });
    }

    return NextResponse.json({
      success: true,
      cart: {
        id: cart.id,
        customerId: cart.customerId,
        items: cart.items.map((item: CartItemEntity) => ({
          product: item.product,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        })),
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice
      },
      message: 'Cart loaded successfully'
    });
  } catch (error) {
    console.error('Error loading cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 