import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class CartItemEntity implements CartItem {
  constructor(
    public readonly product: Product,
    public readonly quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error('Cart item quantity must be greater than 0');
    }
  }

  static create(product: Product, quantity: number): CartItemEntity {
    return new CartItemEntity(product, quantity);
  }

  get totalPrice(): number {
    return this.product.price * this.quantity;
  }

  increaseQuantity(amount: number = 1): CartItemEntity {
    return new CartItemEntity(this.product, this.quantity + amount);
  }

  decreaseQuantity(amount: number = 1): CartItemEntity | null {
    const newQuantity = this.quantity - amount;
    if (newQuantity <= 0) {
      return null;
    }
    return new CartItemEntity(this.product, newQuantity);
  }
} 