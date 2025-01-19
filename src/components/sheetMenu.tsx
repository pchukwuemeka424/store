import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { LuList } from "react-icons/lu";
import CategoryList from "@/components/category";
import { FaTv, FaTshirt, FaHome, FaDumbbell, FaPaw, FaGem, FaBaby, FaGamepad, FaHeart } from "react-icons/fa";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="m-2 text-3xl" variant="outline"><LuList size={30} /></Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Products Categories</SheetTitle>
  
        </SheetHeader>

        <ul className="space-y-2 my-3 border-b shadow">
          <Link href="/products/electronics">
            <li className="cursor-pointer border-b p-2"><FaTv className="inline mr-2" />Electronics</li>
          </Link>
          <Link href="/products/clothing">
            <li className="cursor-pointer border-b p-2"><FaTshirt className="inline mr-2" />Clothing</li>
          </Link>
          <Link href="/products/home-appliances">
            <li className="cursor-pointer border-b p-2"><FaHome className="inline mr-2" />Home Appliances</li>
          </Link>

          <Link href="/products/sports">
            <li className="cursor-pointer border-b p-2"><FaDumbbell className="inline mr-2" />Sports</li>
          </Link>
          <Link href="/products/toys">
            <li className="cursor-pointer border-b p-2"><FaPaw className="inline mr-2" />Toys</li>
          </Link>
          <Link href="/products/beauty">
            <li className="cursor-pointer border-b p-2"><FaGem className="inline mr-2" />Beauty</li>
          </Link>

          <Link href="/products/jewelry">
            <li className="cursor-pointer border-b p-2"><FaGem className="inline mr-2" />Jewelry</li>
          </Link>


          <Link href="/products/baby-products">
            <li className="cursor-pointer border-b p-2"><FaBaby className="inline mr-2" />Baby Products</li>
          </Link>
          <Link href="/products/pet-supplies">
            <li className="cursor-pointer border-b p-2"><FaPaw className="inline mr-2" />Pet Supplies</li>
          </Link>


          <Link href="/products/video-games">
            <li className="cursor-pointer border-b p-2"><FaGamepad className="inline mr-2" />Video Games</li>
          </Link>
          <Link href="/products/health-beauty">
            <li className="cursor-pointer border-b p-2"><FaHeart className="inline mr-2" />Health & Beauty</li>
          </Link>



        </ul>

      </SheetContent>
    </Sheet>
  )
}
