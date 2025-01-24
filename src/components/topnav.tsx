'use client';
import { FaSearch, FaUser } from 'react-icons/fa';  // Importing React Icons
import { search } from '@/actions/auth/search';
import React from 'react';
import Image from 'next/image';
import { SheetMenu } from './sheetMenu';

export default function TopNav() {
  return (
    <>
      {/* Mobile Menu */}
      <div className="border-b border-gray-200 flex justify-between items-center py-4 mx-auto max-w-7xl md:hidden">
        {/* Left: SheetMenu */}
        <div className="flex items-center space-x-4">
          <SheetMenu />
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/public/cc.png"
            alt="Logo"
            className="w-40 h-14 sm:w-25 md:w-25"
            width={100}
            height={100}
          />
        </div>

        {/* Right: Login Button */}
        <div>
          <button
            className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2"
          >
            <FaUser /> {/* Login Icon */}
           
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (visible only on small screens) */}
      <div className="w-full md:hidden px-4 my-2">
        <form action={search}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              
            </div>
            <input
              name="search"
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Mockups, Logos..."
              required
            />
            <button
              type="submit"
              className="text-dark absolute right-2.5 bottom-2.5 bg-none focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              <FaSearch className="w-4 h-4" /> {/* Search Icon on Button */}
            </button>
          </div>
        </form>
      </div>

      {/* Desktop Menu (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center py-4 mx-auto max-w-7xl">
        {/* Left: Logo and SheetMenu */}
        <div className="flex items-center space-x-4">
          <SheetMenu />
          <Image
            src="https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos/public/cc.png"
            alt="Logo"
            className="w-40 h-14 sm:w-25 md:w-25"
            width={100}
            height={100}
          />
        </div>

        {/* Middle: Search Bar */}
        <div className="w-full md:w-[70%] ">
          <form action={search}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               
              </div>
              <input
                name="search"
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Mockups, Logos..."
                required
              />
              <button
                type="submit"
                className="text-dark absolute right-2.5 bottom-2.5 bg-none focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2"
              >
                <FaSearch className="w-4 h-4" /> {/* Search Icon on Button */}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Login Button */}
        <div>
          <button
            className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            <FaUser className="mr-2" /> {/* Login Icon */}
            Login
          </button>
        </div>
      </div>
    </>
  );
}
