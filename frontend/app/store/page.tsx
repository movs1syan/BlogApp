import React from 'react';
import ClientProducts from "@/components/pages/ClientProducts";
import {apiFetch} from "@/lib/apiFetch";

const StorePage = async () => {

  const products = await apiFetch("GET", "products/get");
  return (
    <main>
      {/* Header */}
      <section className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="px-3 py-1 rounded-3xl bg-gray-100 w-fit">Products</div>
        <h2 className="font-semibold md:text-5xl text-3xl">Powerful products for modern teams</h2>
        <p className="text-center">From idea to launch, our products help you build faster,<br /> work smarter, and scale with confidence.</p>
      </section>

      {/* Blog Posts */}
      <section className="pb-10">
        <ClientProducts products={products} />
      </section>
    </main>
  );
};

export default StorePage;