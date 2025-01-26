"use server";
import React from 'react';
import Topbar from '@/components/topbar';
import ProductForm from '@/components/ProductForm';
import addProduct from '@/actions/auth/productsAdd';
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export default async function Product() {
  const supabase = await createClient();

  // get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // fetch total product uploads
  const { count: totalUploads, error: totalUploadsError } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("id", user.id);

  const canUpload = totalUploads < 18; // Adjust based on your limit logic

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
        {/* Topbar */}
        <Topbar />
        {totalUploads === 18 ? (
          <div className="bg-red-500 text-white p-4 rounded-md">
            You have reached the maximum number of product uploads. Please upgrade your plan to add more products.
          </div>
        ) : (
          <div className="bg-green-500 text-white p-4 rounded-md">
            You can upload {18 - totalUploads} more products.
          </div>
        )}

        {/* Add Product Form */}
        <ProductForm handler={addProduct} canUpload={canUpload} />
      </div>
    </div>
  );
}