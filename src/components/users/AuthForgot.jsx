// src/components/users/AuthForgot.jsx mã ảnh trượt quên mật khẩu

"use client";
import { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import Image from "next/image";
import OtpForgot from "./OtpForgot";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

export default function AuthForgot({ open, onClose, email }) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [sliderX, setSliderX] = useState(0);
  const [currentImg, setCurrentImg] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [imageQueue, setImageQueue] = useState([]);

  const images = [
    "/demo/puzzle1.jpg",
    "/demo/puzzle2.jpg",
    "/demo/puzzle3.jpg",
    "/demo/puzzle4.jpg",
    "/demo/puzzle5.jpg",
    "/demo/puzzle6.jpg",
    "/demo/puzzle7.jpg",
    "/demo/puzzle8.jpg",
    "/demo/puzzle9.jpg",
    "/demo/puzzle10.jpg",
  ];

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const generateId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from({ length: 15 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const nextCaptcha = () => {
    const queue = imageQueue.length ? imageQueue : shuffleArray(images);
    const [next, ...rest] = queue;
    setCurrentImg(next);
    setCaptchaId(generateId());
    setImageQueue(rest.length > 0 ? rest : shuffleArray(images));
  };

  useEffect(() => {
    if (open) {
      const shuffled = shuffleArray(images);
      setImageQueue(shuffled.slice(1));
      setCurrentImg(shuffled[0]);
      setCaptchaId(generateId());
      setSliderX(0);
      setVerified(false);
      setShowOtp(false); // reset về captcha khi mở lại
    }
  }, [open]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) nextCaptcha();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [imageQueue]);

  if (!open) return null;

    const handleVerify = async () => {
    setLoading(true);
    
    try {
      // Gửi request OTP forgot password
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.message || "Gửi OTP thất bại");
      }
      
      setVerified(true);
      toast.success("✅ Đã gửi mã OTP đến email của bạn!");
      
      setTimeout(() => {
        setShowOtp(true); // ✅ chuyển sang OTP
      }, 1000);
      
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
      setSliderX(0); // reset slider
    } finally {
      setLoading(false);
    }
  };

  // ✅ Nếu showOtp thì render OTP thay vì captcha
  if (showOtp) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <OtpForgot
          email={email} // ✅ lấy từ props
          onBack={() => setShowOtp(false)}
          onVerify={(code) => {
            alert("OTP nhập: " + code);
            onClose();
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        {!showOtp ? (
          <motion.div
            key="captcha"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white w-[380px] rounded shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-sm font-medium">Xác nhận để tiếp tục</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={nextCaptcha}
                  className="text-gray-500 hover:text-pink-500"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-pink-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* Captcha Image */}{" "}
            <div className="px-4 py-3">
              {" "}
              {currentImg && (
                <Image
                  src={currentImg}
                  alt="captcha"
                  width={400}
                  height={200}
                  className="rounded border h-130 w-full object-cover"
                />
              )}{" "}
            </div>
            {/* Slider */}
            <div className="px-4 py-3 border-t">
              <div className="relative w-full h-12 bg-gray-200 rounded flex items-center">
                {/* Fill track */}
                <div
                  className="absolute left-0 top-0 h-full bg-pink-500 rounded"
                  style={{ width: `${sliderX + 48}px` }}
                ></div>

                {/* Text */}
                <span className="absolute w-full text-center text-sm text-gray-700 pointer-events-none font-medium">
                  {verified
                    ? "✅ ĐÃ XÁC NHẬN"
                    : loading
                    ? "Đang xác thực..."
                    : "Kéo qua để xác thực"}
                </span>

                {/* Handle */}
                <div
                  className="absolute left-0 top-0 h-12 w-12 bg-pink-600 rounded flex items-center justify-center text-white cursor-pointer select-none"
                  style={{ transform: `translateX(${sliderX}px)` }}
                  onMouseDown={(e) => {
                    if (loading || verified) return;
                    e.preventDefault();
                    const startX = e.clientX;
                    const track = e.currentTarget.parentNode;
                    const trackWidth = track.offsetWidth;
                    const handleWidth = e.currentTarget.offsetWidth;
                    let currentX = sliderX;

                    const onMouseMove = (moveEvent) => {
                      const diff = moveEvent.clientX - startX;
                      const maxX = trackWidth - handleWidth;
                      currentX = Math.max(0, Math.min(diff, maxX));
                      setSliderX(currentX);
                    };

                    const onMouseUp = () => {
                      const maxX = trackWidth - handleWidth;
                      if (currentX >= maxX - 5) {
                        handleVerify();
                      } else {
                        setSliderX(0);
                      }
                      document.removeEventListener("mousemove", onMouseMove);
                      document.removeEventListener("mouseup", onMouseUp);
                    };

                    document.addEventListener("mousemove", onMouseMove);
                    document.addEventListener("mouseup", onMouseUp);
                  }}
                >
                  ➡
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2 break-all">
                ID: {captchaId}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <OtpForgot
              email="namn8272055@gmail.com"
              onBack={() => setShowOtp(false)}
              onVerify={(code) => {
                alert("OTP nhập: " + code);
                onClose();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
