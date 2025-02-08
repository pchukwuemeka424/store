import { createClient } from "@/utils/supabase/server";
import React from "react";
import Image from "next/image";
import {
  FaProductHunt,
  FaUserShield,
  FaCrown,
  FaFileAlt,
  FaBoxOpen,
  FaPlusCircle,
} from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import LogoutButton from "./logoutButton";
import LogoModel from "./logoModel";
import ShopUrlDisplay from "./clipboard";
import BannerModel from "./bannerModel";

const Dashboard = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: kyc } = await supabase.from("kyc").select("*").eq("user_id", user.id).single();
  const { data: profile } = await supabase.from("user_profile").select("*").eq("id", user.id).single();
  const { count: totalUploads } = await supabase.from("products").select("*", { count: "exact" }).eq("id", user.id);
  const { data: siteData } = await supabase.from("site_info").select("*").single();

  const accountStatus = profile?.account_status;
  const subscriptionPlan = profile?.subscription_plan || "Free";
  const kycStatus = kyc?.kyc_status || "Pending";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow-md p-4 rounded-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <LogoutButton />
      </header>
      
      <ShopUrlDisplay siteData={siteData} profile={profile} />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-md shadow-md flex items-center space-x-4">
          <FaProductHunt size={40} />
          <div>
            <h2 className="text-lg font-semibold">Total Uploads</h2>
            <p className="text-3xl font-bold mt-2">{totalUploads || 0}</p>
          </div>
        </div>

        <div className={`p-6 rounded-md shadow-md flex items-center space-x-4 ${accountStatus === "Active" ? "bg-green-500" : "bg-red-500"} text-white`}>
          <FaUserShield size={40} />
          <div>
            <h2 className="text-lg font-semibold">Account Status</h2>
            <p className="text-3xl font-bold mt-2">{accountStatus}</p>
          </div>
        </div>

        <div className={`p-6 rounded-md shadow-md flex flex-col space-y-4 ${subscriptionPlan === "Premium" ? "bg-purple-500" : "bg-gray-500"} text-white`}>
          <div className="flex items-center space-x-4">
            <FaCrown size={40} className="text-yellow-300" />
            <h2 className="text-lg font-semibold">Subscription Plan</h2>
          </div>
          <p className="text-3xl font-bold">{subscriptionPlan}</p>
          <Link href="/dashboard/upgrade">
            <Button className="bg-yellow-400 text-gray-900">Upgrade Plan</Button>
          </Link>
        </div>

        <div className={`p-6 rounded-md shadow-md flex flex-col space-y-4 ${kycStatus === "Approved" ? "bg-green-500" : "bg-yellow-500"} text-white`}>
          <FaFileAlt size={40} />
          <h2 className="text-lg font-semibold">KYC Status</h2>
          <p className="text-3xl font-bold">{kycStatus}</p>
          {kycStatus === "Pending" && (
            <Link href="/dashboard/kyc">
              <Button className="bg-yellow-400 text-gray-900">Update KYC</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 text-white p-6 rounded-md shadow-md flex flex-col space-y-4">
          <Image src={profile.avater} alt="Logo" width={40} height={40} />
          <h2 className="text-lg font-semibold">Change Logo</h2>
          <LogoModel />
        </div>
        <div className="bg-gray-800 text-white p-6 rounded-md shadow-md flex flex-col space-y-4">
          <Image src={profile.banner} alt="Banner" width={100} height={60} />
          <h2 className="text-lg font-semibold">Change Banner</h2>
          <BannerModel />
        </div>
        <div className="bg-blue-600 text-white p-6 rounded-md shadow-md flex flex-col items-center space-y-4">
          <FaPlusCircle size={40} />
          <h2 className="text-lg font-semibold">Add New Product</h2>
          <Link href="/dashboard/addproduct">
            <Button className="bg-white text-blue-600">Add Product</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;