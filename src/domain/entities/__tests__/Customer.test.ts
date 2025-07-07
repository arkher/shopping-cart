import { CustomerEntity, CustomerType } from '../Customer';

describe('CustomerEntity', () => {
  describe('create', () => {
    it('should create a customer with valid data', () => {
      const customer = CustomerEntity.create('customer-1', CustomerType.COMMON, 'John Doe');
      
      expect(customer.id).toBe('customer-1');
      expect(customer.type).toBe(CustomerType.COMMON);
      expect(customer.name).toBe('John Doe');
    });
  });

  describe('createVIP', () => {
    it('should create a VIP customer', () => {
      const customer = CustomerEntity.createVIP('vip-1', 'Jane Smith');
      
      expect(customer.id).toBe('vip-1');
      expect(customer.type).toBe(CustomerType.VIP);
      expect(customer.name).toBe('Jane Smith');
    });
  });

  describe('createCommon', () => {
    it('should create a common customer', () => {
      const customer = CustomerEntity.createCommon('customer-2', 'Bob Johnson');
      
      expect(customer.id).toBe('customer-2');
      expect(customer.type).toBe(CustomerType.COMMON);
      expect(customer.name).toBe('Bob Johnson');
    });
  });

  describe('isVIP', () => {
    it('should return true for VIP customers', () => {
      const vipCustomer = CustomerEntity.createVIP('vip-1', 'Jane Smith');
      expect(vipCustomer.isVIP).toBe(true);
    });

    it('should return false for common customers', () => {
      const commonCustomer = CustomerEntity.createCommon('customer-1', 'John Doe');
      expect(commonCustomer.isVIP).toBe(false);
    });
  });
}); 