"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSection() {
  const banners = [
    "/images/banner1.jpg",
    "/images/banner2.jpg",
    "/images/banner3.jpg",
    "/images/banner4.jpg",
    "/images/banner5.jpg",
    "/images/banner6.jpg",
  ];

  return (
    <section className="w-full bg-white">
      <Swiper
        spaceBetween={0}
        centeredSlides
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full"
      >
        {banners.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Banner ${i + 1}`}
              className="w-full h-auto object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
