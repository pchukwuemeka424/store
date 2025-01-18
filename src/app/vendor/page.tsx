'use client';

import React from 'react';
import CategoryList from '@/components/category';
import VendorFetch from './vendorFetch';


export default function Page() {

  return (
    <div>
      {/* <Slider /> */}
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Sidebar for product categories */}

        <CategoryList />

        {/* Product list */}
       <VendorFetch />
      </div>
    </div>
  );
}
