'use client';

import 'swiper/css';
import 'swiper/css/navigation';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function ProductGallery({ images }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = (images ?? []).filter((src) => typeof src === 'string' && src.trim() !== '');

  if (validImages.length === 0) {
    return (
      <div className="relative w-full max-w-lg h-96">
        <Image
          src="/placeholder.png"
          alt="Фото недоступне"
          fill
          sizes="(max-width: 1024px) 100vw, 512px"
          className="rounded-lg object-contain"
        />
      </div>
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
            <div className="relative w-full h-96">
              <Image
                src={src}
                alt={`Фото ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 512px"
                className="rounded-lg object-contain mx-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {validImages.map((src, index) => (
          <button
            key={index}
            type="button"
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`relative h-16 w-16 rounded-md border-2 overflow-hidden transition
              ${activeIndex === index ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300'}`}
            aria-label={`Open image ${index + 1}`}
          >
            <Image
              src={src}
              alt={`Thumb ${index + 1}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
