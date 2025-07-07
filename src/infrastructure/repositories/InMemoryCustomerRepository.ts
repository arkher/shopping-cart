import { Customer, CustomerEntity } from '../../domain/entities/Customer';
import { CustomerRepository } from '../../domain/repositories/CustomerRepository';

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, Customer> = new Map();

  constructor() {
    this.customers.set('customer-1', CustomerEntity.createCommon('customer-1', 'Paulo Gomes'));
    this.customers.set('vip-1', CustomerEntity.createVIP('vip-1', 'Larissa Costa'));
  }

  async findAll(): Promise<CustomerEntity[]> {
    return Array.from(this.customers.values()).map(customer => {
      if (customer instanceof CustomerEntity) {
        return customer;
      }
      return CustomerEntity.create(customer.id, customer.type, customer.name);
    });
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const customer = this.customers.get(id);
    if (!customer) return null;
    
    if (customer instanceof CustomerEntity) {
      return customer;
    }
    
    return CustomerEntity.create(customer.id, customer.type, customer.name);
  }

  async save(customer: Customer): Promise<CustomerEntity> {
    const customerEntity = customer instanceof CustomerEntity 
      ? customer 
      : CustomerEntity.create(customer.id, customer.type, customer.name);
    
    this.customers.set(customer.id, customerEntity);
    return customerEntity;
  }
} 