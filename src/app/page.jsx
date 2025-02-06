"use client";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import CatSlider from "../components/catSlider";
import ProductFetch from "./product/productFetch";
import Midtab from "../components/midTab";
export default function Home() {
  return (
    <div>
      <Navbar />
        <Hero />
        <Midtab />
      
        <CatSlider />
        
        <div className="mx-auto max-w-7xl" >
        <div className="text-2x px-2 font-bold text-gray-900">Feature Products</div>
       <ProductFetch />
       </div>
    </div>
  );
}
