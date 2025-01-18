'use client';

import React from 'react';
import CategoryList from '@/components/category';
import ProductFetch from './productFetch';



export default function Page() {

  return (
    <div>
    
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Sidebar for product categories */}

        <CategoryList />

        {/* Product list */}
        <ProductFetch />
      </div>
    </div>
  );
}
