import { CartRepository } from "@/domain/repositories/CartRepository";

export interface RemoveItemFromCartRequest {
  cartId: string;
  productId: string;
}

export interface RemoveItemFromCartResponse {
  success: boolean;
  cart?: {
    id: string;
    customerId: string;
    items: Array<{
      product: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
      totalPrice: number;
    }>;
    totalItems: number;
    totalPrice: number;
  };
  error?: string;
}

export class RemoveItemFromCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(
    request: RemoveItemFromCartRequest
  ): Promise<RemoveItemFromCartResponse> {
    try {
      const { cartId, productId } = request;

      const cart = await this.cartRepository.findById(cartId);
      if (!cart) {
        return {
          success: false,
          error: "Cart not found",
        };
      }

      const itemExists = cart.items.some(
        (item) => item.product.id === productId
      );
      if (!itemExists) {
        return {
          success: false,
          error: "Product not found in cart",
        };
      }

      const updatedCart = cart.removeItem(productId);

      const savedCart = await this.cartRepository.save(updatedCart);

      return {
        success: true,
        cart: {
          id: savedCart.id,
          customerId: savedCart.customerId,
          items: savedCart.items.map((item) => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
            },
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
          totalItems: savedCart.totalItems,
          totalPrice: savedCart.totalPrice,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
