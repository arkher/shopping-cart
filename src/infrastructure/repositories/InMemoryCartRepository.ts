import { CartEntity } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';

export class InMemoryCartRepository implements CartRepository {
  private carts: Map<string, CartEntity> = new Map();

  async findById(id: string): Promise<CartEntity | null> {
    return this.carts.get(id) || null;
  }

  async findByCustomerId(customerId: string): Promise<CartEntity | null> {
    for (const cart of this.carts.values()) {
      if (cart.customerId === customerId) {
        return cart;
      }
    }
    return null;
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    this.carts.set(cart.id, cart);
    return cart;
  }

  async delete(id: string): Promise<void> {
    this.carts.delete(id);
  }
} 