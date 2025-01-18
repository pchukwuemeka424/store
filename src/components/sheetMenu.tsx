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
import { TiThMenuOutline } from "react-icons/ti"

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><TiThMenuOutline /></Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Link href="/" className='flex items-center mx-4'>Home</Link>
        <Link href="/dashboard" className='flex items-center mx-4'>Dashboard</Link>
        <Link href="/products" className='flex items-center mx-4'>Products</Link>
        <Link href="/categories" className='flex items-center mx-4'>Categories</Link>
        <Link href="/orders" className='flex items-center mx-4'>Orders</Link>
        <Link href="/settings" className='flex items-center mx-4'>Settings</Link>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
