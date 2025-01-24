import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/spinner';
import { FiSearch } from 'react-icons/fi'; // You can use any other icon

export default function SearchProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); // Added state for not found message
  const [page, setPage] = useState(1);
  const search = useSearchParams().get('q');

  const fetchProducts = useCallback(async (page, search) => {
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
        .range((page - 1) * 10, page * 10 - 1); // Adjust range to fetch in chunks of 10

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data.length === 0 && page === 1) {
        setNotFound(true); // Show not found message if no products and first page
      } else {
        setNotFound(false); // Hide not found message if products found
      }

      setProducts((prevProducts) => {
        const newProducts = data.filter((product) =>
          !prevProducts.some((prevProduct) => prevProduct.id === product.id)
        );
        return [...prevProducts, ...newProducts];
      });
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    fetchProducts(1, search);
  }, [search, fetchProducts]);

  useEffect(() => {
    fetchProducts(page, search);
  }, [page, search, fetchProducts]);

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
    return (
      <div className="w-full flex justify-center items-center p-8">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="animate-pulse w-full max-w-sm">
            <div className="h-40 sm:h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notFound && !loading) {
    return (
<div className="w-full flex justify-center items-center flex-col p-8 absolute">
  <FiSearch size={48} className="text-gray-500 mb-4" />
  <p className="text-lg font-semibold text-gray-700 text-center w-full">No products found</p>
  <p className="text-sm text-gray-500 text-center w-full">Try searching for something else</p>
</div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
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
