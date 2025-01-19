"use client";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { search } from "@/actions/auth/search";
import Link from "next/link";
import { FaBox, FaShoppingCart, FaSignInAlt, FaTags, FaUserPlus } from "react-icons/fa";

export default function Navbar() {
  return (
    <section className="h-screen relative flex flex-col justify-center items-center bg-cover bg-center 
    bg-[url('https://scholarmedia.africa/wp-content/uploads/2023/03/A-woman-trader-e1680190679909.jpg')]">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-blue-900 bg-opacity-80"></div>

      {/* Content Container */}
      <div className="relative container mx-auto text-center px-4">
        {/* Hero Content */}
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
          Find What You&apos;re Looking For
        </h1>
        <p className="text-gray-200 mb-8 md:w-2/4 w-full mx-auto">
          Discover products, connect with vendors, and access detailed information across our platform for seamless browsing, purchasing, and partnership opportunities.
        </p>

        {/* Search Bar */}
        <div>
          <form action={search} className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0">
            <input
              required
              type="text"
              name="search"
              placeholder="Search here..."
              className="w-full sm:max-w-md px-4 py-4 border border-gray-300 rounded-md sm:rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md sm:rounded-r-md hover:bg-blue-600 transition flex items-center justify-center"
            >
              <AiOutlineSearch className="w-6 h-6 mr-2" />
              Search
            </button>
          </form>



          <div className="flex justify-center items-center gap-4 mt-6">
            {/* Online Vendors Box */}
            <div className="h-28 w-28 sm:h-28 sm:w-28 bg-blue-500 flex flex-col items-center justify-center rounded-md shadow-md text-white">
             <Link href="/vendor">
             <FaBox size={40} />
             <span className="mt-2">Vendors</span>
             </Link>
            </div>

            {/* Products Box */}
            <div className="h-28 w-28 sm:h-28 sm:w-28 bg-green-500 flex flex-col items-center justify-center rounded-md shadow-md text-white">
             <Link href="/product">
             <FaShoppingCart size={40} />
             <span className="mt-2">Products</span>
             </Link>
            </div>
          </div>



        </div>
      </div>
    </section>
  );
}
