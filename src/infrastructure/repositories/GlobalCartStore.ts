import { CartEntity } from '../../domain/entities/Cart';

// Global Map at process level to persist across module reloads
declare global {
  var __cartStore: Map<string, CartEntity> | undefined;
}

// Initialize global store if it doesn't exist
if (!global.__cartStore) {
  global.__cartStore = new Map();
}

const cartStore = global.__cartStore;

// Global store to share cart state across all API routes
class GlobalCartStore {
  findById(id: string): CartEntity | null {
    return cartStore.get(id) || null;
  }

  findByCustomerId(customerId: string): CartEntity | null {
    for (const cart of cartStore.values()) {
      if (cart.customerId === customerId) {
        return cart;
      }
    }
    return null;
  }

  save(cart: CartEntity): CartEntity {
    cartStore.set(cart.id, cart);
    return cart;
  }

  delete(id: string): void {
    cartStore.delete(id);
  }

  getAllCarts(): CartEntity[] {
    return Array.from(cartStore.values());
  }

  clear(): void {
    cartStore.clear();
  }
}

export const globalCartStore = new GlobalCartStore(); 