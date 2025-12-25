"use client";

import React, {useState, useEffect, useRef} from 'react';
import { useCart } from "@/hooks/useCart";
import type { ICartItem } from "@/shared/types";
import Button from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import CartItemCard from "@/components/CartItemCard";
import {apiFetch} from "@/lib/apiFetch";

const CartPage = () => {
  const { cartItems: items } = useCart();
  const [cartItems, setCartItems] = useState<ICartItem[]>(items);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  useEffect(() => {
    let total = 0;

    selectedProducts.forEach(itemId => {
      const item = cartItems.find(cartItem => cartItem.id === itemId);
      total += item.quantity * Number(item.product.price);
    });

    setTotalAmount(total);
  }, [selectedProducts, cartItems]);

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, id]);
    } else {
      setSelectedProducts(prev => prev.filter(productId => productId !== id));
    }
  };

  const handleIncreaseQty = async (id: number) => {
    const currentItem = cartItems.find(item => item.id === id);
    if (!currentItem) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await apiFetch("PUT", "products/cart/change-quantity", undefined, { productId: currentItem.product.id, productQty: currentItem.quantity + 1 });
    }, 1000);
  };

  const handleDecreaseQty = (id: number) => {
    const currentItem = cartItems.find(item => item.id === id);

    if (!currentItem || currentItem.quantity === 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await apiFetch("PUT", "products/cart/change-quantity", undefined, { productId: currentItem.product.id, productQty: currentItem.quantity - 1 });
    }, 1000);
  };

  return (
    <>
      {cartItems.length > 0 ? (
        <main>
          <h1 className={"font-bold text-3xl mt-10"}>My Cart</h1>
          <div className={"flex gap-10 mt-5"}>
            <div className={"flex-1"}>
              <div className={"flex flex-col gap-5"}>
                {cartItems.map(item => {
                  return (
                    <label key={item.id} className={"flex items-center gap-6"}>
                      <input type={"checkbox"} className={"w-6 h-6 cursor-pointer"} checked={selectedProducts.includes(item.id)} onChange={(e) => handleSelect(item.id, e.target.checked)} />
                      <CartItemCard item={item} productQty={item.quantity} handleIncreaseQty={handleIncreaseQty} handleDecreaseQty={handleDecreaseQty} />
                    </label>
                  )}
                )}
              </div>
            </div>

            <div className={"flex-col h-fit min-w-[300px] w-[300px]"}>
              <div className={"bg-gray-100 rounded-lg p-5"}>
                <p className={"font-semibold text-xl"}>Selected offer summary</p>

                <div className={"h-[1px] w-full border border-gray-300 my-6"}></div>

                <div className={"flex justify-between items-center"}>
                  <span className={"font-semibold text-lg text-gray-400 mt-auto tracking-wider"}>TOTAL</span>
                  <span className={"font-semibold text-4xl"}>$ {totalAmount}</span>
                </div>
              </div>

              <div className={"flex justify-end mt-4"}>
                <Button type={"primary"} icon={"CreditCard"}>Order</Button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <ShoppingCart size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">Cart is empty.</h2>
          <p className="mt-2 max-w-sm">
            Your cart is empty. Visit our store, you will find something you are searching for.
          </p>

          <div className={"mt-7"}>
            <Link href={'/store'}>
              <Button type={"primary"} icon={"ShoppingBag"}>Go to store</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;