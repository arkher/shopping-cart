export enum CustomerType {
  COMMON = 'common',
  VIP = 'vip'
}

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
}

export class CustomerEntity implements Customer {
  constructor(
    public readonly id: string,
    public readonly type: CustomerType,
    public readonly name: string
  ) {}

  static create(id: string, type: CustomerType, name: string): CustomerEntity {
    return new CustomerEntity(id, type, name);
  }

  static createVIP(id: string, name: string): CustomerEntity {
    return new CustomerEntity(id, CustomerType.VIP, name);
  }

  static createCommon(id: string, name: string): CustomerEntity {
    return new CustomerEntity(id, CustomerType.COMMON, name);
  }

  get isVIP(): boolean {
    return this.type === CustomerType.VIP;
  }
} 