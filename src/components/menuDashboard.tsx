import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { LuList } from "react-icons/lu";
import { FaTv, FaTshirt, FaHome, FaDumbbell, FaPaw, FaGem, FaBaby, FaGamepad, FaHeart, FaCog, FaLock, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import categoryList from "@/components/category";
import Logout from "@/actions/auth/logout";

export function MenuDashboard() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="m-2 text-3xl" variant="outline"><LuList size={30} /></Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Products Categories</SheetTitle>
        </SheetHeader>
        <ul>
          <li className="mb-4 flex items-center">
            <FaHome className="h-5 w-5 mr-2" />
            <Link href="/dashboard/" className="text-white">Dashboard</Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaTv className="h-5 w-5 mr-2" />
            <Link href="/dashboard/addproduct" className="hover:bg-gray-700 p-2 rounded">Add Products</Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaCog className="h-5 w-5 mr-2" />
            <Link href="/dashboard/productlist" className="hover:bg-gray-700 p-2 rounded">Manage Products</Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaCog className="h-5 w-5 mr-2" />
            <Link href="#" className="hover:bg-gray-700 p-2 rounded">Settings</Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaLock className="h-5 w-5 mr-2" />
            <Link href="#" className="hover:bg-gray-700 p-2 rounded">Security</Link>
          </li>
          <li className="mb-4 flex items-center">
            <FaUserCircle className="h-5 w-5 mr-2" />
            <Link href="#" className="hover:bg-gray-700 p-2 rounded">Kyc</Link>
          </li>
          
            <FaSignOutAlt className="h-5 w-5 mr-2" />
            <Button onClick={Logout} className="hover:bg-gray-700 p-2 rounded">Logout</Button>
          
        </ul>
      </SheetContent>
    </Sheet>
  )
}
