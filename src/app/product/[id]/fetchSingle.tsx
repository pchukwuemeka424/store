"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, FC } from "react";
import { FaStore, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { CheckCircle, AlertTriangle } from "lucide-react";
import CategoryList from "@/components/category";
import supabaseDb from "@/utils/supabase-db";
import Link from "next/link";
import FeatureProducts from "./feature";
import Image from "next/image";
import { formatCurrency } from "@/components/currency";
import SendMessageModel from "@/components/sendMessageModel";

const ProductPage: FC = () => {
  const params = useParams();
  const { id } = params || {};

  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabaseDb
          .from("products")
          .select(`*, user_profile(*)`)
          .eq("user_id", id)
          .maybeSingle();

        if (error) {
          setError(error.message);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("An error occurred while fetching the product.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6">
      {/* Sidebar Section */}
      <aside className="lg:w-1/4 bg-white shadow-lg rounded-lg p-4">
        <CategoryList />
      </aside>

      {/* Product Detail Section */}
      <main className="lg:w-3/4 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        {product ? (
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Product Image */}
            <div className="lg:w-1/2 w-full flex justify-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`}
                width={500}
                height={600}
                alt={product.title || "Product Image"}
                className="w-full h-96 object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">{product.title || "Product Title"}</h1>
              <p className="text-gray-700 leading-relaxed">{product.description || "No description available."}</p>
              <p className="text-2xl font-semibold text-blue-600">{formatCurrency(product.price || 0)}</p>

              {/* Business Verification Status */}
              <div className="flex flex-col gap-2 p-3 rounded-md border bg-gray-100">
                {product.user_profile?.kyc_status === "Approved" ? (
                  <span className="text-green-600 flex items-center gap-2">
                    <CheckCircle /> Verified Business
                  </span>
                ) : (
                  <div className="text-red-600 flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <AlertTriangle /> Unverified Business
                    </span>
                    <p className="text-sm">Please exercise caution when dealing with unverified businesses. Always verify their credibility before making any transactions.</p>
                    <p className="text-sm">Consider requesting additional proof of legitimacy, such as business registration details or past customer reviews.</p>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <FaStore className="inline mr-2 text-blue-600" />
                  Store: {product.user_profile?.shopname || "Unknown"}
                </p>
                <p>
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  Location: {product.user_profile?.city || "N/A"}, {product.user_profile?.stat || "N/A"}
                </p>
              </div>

              <div className="flex space-x-3 mt-4">
                <Link
                  href={`/store/${product.user_profile?.username || "#"}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <FaStore /> Visit Store
                </Link>
                <Link
                  href={`tel:${product.user_profile?.phone || "#"}`}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700 transition"
                >
                  <FaPhone /> Call Seller
                </Link>
                <SendMessageModel product={product} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading product details...</p>
        )}

        {/* Related Products */}
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
          {product && <FeatureProducts currentProductId={product.id} currentProductTitle={product.title} />}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
