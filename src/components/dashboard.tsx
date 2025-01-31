import { createClient } from "@/utils/supabase/server";
import React from "react";
import Image from "next/image";

import {
  FaProductHunt,
  FaUserShield,
  FaBell,
  FaMoneyBillWave,
  FaClipboardList,
  FaFileAlt,
  FaCrown,
  FaImage,
} from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import { FaRegCreditCard } from "react-icons/fa6";
import LogoutButton from "./logoutButton";
import Logo from "./logo";
import LogoModel from "./logoModel";


const Dashboard = async () => {
  const supabase = await createClient();

  // get authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  // user kyc
  const { data: kyc, error: kycError } = await supabase
    .from("kyc")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // user profile products
  const { data: profile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  // fetch total product uploads
  const { count: totalUploads } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("id", user.id);

  const accountStatus = profile?.account_status;
  const subscriptionPlan = profile?.subscription_plan || "Free";
  const kycStatus = kyc?.kyc_status || "Pending";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-md p-4 rounded-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <LogoutButton />
      </header>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Product Uploads */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-md shadow-md flex items-center space-x-4">
          <FaProductHunt size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Total Uploads</h2>
            <p className="text-3xl font-bold mt-2">{totalUploads || 0}</p>
          </div>
        </div>

        {/* Account Status */}
        <div className={`p-6 rounded-md shadow-md flex items-center space-x-4 ${accountStatus === "Active"
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}>
          <FaUserShield size={40} className="text-white" />
          <div>
            <h2 className="text-lg font-semibold">Account Status</h2>
            <p className="text-3xl font-bold mt-2">{accountStatus}</p>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className={`p-6 rounded-md shadow-md flex flex-col space-y-4 ${subscriptionPlan === "Standard"
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            : subscriptionPlan === "Premium"
              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
          }`}>
          <div className="flex items-center space-x-4">
            <FaCrown size={40} className="text-yellow-300" />
            <h2 className="text-lg font-semibold">Subscription Plan</h2>
          </div>
          <p className="text-3xl font-bold">{subscriptionPlan}</p>
          <Link href="/dashboard/upgrade">
            <Button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-md shadow-md">Upgrade Plan</Button>
          </Link>
        </div>

        {/* KYC Status */}
        <div className={`p-6 rounded-md shadow-md flex flex-col space-y-4 ${kycStatus === "Pending"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
            : kycStatus === "Approved"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}>
          <div className="flex items-center space-x-4">
            <FaFileAlt size={40} className="text-white" />
            <h2 className="text-lg font-semibold">KYC Status</h2>
          </div>
          <p className="text-3xl font-bold">{kycStatus}</p>
          <div className="flex space-x-4">
            <Link href="/dashboard/kyc">
              <Button className="px-4 py-2 rounded-md shadow-md">
                <FaFileAlt size={20} className="inline mr-2" />
                Upload Documents
              </Button>
            </Link>
            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md shadow-md">View Details</button>
          </div>
        </div>

        {/* Logo Update Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-md shadow-md flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
           <Image src={profile.avater} alt="Logo" width={40} height={40} />
            <h2 className="text-lg font-semibold">Update Logo</h2>
          </div>
          <LogoModel  />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
