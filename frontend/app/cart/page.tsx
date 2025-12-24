"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from "@/hooks/useCart";
import type { ICartItem } from "@/shared/types";
import Button from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import CartItemCard from "@/components/CartItemCard";

const CartPage = () => {
  const { cartItems: items } = useCart();
  const [cartItems, setCartItems] = useState<ICartItem[]>(items);
  const [selectedProducts, setSelectedProducts] = useState<ICartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  useEffect(() => {
    let total = 0;

    selectedProducts.forEach(item => {
      total += item.quantity * Number(item.product.price);
    });

    setTotalAmount(total);
  }, [selectedProducts]);

  const handleSelect = (item: ICartItem, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, item]);
    } else {
      setSelectedProducts(prev => prev.filter(product => product.id !== item.id));
    }
  };

  return (
    <>
      {cartItems.length > 0 ? (
        <main>
          <h1 className={"font-bold text-3xl mt-10"}>My Cart</h1>
          <div className={"flex gap-10 mt-5"}>
            <div className={"flex-1"}>
              <div className={"flex flex-col gap-5"}>
                {cartItems.map(item => (
                  <label key={item.id} className={"flex items-center gap-6"}>
                    <input type={"checkbox"} className={"w-6 h-6 cursor-pointer"} checked={selectedProducts.includes(item)} onChange={(e) => handleSelect(item, e.target.checked)} />
                    <CartItemCard item={item} />
                  </label>
                ))}
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