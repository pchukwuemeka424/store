"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <a href="#" className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all">
            Home
          </a>
          <a href="#" className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all">
            Profile
          </a>
          <a href="#" className="block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all">
            Settings
          </a>
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
