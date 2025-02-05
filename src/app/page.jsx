"use client";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import CatSlider from "../components/catSlider";
import ProductFetch from "./product/productFetch";

export default function Home() {
  return (
    <div>
      <Navbar />
        <Hero />
        <CatSlider />
        
        <div className="mx-auto max-w-7xl" >
        <div className="text-2xl font-bold text-gray-900">Products</div>
       <ProductFetch />
       </div>
    </div>
  );
}
