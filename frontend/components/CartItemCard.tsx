"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { ICartItem } from "@/shared/types";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiFetch";

const CartItemCard = ({ item }: { item: ICartItem }) => {
  const [itemData, setItemData] = useState<ICartItem>(item);
  const [productQty, setProductQty] = useState(itemData.quantity);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    setItemData(item);
  }, [item]);

  const fullImageUrl = `http://localhost:8000${item.product.image}`;

  const handleDelete = async (itemId: number) => {
    await apiFetch("DELETE", "products/cart/delete", undefined, { itemId });

    router.refresh();
  };

  const handleIncreaseQty = async () => {
    setProductQty(prev => prev + 1);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await apiFetch("PUT", "products/cart/change-quantity", undefined, { productId: item.product.id, productQty: productQty + 1 });

      router.refresh();
    }, 1000);
  };

  const handleDecreaseQty = () => {
    if (productQty === 1) return;

    setProductQty(prev => prev - 1);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await apiFetch("PUT", "products/cart/change-quantity", undefined, { productId: item.product.id, productQty: productQty - 1 });

      router.refresh();
    }, 1000);
  };

  return (
    <div className={"flex w-full cursor-pointer justify-between items-center gap-7 shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-7 py-5 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
      <div className={"flex justify-between items-center flex-1"}>
        <div className={"flex items-center gap-12"}>
          <Image src={itemData.product.image ? fullImageUrl : '/no-image.jpg'} alt={'product'} height={100} width={100} unoptimized className={"h-[100px] w-[100px]"} />

          <span className={"text-xl"}>{itemData.product.name}</span>

          <div className={'flex items-center gap-5'}>
            <Button type={'text'} icon={"Minus"} onClick={handleDecreaseQty}></Button>
            <span className={"font-semibold text-xl"}>{productQty}</span>
            <Button type={'text'} icon={"Plus"} onClick={handleIncreaseQty}></Button>
          </div>
        </div>

        <span className={"font-semibold text-3xl"}>$ {productQty * Number(itemData.product.price)}</span>
      </div>

      <div className={"flex items-center gap-3"}>
        <div className={"h-20 w-[1px] border border-gray-200 my-auto"}></div>

        <Button type={"link"} color={"red"} icon={"Trash2"} size={"lg"} onClick={() => handleDelete(itemData.id)}></Button>
      </div>
    </div>
  );
};

export default CartItemCard;