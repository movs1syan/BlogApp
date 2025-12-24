"use client";

import React, { createContext } from 'react';
import type { ICartItem } from "@/shared/types";

interface CartContextType {
  cartItems: ICartItem[];
}

export const CartContext = createContext<CartContextType| null>(null);

export const CartProvider = ({ cartItems, children }: { cartItems: ICartItem[], children: React.ReactNode }) => {
  return <CartContext.Provider value={{ cartItems }}>
    {children}
  </CartContext.Provider>
};