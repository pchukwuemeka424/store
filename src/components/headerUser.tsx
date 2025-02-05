"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaHome } from "react-icons/fa";

export default function Header({shopDetails}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl h-32 mx-auto flex items-center justify-between p-4">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <Image src={shopDetails.avater} alt="Logo" className="w-20 h-20" width={100} height={100} />
          <h1 className="text-2xl font-bold text-gray-800">{shopDetails.shopname}</h1>
        </div>
   
        <Link href={`/store/${shopDetails.username}`} className="block text-gray-700 hover:text-blue-600 transition font-medium"><Button><FaHome className="mr-2" /></Button></Link>
        <Link href={`/store/contact/${shopDetails.username}`} className="block text-gray-700 hover:text-blue-600 transition font-medium"><Button>Contact Us</Button></Link>
        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href={`/store/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">Home</Link>
          <Link href={`/store/contact/${shopDetails.username}`} className="text-gray-700 hover:text-blue-600 transition font-medium">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 space-y-4">
          <Link href={`/store/${shopDetails.username}`}className="block text-gray-700 hover:text-blue-600 transition font-medium">Home</Link>
          <Link href={`/store/contact/${shopDetails.username}`} className="block text-gray-700 hover:text-blue-600 transition font-medium">Contact Us</Link>
        </div>
      )}
    </header>
  );
}
