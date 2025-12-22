"use client";

import React, {useState, useEffect, Activity} from 'react';
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type {ProductType, ProductCreationType} from "@/shared/types";
import Button from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import Modal from "@/components/ui/Modal";
import ModalInput from '../ui/ModalInput';
import {TriangleAlert} from "lucide-react";
import {apiFetch} from "@/lib/apiFetch";
import {useNotification} from "@/hooks/useNotification";

const ClientProductsPage = ({ products }: { products: ProductType[] }) => {
  const [productsData, setProductsData] = useState<ProductType[]>(products);
  const [newProduct, setNewProduct] = useState<ProductCreationType>({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { notify } = useNotification();
  const router = useRouter();

  useEffect(() => {
    setProductsData(products);
  }, [products]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "image" && e.target.files) {
      setNewProduct(prev => ({ ...prev, image: e.target.files![0] }));
    } else {
      setNewProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    setLoading(true);
    try {
      await apiFetch("POST", "products/create", undefined, formData);
      setNewProduct({ name: "", description: "", price: "", image: null });

      notify({
        type: "success",
        message: "Success!",
        description: `Created product "${newProduct.name}"`
      });

      setIsModalOpen(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      return;
    }
      setLoading(false);
      setError(null);

      router.refresh();
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
          <ModalInput fieldName={"Name"} inputName={"name"} handleChange={handleChange} value={newProduct.name} />
          <ModalInput fieldName={"Description"} inputName={"description"} handleChange={handleChange} value={newProduct.description} />
          <ModalInput fieldName={"Price"} inputName={"price"} handleChange={handleChange} value={newProduct.price} />
          <label className={"flex flex-col gap-2"}>
            Upload image for product
            <Button icon={"ImageUp"}>
              <input type={"file"} name={"image"} accept={"image/*"} onChange={handleChange} className={"cursor-pointer"} />
            </Button>
          </label>

          {error && (
            <div className={"flex justify-center items-center gap-2 text-red-600 mt-2"}>
              <TriangleAlert size={20} />
              <p className={"text-sm"}>{error}</p>
            </div>
          )}

          <div className="flex gap-5 justify-end mt-3">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button htmlType="submit" type="primary" loading={loading}>Create</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ClientProductsPage;