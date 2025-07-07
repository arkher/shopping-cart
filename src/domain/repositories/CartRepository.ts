import { CartEntity } from '../entities/Cart';

export interface CartRepository {
  findById(id: string): Promise<CartEntity | null>;
  findByCustomerId(customerId: string): Promise<CartEntity | null>;
  save(cart: CartEntity): Promise<CartEntity>;
  delete(id: string): Promise<void>;
} 