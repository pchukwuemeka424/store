"use client";
import React from 'react';
import { nigeriaStates } from './states';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { redirect } from 'next/navigation';
import { FaTv, FaTshirt, FaHome, FaDumbbell, FaPaw, FaGem, FaBaby, FaGamepad, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

export default function ProductCategories() {

  return (
    <div className="hidden sm:block col-span-3 bg-white p-4 rounded shadow">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Product
          </label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Enter product name"
            className="w-full px-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Select name="state">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {nigeriaStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>
      </form>
      {/* Product Categories */}
      <h2 className="text-lg font-bold mb-4">Product Categories</h2>

      <ul className="space-y-2 my-3 border-b shadow">
  <Link href="/products/electronics">
    <li className="cursor-pointer border-b p-2"><FaTv className="inline mr-2"/>Electronics</li>
  </Link>
  <Link href="/products/clothing">
    <li className="cursor-pointer border-b p-2"><FaTshirt className="inline mr-2"/>Clothing</li>
  </Link>
  <Link href="/products/home-appliances">
    <li className="cursor-pointer border-b p-2"><FaHome className="inline mr-2"/>Home Appliances</li>
  </Link>

  <Link href="/products/sports">
    <li className="cursor-pointer border-b p-2"><FaDumbbell className="inline mr-2"/>Sports</li>
  </Link>
  <Link href="/products/toys">
    <li className="cursor-pointer border-b p-2"><FaPaw className="inline mr-2"/>Toys</li>
  </Link>
  <Link href="/products/beauty">
    <li className="cursor-pointer border-b p-2"><FaGem className="inline mr-2"/>Beauty</li>
  </Link>

  <Link href="/products/jewelry">
    <li className="cursor-pointer border-b p-2"><FaGem className="inline mr-2"/>Jewelry</li>
  </Link>


  <Link href="/products/baby-products">
    <li className="cursor-pointer border-b p-2"><FaBaby className="inline mr-2"/>Baby Products</li>
  </Link>
  <Link href="/products/pet-supplies">
    <li className="cursor-pointer border-b p-2"><FaPaw className="inline mr-2"/>Pet Supplies</li>
  </Link>


  <Link href="/products/video-games">
    <li className="cursor-pointer border-b p-2"><FaGamepad className="inline mr-2"/>Video Games</li>
  </Link>
  <Link href="/products/health-beauty">
    <li className="cursor-pointer border-b p-2"><FaHeart className="inline mr-2"/>Health & Beauty</li>
  </Link>
 


      </ul>
    </div>
  );
}
