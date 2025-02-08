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

  const accountStatus = profile?.account_status || "Inactive";
  const subscriptionPlan = profile?.subscription_plan || "Free";
  const kycStatus = kyc?.kyc_status || "Pending";

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-8">
      <header className="bg-white shadow-lg p-6 rounded-xl flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <LogoutButton />
      </header>
      
      <ShopUrlDisplay siteData={siteData} profile={profile} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <DashboardCard icon={<FaProductHunt size={40} />} title="Total Uploads" value={totalUploads || 0} color="bg-blue-500" />
        <DashboardCard icon={<FaUserShield size={40} />} title="Account Status" value={accountStatus} color={accountStatus === "Active" ? "bg-green-500" : "bg-red-500"} />
        <DashboardCard icon={<FaCrown size={40} className="text-yellow-300" />} title="Subscription Plan" value={subscriptionPlan} color={subscriptionPlan === "Premium" ? "bg-purple-500" : "bg-gray-500"} link="/dashboard/upgrade" linkText="Upgrade Plan" />
        <DashboardCard 
  icon={<FaFileAlt size={40} />} 
  title="KYC Status" 
  value={kycStatus} 
  color={kycStatus === "Approved" ? "bg-green-500" : kycStatus === "Rejected" ? "bg-red-500" : "bg-yellow-500"} 
  link={kycStatus === "Pending" || kycStatus === "Rejected" ? "/dashboard/kyc" : null} 
  linkText={kycStatus === "Rejected" ? "Resubmit KYC" : "Update KYC"} 
/>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardImageCard image={profile?.avater} title="Change Logo" component={<LogoModel />} />
        <DashboardImageCard image={profile?.banner} title="Change Banner" component={<BannerModel />} />
        <DashboardActionCard icon={<FaPlusCircle size={40} />} title="Add New Product" link="/dashboard/addproduct" linkText="Add Product" />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value, color, link, linkText }) => (
  <div className={`${color} text-white p-6 rounded-xl shadow-lg flex flex-col space-y-4 animate-fade-in`}> 
    <div className="flex items-center space-x-4">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <p className="text-3xl font-bold">{value}</p>
    {link && (
      <Link href={link}>
        <Button className="bg-yellow-400 text-gray-900 mt-2">{linkText}</Button>
      </Link>
    )}
  </div>
);

const DashboardImageCard = ({ image, title, component }) => (
  <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg flex flex-col space-y-4 items-center animate-fade-in">
    <Image src={image} alt={title} width={100} height={60} className="rounded-md" />
    <h2 className="text-lg font-semibold">{title}</h2>
    {component}
  </div>
);

const DashboardActionCard = ({ icon, title, link, linkText }) => (
  <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 animate-fade-in">
    {icon}
    <h2 className="text-lg font-semibold">{title}</h2>
    <Link href={link}>
      <Button className="bg-white text-blue-600">{linkText}</Button>
    </Link>
  </div>
);

export default Dashboard;