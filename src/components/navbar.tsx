"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import LogoutButton from './logoutButton';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { FaL } from 'react-icons/fa6';
import { FaLock } from 'react-icons/fa';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const supabase = createClient(); // Initialize once

    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    async function fetchLogo() {
      const { data, error } = await supabase
        .from('site_info')
        .select("logo")
        .single();

      if (error) console.error("Error fetching logo:", error);
      else setLogo(data?.logo);
    }

    fetchUser();
    fetchLogo();
  }, []);

  return (
    <div className="mx-auto max-w-7xl absolute top-0 left-0 right-0 z-50">
      <nav className="w-full">
        <div className="flex items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            {logo && (
           <Link href="/">
             <Image 
            src={logo} 
            alt="Logo" 
            className="w-24 h-30 sm:w-56 sm:h-20 object-contain" 
            width={340} 
            height={30} 
          /></Link>
            )}
            
          </div>

          {/* Spacer to push items to the right */}
          <div className="flex-grow"></div>

          {/* Navigation Links */}
          {user ? (
            <div className="flex space-x-6">
              <Link href="/dashboard" className="text-white hover:text-gray-300 transition">
                Dashboard 
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex flex-row gap-4 justify-center">
              <Link href="/register" className="text-white hover:text-gray-300 transition">
                <button className="flex items-center px-4 py-2  bg-rose-700 text-white rounded-md hover:bg-orange-600 transition justify-center whitespace-nowrap">
                  <ShoppingCart className="mr-2" /> Create Store
                </button>
              </Link>

              <Link href="/login" className="text-white hover:text-gray-300 transition">
                <button className="flex items-center px-4 py-2 bg-amber-50 text-black rounded-md justify-center">
                 <FaLock className="mr-2" />
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
