import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';

export default function ProductFetch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const isFetching = useRef(false);

  const fetchProducts = useCallback(async (page) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const { data, error } = await supabaseDb
        .from('user_profile')
        .select('*')
        .order('shopname', { ascending: true }) // Sort alphabetically by shopname
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
    <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product, index) => (
        <Link href={`/store/${product.username}`} key={index} passHref>
          <Card className="hover:shadow-lg transition flex align-items-center">
            <CardHeader className="p-0 flex align-items-center">
              <Image
                src={product.avater || `https://placehold.co/200?text=${product.shopname.slice(0, 2).toUpperCase()}`}
                alt={product.avater || `Product ${index + 1}`}
                className="w-40 h-40 object-cover rounded mb-4 shadow-md"
                width={500}
                height={500}
              />
            </CardHeader>
            <div className="mx-3 flex items-center justify-center">
              <div>
                <div className="font-semibold uppercase">{product.shopname}</div>
                <div className="text-sm capitalize">{product.stat}, {product.city}</div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
      {loading && <p>Loading more products...</p>}
    </div>
  );
}
