import { createClient } from "@/utils/supabase/server";
import React from "react";
import {
  FaProductHunt,
  FaUserShield,
  FaBell,
  FaMoneyBillWave,
  FaClipboardList,
  FaFileAlt,
} from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";



const Dashboard = async () => {

  const supabase = await createClient();

  // get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // user kyc
  const { data: kyc, error: kycError } = await supabase
    .from("kyc")
    .select("*")
    .eq("userid", user.id)
    .single();
  
    // user doesnt exit in table 
    if(kycError){
      console.log("Error fetching kyc:");
    }

      // user profile products
  const { data: profile, error } = await supabase
  .from("user_profile")
  .select("*")
  .eq("id", user.id)
  .single();

  // fetch total product uploads
  const { count: totalUploads, error: totalUploadsError } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("id", user.id);

  const accountStatus = profile?.account_status;
  const notifications = [
    "New product added.",
    "Password changed successfully.",
    "Subscription renewed.",
  ];
  const revenue = "$12,450"; // Example data
  const pendingOrders = 34; // Example data
  const kycStatus = kyc?.kyc_status || "Pending"; // Example data

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-md p-4 rounded-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Product Uploads */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-md shadow-md flex items-center space-x-4">
          <FaProductHunt size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Total Uploads</h2>
            <p className="text-3xl font-bold mt-2">{totalUploads || 0}</p>
          </div>
        </div>

        {/* Account Status */}
        <div
          className={`p-6 rounded-md shadow-md flex items-center space-x-4 ${
            accountStatus === "Active"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}
        >
          <FaUserShield size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Account Status</h2>
            <p className="text-3xl font-bold mt-2">{accountStatus}</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-md shadow-md">
          <div className="flex items-center space-x-4">
            <FaBell size={40} className="text-white" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {notifications.map((note, index) => (
              <li
                key={index}
                className="bg-white text-gray-800 px-4 py-2 rounded-md"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Revenue Overview */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-md shadow-md flex items-center space-x-4">
          <FaMoneyBillWave size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="text-3xl font-bold mt-2">{revenue}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-md shadow-md flex items-center space-x-4">
          <FaClipboardList size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Pending Orders</h2>
            <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
          </div>
        </div>

        {/* KYC Status */}
        <div
          className={`p-6 rounded-md shadow-md flex flex-col space-y-4 ${
            kycStatus === "Pending"
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
              : kycStatus === "Approved"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}
        >
          <div className="flex items-center space-x-4">
            <FaFileAlt size={40} className="text-white" />
            <h2 className="text-lg font-semibold">KYC Status</h2>
          </div>
          <p className="text-3xl font-bold">{kycStatus}</p>
          <div className="flex space-x-4">

          <Link href="/dashboard/kyc">
            <Button className="px-4 py-2 rounded-md shadow-md">
              {/* add icon */}
              <FaFileAlt size={20} className="inline mr-2" />
              Upload Documents
            </Button>
          </Link>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md shadow-md">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
