import React from 'react';
import FetchSingleProduct from './fetchSingle';


// Page Component
export default async function Page() {
  return (
    <div className="mx-auto max-w-7xl">
      <FetchSingleProduct />
    </div >
  );
}

