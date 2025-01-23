import React from 'react';
import Userdashboard from '@/components/userdashboard';
import Topbar from '@/components/topbar';
import ProductForm from '@/components/ProductForm';
import addProduct from '@/actions/auth/productsAdd';

export default function Product() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
   

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 overflow-y-auto">
        {/* Topbar */}
        <Userdashboard />
        <Topbar />
        
        {/* Add Product Form */}
        <ProductForm handler={addProduct} />
      </div>
    </div>
  );
}
