import { FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa'; // Importing location and shopping cart icons
import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';

const getRandomColor = (name) => {
  const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-purple-200'];
  const index = name.charCodeAt(0) % colors.length; // Ensures consistent color based on shopname
  return colors[index];
};

export default function ProductFetch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);  // State to track if there are more products
  const isFetching = useRef(false);

  const fetchProducts = useCallback(async (page) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const { data, error } = await supabaseDb
        .from('user_profile')
        .select('*')
        .order('shopname', { ascending: true })
        .range((page - 1) * 10, page * 10 - 1);

      if (error) throw error;

      // Check if there is more data to load
      setHasMore(data.length === 10);

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
      if (hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [hasMore]);

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
    <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <Link href={`/store/${product.username}`} key={index} passHref>
          <Card className="flex items-center p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <div className="flex items-center justify-start space-x-4">
              <div className={`${getRandomColor(product.shopname)} w-16 h-16 rounded-full flex items-center justify-center`}>
                <span className="text-xl font-semibold text-white">
                  {product.shopname.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-bold text-xl text-gray-800">{product.shopname}</div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <span className="capitalize">{product.stat}, {product.city}</span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center justify-center">
              <FaShoppingCart size={20} className="text-gray-600 hover:text-gray-800" />
            </div>
          </Card>
        </Link>
      ))}
      {loading && <p className="text-center">Loading more products...</p>}
      {!hasMore && !loading && <p className="text-center text-gray-600">No more images</p>}
    </div>
  );
}
