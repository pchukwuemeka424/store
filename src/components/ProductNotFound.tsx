import React from 'react';
// Import the icon you want to use
import { FaShopLock } from 'react-icons/fa6';

const ProductNotFound = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <FaShopLock size={48} color="gray" /> {/* Display the empty shop icon */}
    </div>
  );
};

export default ProductNotFound;
