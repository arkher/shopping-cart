import { NextResponse } from 'next/server';
import { customerRepository } from '@/infrastructure/repositories/Repositories';

export async function GET() {
  try {
    const customers = await customerRepository.findAll();
    
    return NextResponse.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 