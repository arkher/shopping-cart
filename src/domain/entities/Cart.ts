import { CartItem, CartItemEntity } from './CartItem';
import { Product } from './Product';

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
}

export class CartEntity implements Cart {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: CartItemEntity[]
  ) {}

  static create(id: string, customerId: string): CartEntity {
    return new CartEntity(id, customerId, []);
  }

  addItem(product: Product, quantity: number = 1): CartEntity {
    const existingItemIndex = this.items.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...this.items];
      updatedItems[existingItemIndex] = updatedItems[existingItemIndex].increaseQuantity(quantity);
      return new CartEntity(this.id, this.customerId, updatedItems);
    }

    const newItem = CartItemEntity.create(product, quantity);
    return new CartEntity(this.id, this.customerId, [...this.items, newItem]);
  }

  removeItem(productId: string): CartEntity {
    const filteredItems = this.items.filter(item => item.product.id !== productId);
    return new CartEntity(this.id, this.customerId, filteredItems);
  }

  updateItemQuantity(productId: string, quantity: number): CartEntity {
    const itemIndex = this.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex === -1) {
      return this;
    }

    const updatedItems = [...this.items];
    
    if (quantity <= 0) {
      updatedItems.splice(itemIndex, 1);
    } else {
      updatedItems[itemIndex] = CartItemEntity.create(this.items[itemIndex].product, quantity);
    }

    return new CartEntity(this.id, this.customerId, updatedItems);
  }

  clear(): CartEntity {
    return new CartEntity(this.id, this.customerId, []);
  }

  get totalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }
} 