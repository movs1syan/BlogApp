import React from 'react';
import Image from "next/image";
import type { IOrderProduct } from "@/shared/types";

const OrderItemCard = ({ order }: { order: IOrderProduct }) => {
  const fullImageUrl = `http://localhost:8000${order.product.image}`

  return (
    <div className={"flex w-full justify-between items-center gap-7"}>
      <div className={"flex justify-between items-center flex-1"}>
        <div className={"flex items-center gap-12"}>
          <Image src={order.product.image ? fullImageUrl : '/no-image.jpg'} alt={'order'} height={100} width={100} unoptimized className={"h-[100px] w-[100px]"} />

          <span className={"text-xl"}>{order.product.name}</span>

          <div className={'flex items-center gap-5'}>
            <span className={"text-gray-400"}>Quantity:</span> <span className={"font-semibold text-xl"}>{order.quantity}</span>
          </div>
        </div>

        <div className={'flex items-center gap-5'}>
          <span className={"text-gray-400"}>Total amount:</span> <span className={"font-semibold text-2xl"}>$ {order.price}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;