import React from "react";
import { FaProductHunt, FaUserShield, FaBell, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import Topbar from "./topbar";
import { User } from "lucide-react";
import UserDashboard from "./userdashboard";

const Dashboard = () => {
  const totalUploads = 245; // Example data
  const accountStatus = "Active"; // Example data
  const notifications = [
    "New product added.",
    "Password changed successfully.",
    "Subscription renewed.",
  ];
  const revenue = "$12,450"; // Example data
  const pendingOrders = 34; // Example data

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <UserDashboard />
        
     <Topbar />
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
            <p className="text-3xl font-bold mt-2">{totalUploads}</p>
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
      </div>
    </div>
  );
};

export default Dashboard;
