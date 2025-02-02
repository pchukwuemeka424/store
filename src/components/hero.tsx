"use client";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBox, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { search } from "@/actions/auth/search";
import Link from "next/link";
import { nigeriaStates } from "./states";

export default function Navbar() {
  return (
    <>
      <section
        className="h-screen relative flex flex-col justify-center items-center bg-cover bg-center 
        bg-[url('https://scholarmedia.africa/wp-content/uploads/2023/03/A-woman-trader-e1680190679909.jpg')]"
      >
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
                className="w-full sm:max-w-md px-4 py-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* Location Select with Icon */}
              <div className="relative w-full sm:w-36">
                <select
                  name="state"
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                >
                  <option value="">Select Location</option>
                  {nigeriaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {/* Location Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 text-white px-6 py-4 rounded-md sm:rounded-r-md hover:bg-blue-600 transition flex items-center justify-center"
              >
                <AiOutlineSearch className="w-6 h-6 mr-2" />
                Search
              </button>
            </form>

            <div className="flex justify-center items-center gap-4 mt-6">
              {/* Online Vendors Box */}
              <div className="h-28 w-28 sm:h-28 sm:w-28 bg-blue-500 flex flex-col items-center justify-center rounded-md shadow-md text-white">
                <Link href="/vendor">
                  <div className="flex flex-col items-center justify-center">
                    <FaBox size={40} />
                    <span className="mt-2">Vendors</span>
                  </div>
                </Link>
              </div>

              {/* Products Box */}
              <div className="h-28 w-28 sm:h-28 sm:w-28 bg-green-500 flex flex-col items-center justify-center rounded-md shadow-md text-white">
                <Link href="/product">
                  <div className="flex flex-col items-center justify-center">
                    <FaShoppingCart size={40} />
                    <span className="mt-2">Products</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
