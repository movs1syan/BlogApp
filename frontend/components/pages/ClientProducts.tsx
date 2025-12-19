"use client";

import React, {useState, useEffect, Activity} from 'react';
import ProductCard from "@/components/ProductCard";
import type {ProductType} from "@/shared/types";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import Modal from "@/components/ui/Modal";
import ModalInput from '../ui/ModalInput';
import {TriangleAlert} from "lucide-react";

const ClientProductsPage = ({ products }: { products: ProductType[] }) => {
  const [productsData, setProductsData] = useState<ProductType[]>(products);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setProductsData(products);
  }, [products]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image" && e.target.files) {
      setNewProduct(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <>
      <main>
        <Activity mode={user ? "visible" : "hidden"}>
          <div className={"mt-10 flex justify-end"}>
            <Button icon={"PlusIcon"} onClick={() => setIsModalOpen(true)}>Create new product</Button>
          </div>
        </Activity>

        <h1 className="text-2xl font-bold mb-6 mt-15">Products</h1>

        {productsData.length > 0 ? (
          <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15"}>
            {productsData.map((product: ProductType) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">No products found.</p>
        )}
      </main>

      <Modal title={"Create Product"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-3"}>
          <ModalInput fieldName={"Name"} inputName={"name"} handleChange={handleChange} />
          <ModalInput fieldName={"Description"} inputName={"description"} handleChange={handleChange} />
          <ModalInput fieldName={"Price"} inputName={"price"} handleChange={handleChange} />
          <label className={"flex flex-col gap-2"}>
            Upload image for product
            <Button icon={"ImageUp"}>
              <input type={"file"} name={"product"} accept={"image/*"} onChange={handleChange} className={"cursor-pointer"} />
            </Button>
          </label>

          {/*{error && (*/}
          {/*  <div className={"flex justify-center items-center gap-2 text-red-600 mt-2"}>*/}
          {/*    <TriangleAlert size={20} />*/}
          {/*    <p className={"text-sm"}>{error}</p>*/}
          {/*  </div>*/}
          {/*)}*/}

          <div className="flex gap-5 justify-end mt-3">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary">Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ClientProductsPage;