import { CartEntity } from '../../domain/entities/Cart';
import { CartRepository } from '../../domain/repositories/CartRepository';
import { InMemoryCartRepository } from './InMemoryCartRepository';
import { LocalStorageCartRepository } from './LocalStorageCartRepository';

export class HybridCartRepository implements CartRepository {
  private memoryRepo: InMemoryCartRepository;
  private localStorageRepo: LocalStorageCartRepository;

  constructor() {
    this.memoryRepo = new InMemoryCartRepository();
    this.localStorageRepo = new LocalStorageCartRepository();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async findById(id: string): Promise<CartEntity | null> {
    if (this.isClient()) {
      const localStorageCart = await this.localStorageRepo.findById(id);
      if (localStorageCart) {
        await this.memoryRepo.save(localStorageCart);
        return localStorageCart;
      }
    }
    
    return this.memoryRepo.findById(id);
  }

  async findByCustomerId(customerId: string): Promise<CartEntity | null> {
    if (this.isClient()) {
      const localStorageCart = await this.localStorageRepo.findByCustomerId(customerId);
      if (localStorageCart) {
        await this.memoryRepo.save(localStorageCart);
        return localStorageCart;
      }
    }
    
    return this.memoryRepo.findByCustomerId(customerId);
  }

  async save(cart: CartEntity): Promise<CartEntity> {
    const savedCart = await this.memoryRepo.save(cart);
    
    if (this.isClient()) {
      await this.localStorageRepo.save(savedCart);
    }
    
    return savedCart;
  }

  async delete(id: string): Promise<void> {
    await this.memoryRepo.delete(id);
    
    if (this.isClient()) {
      await this.localStorageRepo.delete(id);
    }
  }
} 