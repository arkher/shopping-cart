"use client";

import { CartItem } from "@/domain/entities/CartItem";
import { Customer } from "@/domain/entities/Customer";
import { Product } from "@/domain/entities/Product";
import { PricingResult } from "@/types";
import { useEffect, useState } from "react";
import {
  CartSection,
  CustomerSelectionSection,
  PricingResultSection,
  ProductsSection,
} from "./components";

interface CartItemWithProduct extends CartItem {
  product: Product;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [cartId] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCartId = localStorage.getItem("cartId");
      if (savedCartId) {
        return savedCartId;
      }
    }
    const newCartId = "cart-" + Date.now();
    if (typeof window !== "undefined") {
      localStorage.setItem("cartId", newCartId);
    }
    return newCartId;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/customers"),
        ]);

        const productsData = await productsRes.json();
        const customersData = await customersRes.json();

        setProducts(productsData.products);
        setCustomers(customersData.customers);

        if (customersData.customers.length > 0) {
          setSelectedCustomer(customersData.customers[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart/load", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        console.error("Error loading cart:", error);
      }
    };

    if (cartId) {
      loadCart();
    }
  }, [cartId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!selectedCustomer) {
      alert("Please select a customer first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          productId: product.id,
          quantity,
          customerId: selectedCustomer,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCartItems(result.cart.items);
        if (selectedCustomer) {
          await calculatePricing();
        }
      } else {
        console.error("Error adding item to cart:", result.error);
        alert("Error adding item to cart: " + result.error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding item to cart");
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!selectedCustomer || cartItems.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/cart/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          customerId: selectedCustomer,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPricingResult(result.pricing.bestOption);
      } else {
        console.error("Error calculating pricing:", result.error);
        alert("Error calculating pricing: " + result.error);
      }
    } catch (error) {
      console.error("Error calculating pricing:", error);
      alert("Error calculating pricing");
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPricingResult(null);
    localStorage.removeItem("cartId");
    localStorage.removeItem("shopping-cart-data");
    // Generate new cartId
    const newCartId = "cart-" + Date.now();
    localStorage.setItem("cartId", newCartId);
    window.location.reload(); // Simple way to reset cartId state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🛒 Shopping Cart with Promotions
        </h1>

        <CustomerSelectionSection
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductsSection
            products={products}
            addToCart={addToCart}
            loading={loading}
            selectedCustomer={selectedCustomer}
          />

          <CartSection
            cartItems={cartItems}
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
            selectedCustomer={selectedCustomer}
            calculatePricing={calculatePricing}
            clearCart={clearCart}
            loading={loading}
          />
        </div>

        <PricingResultSection pricingResult={pricingResult} />
      </div>
    </div>
  );
}
