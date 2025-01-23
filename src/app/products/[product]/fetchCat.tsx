"use client";
import { createClient } from '@/utils/supabase/client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

export default function Page() {
  const { product } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const productIds = useRef(new Set()); // Track product IDs

  const fetchProducts = useCallback(async (page: number) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`*,
          user_profile(*)
        `)
        .eq('category', product)
        .range((page - 1) * 10, page * 10 - 1);

      if (error) throw error;

      const newProducts = data.filter(product => !productIds.current.has(product.id));
      newProducts.forEach(product => productIds.current.add(product.id));

      setProducts((prevProducts: any) => [...prevProducts, ...newProducts]);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  }, [product]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setPage((prevPage: number) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && page === 1) {
    return <p>Loading products...</p>;
  }

  if (products.length === 0 && !loading) {
    return <ProductNotFound />;
  }

  return (
    <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product: { user_id: any; image: any; title: any; user_profile: { shopname: any; stat: any; city: any; }; price: any; }, index: number) => (
        <Link href={`/product/${product.user_id}`} key={product.user_id} passHref>
          <Card className="hover:shadow-lg transition">
            <CardHeader className='p-0'>
              <Image
                 src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                alt={product.title || `Product ${index + 1}`}
                className="w-full h-40 object-cover rounded mb-4"
                width={500}
                height={500}
              />
            </CardHeader>
            <div className="px-4">
              <CardTitle className="capitalize text-sm font-bold">{product.title}</CardTitle>
              <CardDescription className="capitalize text-sm text-gray-600">
                {product.user_profile.shopname || 'Store Name'}
              </CardDescription>
              <div className="flex justify-between items-center mb-3">
                <div className="capitalize text-xs text-gray-600">
                  {product.user_profile.stat || 'City'}, {product.user_profile.city || 'City'}
                </div>
                <div className="text-sm font-semibold text-green-500">
                  ₦{product.price}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
      {loading && <p>Loading more products...</p>}
    </div>
  );
}