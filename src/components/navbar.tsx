"use client";
import React from 'react';
import Link from 'next/link';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import desired icons
import { createClient } from '@/utils/supabase/client';
import LogoutButton from './logoutButton';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    async function fetchUser() {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="mx-auto max-w-7xl absolute top-0 left-0 right-0 z-50">
      <nav className="w-full">
        <div className="flex items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
  <Image 
    src="https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/public/1736537418297-logog.png" 
    alt="Logo" 
    className="w-20 sm:w-25 md:w-36" 
    width={180} 
    height={100} 
  />
</div>

          {/* Spacer to push items to the right */}
          <div className="flex-grow"></div>

          {/* Navigation Links */}
          {user ? (
            <div className="flex space-x-6">
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition">
                Dashboard 
              </Link>
            
              {/* Logout Button */}
              <LogoutButton />
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center">
            <Link href="/register" className="text-white hover:text-gray-300 transition w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition justify-center whitespace-nowrap">
                <ShoppingCart className="mr-2" /> Create Store
              </button>
            </Link>
          
            <Link href="/login" className="text-white hover:text-gray-300 transition w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition justify-center">
                Login
              </button>
            </Link>
          </div>
          

          )}
        </div>
      </nav>
    </div>
  );
}
