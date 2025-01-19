import supabaseDb from '@/utils/supabase-db';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import CategoryList from '@/components/category';
import ContactButtons from '@/components/contactButton';
import Spinner from '@/components/spinner';
export default function ProductFetch({ }) {
  // const [loading, setLoading] = useState(true);
  const [shopDetails, setShopDetails] = useState(null);
  const { store } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabaseDb
          .from('user_profile')
          .select(`*,
            products(*)
          `)
          .eq('username', store)
          .single();

        if (error) throw error;

        setShopDetails(data);
      } catch (error) {
        console.log('Error fetching products:', error.message);
      } 
    };

    fetchProducts();
  }, [store]);

  // if (loading) {
  //   return <Spinner />;
  // }

  if (!shopDetails?.products || shopDetails.products.length === 0) {
    return <Spinner />;
  }

  return (
    <div>
      <div
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/sign/web_images/bg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWJfaW1hZ2VzL2JnLmpwZyIsImlhdCI6MTczNjQzNjEzOCwiZXhwIjoyMDUxNzk2MTM4fQ.d0S0B714IYris2YO8zcNgfacVOeMOKTn4LJZPM009gQ')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* Content */}
        <div className="relative h-40 flex justify-between items-center p-4 border-b mx-auto max-w-7xl">
          <Image
            src={shopDetails.avater}
            alt={shopDetails.shopname || `Shop Name`}
            className="h-20 object-cover rounded mb-4"
            width={100}
            height={100}
          />

          <ContactButtons shopDetails={shopDetails} />
        </div>
      </div>


      <div className="grid grid-cols-12 gap-4 p-4 mx-auto max-w-7xl">
        <CategoryList />

        <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {shopDetails.products.map((product, index) => (
            <Link href={`/product/${product.user_id}`} key={product.user_id || index} passHref>
              <Card className="hover:shadow-lg transition">
                <CardHeader className="p-0">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.title || `Product ${index + 1}`}
                    className="w-full h-40 object-cover rounded mb-4"
                    width={500}
                    height={500}
                  />
                </CardHeader>
                <div className="px-4">
                  <CardTitle className="text-sm font-bold">{product.title}</CardTitle>

                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-gray-600">
                      {shopDetails.city || 'Store Location'}, {shopDetails.stat || 'City'}
                    </div>
                    <div className="text-sm font-semibold text-green-500">
                      ₦{product.price}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
