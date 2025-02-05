"use client";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function SliderComponent() {
  const [categorys, setcategorys] = useState([]);

  useEffect(() => {
    // Fetch categories from Supabase
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data: categories, error } = await supabase.from("category").select("*");
      if (error) console.error("Error fetching categories:", error);
      else setcategorys(categories);
    };

    fetchCategories();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <Slider {...settings} className="mx-auto">
        {categorys.map((category) => (
          <div key={category.id} className="p-2">
            <div className="relative">
              <Image
                src={category.image}
                width={100}
                height={100}
                alt={`Category ${category.id}`}
                unoptimized
                className="w-full h-44 sm:h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center text-lg font-semibold py-2">
                {category.title}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
