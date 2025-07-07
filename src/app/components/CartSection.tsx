import { CartItem } from "@/domain/entities/CartItem";
import React from "react";

interface CartSectionProps {
  cartItems: CartItem[];
  getTotalItems: () => number;
  getTotalPrice: () => number;
  selectedCustomer: string;
  calculatePricing: () => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  loading: boolean;
}

export const CartSection = ({
  cartItems,
  getTotalItems,
  getTotalPrice,
  selectedCustomer,
  calculatePricing,
  removeFromCart,
  clearCart,
  loading,
}: CartSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-black">
        Cart ({getTotalItems()} items)
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <div>
                  <p className="font-semibold text-gray-500">{item.product.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.product.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors p-1 hover:cursor-pointer"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-500">Subtotal:</span>
              <span className="text-black">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {selectedCustomer && (
              <button
                onClick={calculatePricing}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
              >
                {loading ? "Calculating..." : "Calculate Best Price"}
              </button>
            )}
            <button
              onClick={clearCart}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};
