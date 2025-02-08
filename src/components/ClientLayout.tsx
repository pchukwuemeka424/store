"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {  Menu, X } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { FaHome, FaCog, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { useActionState } from "react";
import logout from "@/actions/auth/logout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [state, action, isPending] = useActionState(logout, undefined, null);
    const supabase = createClient();
    const [categorys, setcategorys] = useState([]);
    


  return (
    <div className="flex h-screen bg-gradient-to-br">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 text-white transform transition-transform md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-500 md:hidden">
          <span className="text-lg font-semibold text-white">Dashboard</span>
          <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-white hover:text-gray-200" />
          </Button>
        </div>
        <nav className="p-6 space-y-4 text-white">
             <ul>
          <li className="mb-4 flex items-center">
            <FaHome className="h-5 w-5 mr-2" />
            <Link href="/dashboard/" className="hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaPlus className="h-5 w-5 mr-2" />
            <Link href="/dashboard/addproduct" className="hover:bg-gray-700 p-2 rounded">
              Add Products
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaCog className="h-5 w-5 mr-2" />
            <Link href="/dashboard/productlist" className="hover:bg-gray-700 p-2 rounded">
              Manage Products
            </Link>
          </li>
          
       
          <li className="mb-4 flex items-center">
            <FaUserCircle className="h-5 w-5 mr-2" />
            <Link href="/dashboard/profile" className="hover:bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaSignOutAlt className="h-5 w-5 mr-2" />
            <form action={action}>
              <Button
                type="submit"
                className="p-2 rounded"
                disabled={isPending} // Disable button while logout is running
              >
                {isPending ? "Logging out..." : " Logout"}
              </Button>
             
            </form>
          </li>
        </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-blue-700 shadow-md md:hidden">
          <Button variant="ghost" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-white hover:text-gray-200" />
          </Button>
          <span className="text-lg font-semibold text-white">Dashboard</span>
        </header>
        <main className="flex-1 p-6 bg-white rounded-xl shadow-md m-4 text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
