"use client";

import React, {Activity, memo, useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import {ProductType} from "@/shared/types";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { useCart } from "@/hooks/useCart";
import { apiFetch } from "@/lib/apiFetch";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { user } = useUser();
  const { cartItems } = useCart();
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(() => {
    if (cartItems) {
      return cartItems.some(item => item.product.id === product.id);
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (!cartItems) return;

    setIsInCart(cartItems.some(item => item.product.id === product.id));
  }, [cartItems, product])

  const fullImageUrl = `http://localhost:8000${product.image}`;

  const handleAddToCart = async (id: number) => {
    if (!user) {
      router.push('/login');
    }
    if (isInCart) return;

    try {
      await apiFetch("POST", "products/cart/add", undefined, { productId: id, userId: product.userId });
    } catch (error) {
      console.log(error);
    }

    router.refresh();
  };

  return (
    <article className="rounded-xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between gap-7 transition-shadow duration-200 md:max-w-90">
      <div className="flex flex-col justify-center gap-4">
        <Image src={product.image ? fullImageUrl : '/no-image.jpg'} alt="Featured Image" unoptimized width={400} height={600} />

        <h2 className="text-xl font-semibold">{product.name}</h2>

        <p className="text-gray-600">{product.description}</p>

        <div className={"flex justify-between items-center mt-4"}>
          <span className={"text-4xl font-bold"}>$ {product.price}</span>
          <Activity mode={product.userId !== user?.id ? "visible" : "hidden"}>
            <Button type={isInCart ? "link" : "primary"} icon={isInCart ? "CheckCheck" : "ShoppingCart"} onClick={() => handleAddToCart(product.id)}>
              {isInCart ? "Added to cart" : "Add to cart"}
            </Button>
          </Activity>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);