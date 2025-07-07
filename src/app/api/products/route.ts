import { productRepository } from '@/infrastructure/repositories/Repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await productRepository.findAll();
    
    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 