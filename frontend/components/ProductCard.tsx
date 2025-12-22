import React, {Activity, memo} from 'react';
import {ProductType} from "@/shared/types";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { user } = useUser();
  const fullImageUrl = `http://localhost:8000${product.image}`;

  return (
    <article className="rounded-xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between gap-7 transition-shadow duration-200 md:max-w-90">
      <div className="flex flex-col justify-center gap-4">
        <Image src={product.image ? fullImageUrl : '/no-image.jpg'} alt="Featured Image" unoptimized width={400} height={600} />

        <h2 className="text-xl font-semibold">{product.name}</h2>

        <p className="text-gray-600">{product.description}</p>

        <div className={"flex justify-between items-center"}>
          <span className={"text-4xl font-bold"}>$ {product.price}</span>
          <Activity mode={product.userId !== user?.id ? "visible" : "hidden"}>
            <Button type={"primary"} icon={"BadgeDollarSign"}>Buy</Button>
          </Activity>
        </div>
      </div>
    </article>
  );
};

export default memo(ProductCard);