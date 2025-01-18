"use client";
import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { search } from '@/actions/auth/search';
import Link from 'next/link';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Navbar() {
  return (
    <section className="h-screen relative flex flex-col justify-center items-center bg-cover bg-center md:bg-[url('https://scholarmedia.africa/wp-content/uploads/2023/03/A-woman-trader-e1680190679909.jpg')]">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>

      {/* Content Container */}
      <div className="relative container mx-auto text-center px-4">
        {/* Hero Content */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Find What You&apos;re Looking For
        </h1>
        <p className="text-gray-200 mb-8 md:w-2/4 s:w-full mx-auto">
          Discover products, connect with vendors, and access detailed information across our platform for seamless browsing, purchasing, and partnership opportunities.
        </p>

        {/* Search Bar */}
        <div>
          <form action={search} className="flex justify-center items-center">
            <input required
              type="text"
              name="search"
              placeholder="Search here..."
              className="w-full max-w-md px-4 py-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-4 rounded-r-md hover:bg-blue-600 transition flex items-center"
            >
              <AiOutlineSearch className="w-6 h-6 mr-2" />
              Search
            </button>
          </form>
         
          <div>
            <div className="flex space-x-4 justify-center my-3">
              <Link href="/login" className="text-white hover:text-gray-300 transition">
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  <FaSignInAlt className="mr-2" /> Login
                </button>
              </Link>
              {/* Register Button */}
              <Link href="/register" className="text-white hover:text-gray-300 transition">
                <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                  <FaUserPlus className="mr-2" /> Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
