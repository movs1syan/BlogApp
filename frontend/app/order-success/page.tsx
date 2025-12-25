import React from 'react';
import {CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const SuccessOrderPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center mt-15">
      <CheckCircle size={85} className="text-green-600 mb-4 opacity-70" />
      <h1 className="text-2xl font-bold mt-4">Your order was successful!</h1>
      <p className="text-gray-600 mt-2">Thank you for your purchase. You will receive a message when your order will be delivered.</p>

      <Link href={'/cart'} className={"mt-7"}>
        <Button type={"primary"} icon={"ShoppingCart"}>Back to cart</Button>
      </Link>
    </div>
  );
};

export default SuccessOrderPage;