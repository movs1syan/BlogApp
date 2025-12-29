"use client";

import React, {useState, useEffect, memo} from 'react';
import type { ICartItem } from "@/shared/types";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/apiFetch";
import Modal from "@/components/ui/Modal";

const CartItemCard = ({ item, productQty, handleIncreaseQty, handleDecreaseQty }: { item: ICartItem, productQty: number, handleIncreaseQty: (id: number) => void, handleDecreaseQty: (id: number) => void; }) => {
  const [itemData, setItemData] = useState<ICartItem>(item);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setItemData(item);
  }, [item]);

  const handleDelete = async (itemId: number) => {
    setLoading(true);
    await apiFetch("DELETE", "products/cart/delete", undefined, { itemId });
    setLoading(false);

    router.refresh();
  };

  const fullImageUrl = `http://localhost:8000${item.product.image}`;

  return (
    <>
      <div className={"flex w-full cursor-pointer justify-between items-center gap-7 shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-7 py-5 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
        <div className={"flex justify-between items-center flex-1"}>
          <div className={"flex items-center gap-12"}>
            <Image src={itemData.product.image ? fullImageUrl : '/no-image.jpg'} alt={'product'} height={100} width={100} unoptimized className={"h-[100px] w-[100px]"} />

            <span className={"text-xl"}>{itemData.product.name}</span>

            <div className={'flex items-center gap-5'}>
              <Button type={'text'} icon={"Minus"} onClick={() => handleDecreaseQty(item.id)}></Button>
              <span className={"font-semibold text-xl"}>{productQty}</span>
              <Button type={'text'} icon={"Plus"} onClick={() => handleIncreaseQty(item.id)}></Button>
            </div>
          </div>

          <span className={"font-semibold text-3xl"}>$ {productQty * Number(itemData.product.price)}</span>
        </div>

        <div className={"flex items-center gap-3"}>
          <div className={"h-20 w-[1px] border border-gray-200 my-auto"}></div>

          <Button type={"link"} color={"red"} icon={"Trash2"} size={"lg"} onClick={() => setIsModalOpen(true)}></Button>
        </div>
      </div>

      <Modal title={"Delete Group"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to remove product &quot;{item.product.name}&quot; ?</p>
          <div className="flex gap-5 justify-end">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" color="red" onClick={() => handleDelete(itemData.id)} loading={loading}>Delete</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(CartItemCard);