import { CartItemEntity } from '../CartItem';
import { ProductEntity } from '../Product';

describe('CartItemEntity', () => {
  let product: ProductEntity;

  beforeEach(() => {
    product = ProductEntity.create('tshirt', 'T-shirt', 35.99);
  });

  describe('create', () => {
    it('should create a cart item with valid data', () => {
      const cartItem = CartItemEntity.create(product, 2);
      
      expect(cartItem.product).toBe(product);
      expect(cartItem.quantity).toBe(2);
    });

    it('should throw error when quantity is zero', () => {
      expect(() => {
        CartItemEntity.create(product, 0);
      }).toThrow('Cart item quantity must be greater than 0');
    });

    it('should throw error when quantity is negative', () => {
      expect(() => {
        CartItemEntity.create(product, -1);
      }).toThrow('Cart item quantity must be greater than 0');
    });
  });

  describe('totalPrice', () => {
    it('should calculate total price correctly', () => {
      const cartItem = CartItemEntity.create(product, 3);
      expect(cartItem.totalPrice).toBe(35.99 * 3);
    });

    it('should return product price for quantity 1', () => {
      const cartItem = CartItemEntity.create(product, 1);
      expect(cartItem.totalPrice).toBe(35.99);
    });
  });

  describe('increaseQuantity', () => {
    it('should increase quantity by default amount', () => {
      const cartItem = CartItemEntity.create(product, 1);
      const updatedItem = cartItem.increaseQuantity();
      
      expect(updatedItem.quantity).toBe(2);
      expect(updatedItem.product).toBe(product);
    });

    it('should increase quantity by specified amount', () => {
      const cartItem = CartItemEntity.create(product, 1);
      const updatedItem = cartItem.increaseQuantity(3);
      
      expect(updatedItem.quantity).toBe(4);
    });
  });

  describe('decreaseQuantity', () => {
    it('should decrease quantity by default amount', () => {
      const cartItem = CartItemEntity.create(product, 3);
      const updatedItem = cartItem.decreaseQuantity();
      
      expect(updatedItem?.quantity).toBe(2);
      expect(updatedItem?.product).toBe(product);
    });

    it('should decrease quantity by specified amount', () => {
      const cartItem = CartItemEntity.create(product, 5);
      const updatedItem = cartItem.decreaseQuantity(2);
      
      expect(updatedItem?.quantity).toBe(3);
    });

    it('should return null when quantity becomes zero', () => {
      const cartItem = CartItemEntity.create(product, 1);
      const updatedItem = cartItem.decreaseQuantity();
      
      expect(updatedItem).toBeNull();
    });

    it('should return null when quantity becomes negative', () => {
      const cartItem = CartItemEntity.create(product, 1);
      const updatedItem = cartItem.decreaseQuantity(2);
      
      expect(updatedItem).toBeNull();
    });
  });
}); 