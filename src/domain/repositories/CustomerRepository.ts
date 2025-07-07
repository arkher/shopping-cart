import { CustomerEntity } from '../entities/Customer';

export interface CustomerRepository {
  findById(id: string): Promise<CustomerEntity | null>;
  save(customer: CustomerEntity): Promise<CustomerEntity>;
} 