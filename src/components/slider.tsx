import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function SliderComponent() {
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    // Fetch avatars from supabase
    const fetchAvatars = async () => {
      const supabase = createClient();
      const { data: avatars, error } = await supabase.from('user_profile').select("*");
      if (error) console.error('Error fetching avatars:', error);
      else setAvatars(avatars);
    };

    fetchAvatars();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    adaptiveHeight: true
  };

  return (
<Slider {...settings}>
  {/* Map avatars */}
  {avatars.map((avatar) => (
    <div key={avatar.id}>
      <Image
        src={avatar.avater}
        width={100}
        height={100}
        alt={`Avatar ${avatar.id}`}
        unoptimized
        className="h-24 sm:h-26 sm:w-40 w-24 border-2 m-3 p-3 border-gray-300 rounded-lg shadow-lg"
      />
    </div>
  ))}
</Slider>


  );
}
