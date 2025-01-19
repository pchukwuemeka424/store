'use client';

import CategoryList from '@/components/category';
import FetchCat from './fetchCat';

import React from 'react'

export default function Page() {
  return (
    <div>
            <div className="grid grid-cols-12 gap-4 p-4">
        {/* Sidebar for product categories */}

        <CategoryList />

        {/* Product list */}
        <FetchCat />
      </div>
    </div>
  )
}
