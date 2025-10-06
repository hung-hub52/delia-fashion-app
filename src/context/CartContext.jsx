"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load từ localStorage khi mount
  const loadCart = () => {
    const saved = localStorage.getItem("cart");
    setCart(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    loadCart();
    // ✅ Nghe khi có event "cartUpdated"
    const handleCartUpdated = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  // ✅ Ghi lại khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải nằm trong CartProvider");
  return context;
}
