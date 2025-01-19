import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';

export default function ProductFetch() {
  const [products, setProducts] = useState([]);
 
  const [page, setPage] = useState(1);
  const isFetching = useRef(false);

  const fetchProducts = useCallback(async (page: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const { data, error } = await supabaseDb
        .from('products')
        .select(`
          id,
          title,
          user_id,
          price,
          image,
          user_profile  ("*")
        `)
        .range((page - 1) * 10, page * 10 - 1); // Adjust range to fetch in chunks of 10

      if (error) throw error;

      setProducts((prevProducts) => [...prevProducts, ...data]);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
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
      {products.map((product, index) => (
        <Link href={`/product/${product.user_id}`} key={index} passHref>
          <Card className="hover:shadow-lg transition">
            <CardHeader className='p-0'>
              <Image
                src={product.image || '/placeholder.png'}
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
