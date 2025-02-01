"use client";
import { FaSearch, FaUser } from 'react-icons/fa';
import { search } from '@/actions/auth/search';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SheetMenu } from './sheetMenu';
import Link from 'next/link';
import { Button } from './ui/button';
import LogoutButton from './logoutButton';
import { createClient } from '@/utils/supabase/client';

export default function TopNav() {
  const [user, setUser] = useState(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    async function fetchLogo() {
      const { data, error } = await supabase
        .from('site_info')
        .select("logo")
        .single();

      if (error) {
        console.error("Error fetching logo:", error);
        setLogo("/default-logo.png");
      } else {
        setLogo(data?.logo || "/default-logo.png");
      }
    }

    fetchUser();
    fetchLogo();
  }, []);

  return (
    <>
      {/* Mobile Menu with Search Bar */}
      <div className="border-b border-gray-200 flex justify-between items-center py-4 mx-auto max-w-7xl md:hidden">
        {/* Left: SheetMenu */}
        <div className="flex items-center space-x-4">
          <SheetMenu />
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src={logo || "/default-logo.png"}
            alt="Logo"
            className="w-32 h-10"
            width={100}
            height={100}
          />
        </div>

        {/* Right: Login Button */}
        <div>
          {!user ? (
            <Link href="/login">
              <Button className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2">
                <FaUser className="mr-2" /> Login
              </Button>
            </Link>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2">
        <form action={search} className="relative">
          <input
            name="search"
            type="search"
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            required
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center py-4 mx-auto max-w-7xl">
        {/* Left: Logo and SheetMenu */}
        <div className="flex items-center space-x-4">
          <SheetMenu />
          <Image
            src={logo || "/default-logo.png"}
            alt="Logo"
            className="w-40 h-14"
            width={100}
            height={100}
          />
        </div>

        {/* Middle: Search Bar */}
        <div className="w-full md:w-[70%] border">
          <form action={search}>
            <div className="relative">
              <input
                name="search"
                type="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                className="text-dark absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2"
              >
                <FaSearch className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Login Button */}
        <div>
          {!user ? (
            <Link href="/login">
              <Button className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2">
                <FaUser className="mr-2" /> Login
              </Button>
            </Link>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </>
  );
}