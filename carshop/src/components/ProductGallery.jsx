"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ProductGallery({ images }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images.filter(
    (src) => typeof src === "string" && src.trim() !== ""
  );

  if (validImages.length === 0) {
    return (
      <img
        src="/placeholder.png"
        alt="Фото недоступне"
        className="rounded-lg max-h-96 object-contain"
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Swiper
        modules={[Navigation]}
        navigation
        loop={validImages.length > 1}
        observer
        observeParents
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full max-w-lg h-96 cursor-pointer"
      >
        {validImages.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Фото ${index + 1}`}
              className="rounded-lg object-contain h-full mx-auto transition-transform duration-300 hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {validImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Thumb ${index + 1}`}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideToLoop(index);
              }
            }}
            className={`h-16 w-16 object-cover rounded-md border-2 cursor-pointer transition 
              ${
                activeIndex === index
                  ? "bg-gray-900 ring-2 ring-gray-900"
                  : "border-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
