import React, {memo} from 'react';
import type { IOrderItem } from "@/shared/types";
import OrderItemCard from "@/components/OrderItemCard";
import {getDate} from "@/helpers/getDate";

const OrderCard = ({ order }: { order: IOrderItem }) => {
  let totalAmount = 0;
  order.orderedItems.forEach(item => {
    totalAmount += item.price;
  });

  return (
    <div className={"flex flex-col w-full gap-7 shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-5 py-4 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
      {order.orderedItems.map(item => {
        return (
          <OrderItemCard key={item.id} order={item}/>
        )
      })}

      <div className={"h-[1px] w-full border border-gray-200 mx-auto"}></div>

      <div className={"flex justify-between items-center"}>
        <span className={"flex justify-end font-semibold text-xl text-gray-400 gap-5"}>
          Ordered:<span className={"text-black"}>{getDate(String(order.createdAt))}</span>
        </span>
        <span className={"flex justify-end font-semibold text-3xl text-gray-400 gap-5"}>
          Total:<span className={"text-black"}>${totalAmount}</span>
        </span>
      </div>
    </div>
  );
};

export default memo(OrderCard);