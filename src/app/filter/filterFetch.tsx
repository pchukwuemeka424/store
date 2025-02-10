import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { MdErrorOutline } from 'react-icons/md';

export default function SearchProduct() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const search = searchParams.get('q');
  const state = searchParams.get('state');

  const fetchProducts = useCallback(async (page, search, state) => {
    if (!hasMore) return;

    try {
      let query = supabaseDb
        .from('products')
        .select(`
          id,
          title,
          user_id,
          price,
          image,
          user_profile (id, city, stat, shopname)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      if (state) {
        query = query.ilike('state', `%${state}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data.length < 10) {
        setHasMore(false);
      }

      setProducts((prevProducts) => {
        if (page === 1) return data;
        return [...prevProducts, ...data.filter((p) => !prevProducts.some((prev) => prev.id === p.id))];
      });
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  }, [hasMore]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, search, state);
  }, [search, state, fetchProducts]);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, search, state);
    }
  }, [page, search, state, fetchProducts]);

  const handleScroll = useCallback(() => {
    if (!hasMore) return;
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (products.length === 0) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center py-10">
        <MdErrorOutline className="text-red-500 text-6xl mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">No products found</h2>
        <p className="text-sm text-gray-500">Try searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <Link href={`/product/${product.user_id}`} key={`${product.id}-${index}`} passHref>
          <Card className="hover:shadow-lg transition">
            <CardHeader className='p-0'>
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.image}`} 
                alt={product.title || `Product ${index + 1}`}
                className="w-full h-40 sm:h-64 object-cover rounded mb-4"
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
      {!hasMore && <p className="text-center text-gray-500 mt-4">No more products to load</p>}
    </div>
  );
}
