import { CartEntity } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';
import { globalCartStore } from './GlobalCartStore';

export class ServerCartRepository implements CartRepository {
  async findById(id: string): Promise<CartEntity | null> {
    return globalCartStore.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<CartEntity | null> {
    return globalCartStore.findByCustomerId(customerId);
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    return globalCartStore.save(cart);
  }

  async delete(id: string): Promise<void> {
    globalCartStore.delete(id);
  }
} 