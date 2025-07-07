'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/domain/entities/Product';
import { Customer } from '@/domain/entities/Customer';
import { CartItem } from '@/domain/entities/CartItem';

interface PricingResult {
  originalPrice: number;
  finalPrice: number;
  discount: number;
  promotionType: string;
  description: string;
  savingsPercentage: number;
}

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartId] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCartId = localStorage.getItem('cartId');
      if (savedCartId) {
        return savedCartId;
      }
    }
    const newCartId = 'cart-' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartId', newCartId);
    }
    return newCartId;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers')
        ]);
        
        const productsData = await productsRes.json();
        const customersData = await customersRes.json();
        
        setProducts(productsData.products);
        setCustomers(customersData.customers);
        
        if (customersData.customers.length > 0) {
          setSelectedCustomer(customersData.customers[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch('/api/cart/load', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.cart && data.cart.items) {
            setCartItems(data.cart.items);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    if (cartId) {
      loadCart();
    }
  }, [cartId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!selectedCustomer) {
      alert('Please select a customer first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          productId: product.id,
          quantity,
          customerId: selectedCustomer
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCartItems(result.cart.items);
        if (selectedCustomer) {
          await calculatePricing();
        }
      } else {
        console.error('Error adding item to cart:', result.error);
        alert('Error adding item to cart: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!selectedCustomer || cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          customerId: selectedCustomer
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPricingResult(result.pricing.bestOption);
      } else {
        console.error('Error calculating pricing:', result.error);
        alert('Error calculating pricing: ' + result.error);
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
      alert('Error calculating pricing');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
    setPricingResult(null);
    localStorage.removeItem('cartId');
    localStorage.removeItem('shopping-cart-data');
    // Generate new cartId
    const newCartId = 'cart-' + Date.now();
    localStorage.setItem('cartId', newCartId);
    window.location.reload(); // Simple way to reset cartId state
  };

  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🛒 Shopping Cart with Promotions
        </h1>
        
        {/* Customer Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-black">Customer Selection</h2>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          >
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.type})
              </option>
            ))}
          </select>
          
          {selectedCustomerData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800">
                <strong>Selected:</strong> {selectedCustomerData.name} 
                {selectedCustomerData.type === 'vip' && ' (VIP - 15% discount available)'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-black">Products</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">ID: {product.id}</p>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={loading || !selectedCustomer}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Adding...' : !selectedCustomer ? 'Select Customer First' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Cart ({getTotalItems()} items)
            </h2>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                                 <div className="space-y-2">
                   {selectedCustomer && (
                     <button
                       onClick={calculatePricing}
                       disabled={loading || cartItems.length === 0}
                       className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
                     >
                       {loading ? 'Calculating...' : 'Calculate Best Price'}
                     </button>
                   )}
                   <button
                     onClick={clearCart}
                     className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                   >
                     Clear Cart
                   </button>
                 </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing Results */}
        {pricingResult && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-black">Pricing Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Best Deal</h3>
                <p className="text-blue-600 mb-2">{pricingResult.description}</p>
                <div className="space-y-1">
                  <p><span className="font-semibold">Original Price:</span> ${pricingResult.originalPrice.toFixed(2)}</p>
                  <p><span className="font-semibold">Final Price:</span> ${pricingResult.finalPrice.toFixed(2)}</p>
                  <p><span className="font-semibold">Savings:</span> ${pricingResult.discount.toFixed(2)} ({pricingResult.savingsPercentage.toFixed(1)}%)</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Promotion Applied</h3>
                <p className="text-green-600 capitalize">{pricingResult.promotionType.replace('_', ' ')}</p>
                {pricingResult.promotionType !== 'none' && (
                  <p className="text-sm text-green-600 mt-2">
                    You saved ${pricingResult.discount.toFixed(2)} on this purchase!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
