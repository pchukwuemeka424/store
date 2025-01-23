import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import supabaseDb from '@/utils/supabase-db';

export const revalidate = 5;

export default function ProductFetch() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const isFetching = useRef(false);

  const fetchProducts = useCallback(async (page: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabaseDb
        .from('products')
        .select(`*,
          user_profile ("*")
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1); // Fetch 10 products per page

      if (error) throw error;

      if (data) {
        setProducts((prevProducts) => [...prevProducts, ...data]);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !isFetching.current) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    const debouncedHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link href={`/product/${product.user_id}`} key={index} passHref>
          <Card className="hover:shadow-lg transition">
            <CardHeader className="p-0">
              <Image
                 src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                alt={product.title || `Product ${index + 1}`}
                className="w-full h-40 object-contain rounded mb-4"
                width={500}
                height={500}
              />
            </CardHeader>
            <div className="px-4">
              <CardTitle className="capitalize text-sm font-bold">{product.title}</CardTitle>
              <CardDescription className="capitalize text-sm text-gray-600">
                {product.user_profile?.shopname || 'Store Name'}
              </CardDescription>
              <div className="flex justify-between items-center mb-3">
                <div className="capitalize text-xs text-gray-600">
                  {product.user_profile?.stat || 'State'}, {product.user_profile?.city || 'City'}
                </div>
                <div className="text-sm font-semibold text-green-500">
                  ₦{product.price}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
      {isLoading && <div className="col-span-full text-center text-gray-500">Loading more products...</div>}
    </div>
  );
}
