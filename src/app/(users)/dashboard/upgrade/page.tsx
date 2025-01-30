"use client";
import React from "react";


const UpgradePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCrown size={50} className="text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold mt-4">Upgrade Your Plan</h2>
        <p className="text-gray-600 mt-2">
          Unlock premium features by upgrading to a Standard or Premium plan.
        </p>

        <div className="mt-6 space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Standard Plan</h3>
            <p className="text-sm">$10/month</p>
            <Button
              onClick={() => handlePayment(100)}
              className="mt-2 bg-white text-blue-500 hover:bg-gray-200"
            >
              Upgrade Now
            </Button>
          </div>

          <div className="bg-purple-600 text-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Premium Plan</h3>
            <p className="text-sm">$25/month</p>
            <Button
              onClick={() => handlePayment(250)}
              className="mt-2 bg-white text-purple-600 hover:bg-gray-200"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
