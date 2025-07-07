import { CartEntity } from '@/domain/entities/Cart';
import { CartRepository } from '@/domain/repositories/CartRepository';
import { ProductRepository } from '@/domain/repositories/ProductRepository';

export interface AddItemToCartRequest {
  cartId: string;
  productId: string;
  quantity: number;
  customerId: string;
}

export interface AddItemToCartResponse {
  cart: CartEntity | null;
  success: boolean;
  message: string;
}

export class AddItemToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(request: AddItemToCartRequest): Promise<AddItemToCartResponse> {
    try {
      if (request.quantity <= 0) {
        return {
          cart: null,
          success: false,
          message: 'Quantity must be greater than 0'
        };
      }

      const product = await this.productRepository.findById(request.productId);
      if (!product) {
        return {
          cart: null,
          success: false,
          message: 'Product not found'
        };
      }

      let cart = await this.cartRepository.findById(request.cartId);
      if (!cart) {
        cart = CartEntity.create(request.cartId, request.customerId);
      }
      
      const updatedCart = cart.addItem(product, request.quantity);
      
      const savedCart = await this.cartRepository.save(updatedCart);

      return {
        cart: savedCart,
        success: true,
        message: `Added ${request.quantity} ${product.name}(s) to cart`
      };
    } catch (error) {
      return {
        cart: null,
        success: false,
        message: `Error adding item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
} 