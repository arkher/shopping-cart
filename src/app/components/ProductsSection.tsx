import React from "react";
import { Product } from "@/domain/entities/Product";

interface ProductsSectionProps {
  products: Product[];
  addToCart: (product: Product, quantity: number) => void;
  loading: boolean;
  selectedCustomer: string;
}

export const ProductsSection = ({
  products,
  addToCart,
  loading,
  selectedCustomer,
}: ProductsSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-black">Products</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-500">{product.name}</h3>
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
              {loading
                ? "Adding..."
                : !selectedCustomer
                ? "Select Customer First"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
