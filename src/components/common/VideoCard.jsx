"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Danh sách tất cả video đang mở
let activeVideos = [];

export default function VideoCard({ video }) {
  const videoRef = useRef(null);

  // Hàm xử lý play video
  const handlePlay = () => {
    // Tạm dừng tất cả video khác
    activeVideos.forEach((v) => {
      if (v !== videoRef.current && !v.paused) {
        v.pause();
      }
    });

    // Clear mảng để tránh trùng lặp
    activeVideos = activeVideos.filter((v) => v !== videoRef.current);

    // Thêm video hiện tại vào danh sách đang chạy
    activeVideos.push(videoRef.current);

    // Bật tiếng và phát
    videoRef.current.muted = false;
    videoRef.current.play();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-20">
      {/* Video bên trái */}
      <div className="relative w-full flex justify-center">
        <video
          ref={videoRef}
          src={video.src}
          muted
          controls
          playsInline
          onPlay={handlePlay}
          className="w-full max-w-3xl h-auto rounded-lg shadow-lg object-contain bg-black"
        />
      </div>

      {/* Mô tả bên phải */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          {video.title}
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          speed={700}
          className="w-full px-12"
        >
          {video.slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="leading-relaxed text-gray-700 text-sm md:text-base whitespace-pre-line text-center">
                {slide}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
