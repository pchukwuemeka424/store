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
        <div className="text-2xl px-3 font-bold text-gray-900">Products</div>
        <ProductFetch />
    </div>
  );
}
