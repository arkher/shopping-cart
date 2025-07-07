import { HybridCartRepository } from './HybridCartRepository';
import { ServerCartRepository } from './ServerCartRepository';
import { InMemoryProductRepository } from './InMemoryProductRepository';
import { InMemoryCustomerRepository } from './InMemoryCustomerRepository';

// Use ServerCartRepository for APIs (server-side) and HybridCartRepository for client-side
const isServer = typeof window === 'undefined';
console.log('isServer', isServer);
export const cartRepository = isServer ? new ServerCartRepository() : new HybridCartRepository();
export const productRepository = new InMemoryProductRepository();
export const customerRepository = new InMemoryCustomerRepository(); 