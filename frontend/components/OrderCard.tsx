import React from 'react';
import type { IOrderItem } from "@/shared/types";
import OrderItemCard from "@/components/OrderItemCard";

const OrderCard = ({ order }: { order: IOrderItem }) => {
  let totalAmount = 0;
  order.orderedItems.forEach(item => {
    totalAmount += (item.quantity * item.price);
  });

  return (
    <div className={"flex flex-col w-full gap-7 shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-5 py-4 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
      {order.orderedItems.map(item => {
        return (
          <OrderItemCard key={item.id} order={item}/>
        )
      })}

      <div className={"h-[1px] w-full border border-gray-200 mx-auto"}></div>

      <span className={"flex justify-end font-semibold text-3xl text-gray-400 gap-5"}>Total:<span className={"text-black"}>$ {totalAmount}</span></span>
    </div>
  );
};

export default OrderCard;