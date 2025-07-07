import { CartEntity } from '../Cart';
import { ProductEntity } from '../Product';

describe('CartEntity', () => {
  let tshirt: ProductEntity;
  let jeans: ProductEntity;

  beforeEach(() => {
    tshirt = ProductEntity.create('tshirt', 'T-shirt', 35.99);
    jeans = ProductEntity.create('jeans', 'Jeans', 65.50);
  });

  describe('create', () => {
    it('should create an empty cart', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      
      expect(cart.id).toBe('cart-1');
      expect(cart.customerId).toBe('customer-1');
      expect(cart.items).toEqual([]);
      expect(cart.isEmpty).toBe(true);
    });
  });

  describe('addItem', () => {
    it('should add a new item to empty cart', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      const updatedCart = cart.addItem(tshirt, 2);
      
      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].product).toBe(tshirt);
      expect(updatedCart.items[0].quantity).toBe(2);
    });

    it('should increase quantity when adding existing product', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      let updatedCart = cart.addItem(tshirt, 1);
      updatedCart = updatedCart.addItem(tshirt, 2);
      
      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].quantity).toBe(3);
    });
  });

  describe('totalItems', () => {
    it('should return zero for empty cart', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      expect(cart.totalItems).toBe(0);
    });

    it('should return total quantity of all items', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      let updatedCart = cart.addItem(tshirt, 2);
      updatedCart = updatedCart.addItem(jeans, 3);
      
      expect(updatedCart.totalItems).toBe(5);
    });
  });

  describe('totalPrice', () => {
    it('should return zero for empty cart', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      expect(cart.totalPrice).toBe(0);
    });

    it('should calculate total price correctly', () => {
      const cart = CartEntity.create('cart-1', 'customer-1');
      let updatedCart = cart.addItem(tshirt, 2);
      updatedCart = updatedCart.addItem(jeans, 1);
      
      const expectedTotal = (35.99 * 2) + (65.50 * 1);
      expect(updatedCart.totalPrice).toBe(expectedTotal);
    });
  });
}); 