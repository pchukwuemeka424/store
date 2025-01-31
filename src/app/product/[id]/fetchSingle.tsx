"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, FC } from "react";
import { FaStore, FaPhone, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import CategoryList from "@/components/category";
import supabaseDb from "@/utils/supabase-db";
import Link from "next/link";
import FeatureProducts from "./feature";
import Image from "next/image";
import { formatCurrency } from "@/components/currency";




const ProductPage: FC = () => {
  const params = useParams();
  const { id } = params || {};

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
  }, []);


 
 

  const [product, setProduct] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabaseDb
          .from("products")
          .select(`*,
            user_profile(*)
          `)
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
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Section */}
      <aside className="lg:w-1/4 bg-gray-50 p-4">
        <CategoryList />
      </aside>

      {/* Product Detail Section */}
      <main className="lg:w-3/4 p-6 flex flex-col items-center">
        {product ? (
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:text-left">
            {/* Product Image */}
            <div className="lg:w-1/2 w-full">
            
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                width={500}
                height={600}
                alt={product.title || "Product Image"}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
        
            {/* Product Details */}
            <div className="lg:w-1/2">
              <div className="text-2xl capitalize font-bold text-gray-800 mb-2">{product.title || "Product Title"}</div>
              <div className="text-gray-700 mb-4">
                <strong>Description:</strong> {product.description || "No description available."}
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Price: {formatCurrency(product.price || 0)}
              </p>
              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <p>
                  <FaStore className="inline mr-2" />
                  Store: {product.user_profile?.shopname || "Unknown"}
                </p>
                <p>
                  <FaMapMarkerAlt className="inline mr-2" />
                  Location: {product.user_profile?.city || "N/A"}, {product.user_profile?.stat || "N/A"}
                </p>
             
              </div>
                
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-4">
                <Link
                  href={`/store/${product.user_profile?.username || "#"}`}
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <FaStore /> Visit Store
                </Link>
                <Link
                  href={`tel:${product.user_profile?.phone || "#"}`}
                  className="bg-orange-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 hover:bg-orange-700 transition-colors"
                >
                  <FaPhone /> Call
                  </Link>
                <Link
href={`https://api.whatsapp.com/send?phone=234${product.user_profile?.phone.substring(1) || "#"}&text=I'm%20interested%20in%20your%20product%20${isClient ? encodeURIComponent(window.location.href) : ""}`}

                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp /> Message
                  </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading product details...</p>
        )}
        <div className="w-full lg:w-full bg-gray-50 p-4 relative">
          {product && (
            <FeatureProducts currentProductId={product.id} currentProductTitle={product.title} />
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
