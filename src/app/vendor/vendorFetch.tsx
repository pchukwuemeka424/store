import { FaShoppingCart, FaMapMarkerAlt, FaStar } from 'react-icons/fa'; // Importing location, shopping cart, and star icons
import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import ProductNotFound from '@/components/ProductNotFound';
import Image from 'next/image';

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

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = Math.ceil(rating - fullStars);
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {[...Array(halfStars)].map((_, i) => (
          <FaStar key={`half-${i}`} className="text-yellow-200" />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </div>
    );
  };

  if (loading && page === 1) {
    return <p>Loading products...</p>;
  }

  if (products.length === 0 && !loading) {
    return <ProductNotFound />;
  }

  return (
    <>
      <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 sm:col-span-3 grid grid-cols-1 p-4 bg-orange-50">
          <h2 className="text-2xl font-semibold mb-4">All Vendors</h2>
          <p className="text-gray-600">Find your desired stores and shop your favourite products</p>
        </div>
        {products.map((product, index) => (
          <Link href={`/store/${product.username}`} key={index} passHref>
            <Card className="shadow-lg rounded-lg transition-transform transform hover:scale-105">
              <div>
                <Image
                  src={product.banner}
                  alt={product.shopname}
                  width={200}
                  height={200}
                  className="w-full h-28 mb-3 sm:h-28 object-fill rounded-lg"
                />
              </div>
              <div className="flex items-center justify-start space-x-4 p-2">
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
                  <div className="mt-2">
                    {/* Ensure rating is 0.0 if undefined */}
                    {renderStars(product.rating || 0.0)} {/* Render 0.0 stars if no rating */}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {loading && <p className="text-center">Loading more products...</p>}
        {!hasMore && !loading && <p className="text-center text-gray-600">No more images</p>}
      </div>
    </>
  );
}
