import React from 'react';
import {ProductType} from "@/shared/types";
import Image from "next/image";
import Button from "@/components/ui/Button";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <article className="rounded-xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between gap-7 transition-shadow duration-200 md:max-w-90">
      <div className="flex flex-col justify-center gap-4">
        <Image src={"/iphone17pro_orange.jpg"} alt="Featured Image" unoptimized width={400} height={400} className="md:h-60 w-full" />

        <h2 className="text-xl font-semibold">{product.name}</h2>

        <p className="text-gray-600">{product.description}</p>

        <div className={"flex justify-between items-center"}>
          <span className={"text-4xl font-bold"}>$ {product.price}</span>
          <Button type={"primary"} icon={"BadgeDollarSign"}>Buy</Button>
        </div>
      </div>

    </article>
  );
};

export default ProductCard;