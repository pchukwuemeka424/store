import React from 'react'
import { FaBell, FaUserAlt } from 'react-icons/fa'; // Importing icons
import Link from 'next/link'
import { Button } from './ui/button';
export default function topbar() {
  return (
    <div className="col-span-full ">
   
      <div className="flex items-center space-x-4 flex justify-end" >
        <Link href="/dashboard/addProduct">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            <FaBell className="inline mr-2" /> Notifications
          </button>
        </Link>
        <Link href="/dashboard/profile">
          <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded">
            <FaUserAlt className="inline mr-2" /> Profile
          </button>
        </Link>
      </div>
    </div>
  )
}
