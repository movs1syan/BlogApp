import React from 'react';
import { apiFetch } from "@/lib/apiFetch";
import { Package } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { IOrderItem } from "@/shared/types";
import OrderCard from "@/components/OrderCard";

const OrdersPage = async () => {
  const orders: IOrderItem[] = await apiFetch("GET", "products/order/get");

  return (
    <main>
      {orders.length > 0 ? (
        <main className={"my-10"}>
          <h1 className={"font-bold text-3xl"}>My Orders</h1>
          <div className={"flex flex-col gap-3 mt-5"}>
            {orders.map((order: IOrderItem) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <Package size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">You don’t have any orders yet.</h2>
          <p className="mt-2 max-w-sm">
            Once you place an order, it will appear here.
          </p>

          <div className={"mt-7"}>
            <Link href={'/cart'}>
              <Button type={"primary"} icon={"ShoppingCart"}>Go to cart</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrdersPage;