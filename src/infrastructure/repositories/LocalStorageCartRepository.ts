import { CartEntity } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';
import { Product } from '../../domain/entities/Product';

interface StoredCartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

interface StoredCart {
  id: string;
  customerId: string;
  items: StoredCartItem[];
  totalItems: number;
  totalPrice: number;
}

export class LocalStorageCartRepository implements CartRepository {
  private readonly storageKey = 'shopping-cart-data';

  private getStorage(): Map<string, CartEntity> {
    if (typeof window === 'undefined') {
      return new Map();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return new Map();
      }

      const data = JSON.parse(stored);
      const carts = new Map<string, CartEntity>();

      for (const [id, cartData] of Object.entries(data)) {
        const storedCart = cartData as StoredCart;
        const cart = CartEntity.create(id as string, storedCart.customerId);
        storedCart.items.forEach((itemData: StoredCartItem) => {
          cart.addItem(itemData.product, itemData.quantity);
        });
        carts.set(id, cart);
      }

      return carts;
    } catch (error) {
      console.error('Error loading cart data from localStorage:', error);
      return new Map();
    }
  }

  private saveStorage(carts: Map<string, CartEntity>): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const data: Record<string, StoredCart> = {};
      for (const [id, cart] of carts.entries()) {
        data[id] = {
          id: cart.id,
          customerId: cart.customerId,
          items: cart.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalPrice: item.totalPrice
          })),
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice
        };
      }
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cart data to localStorage:', error);
    }
  }

  async findById(id: string): Promise<CartEntity | null> {
    const carts = this.getStorage();
    return carts.get(id) || null;
  }

  async findByCustomerId(customerId: string): Promise<CartEntity | null> {
    const carts = this.getStorage();
    for (const cart of carts.values()) {
      if (cart.customerId === customerId) {
        return cart;
      }
    }
    return null;
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    const carts = this.getStorage();
    carts.set(cart.id, cart);
    this.saveStorage(carts);
    return cart;
  }

  async delete(id: string): Promise<void> {
    const carts = this.getStorage();
    carts.delete(id);
    this.saveStorage(carts);
  }
} 