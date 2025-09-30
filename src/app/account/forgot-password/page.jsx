"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AuthForgot from "@/components/users/AuthForgot";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAuth(true); // bật modal captcha
  };

  //Điều kiện email hợp lệ
  const isValidEmail = identifier.includes("@") && identifier.trim() !== "";

  return (
    <section className="w-full bg-gray-50 px-4 py-6 text-gray-800">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-8 mt-10">
        <Link
          href="/account/login"
          className="flex items-center text-sm text-gray-600 hover:text-pink-600 mb-3"
        >
          <ArrowLeft size={18} className="mr-1" />
          Quay lại
        </Link>

        <h1 className="text-lg font-semibold text-center mb-4">
          Đặt lại mật khẩu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nhập Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:border-pink-500"
            required
          />
          <button
            type="submit"
            disabled={!isValidEmail} // ✅ nút bị disable nếu email không hợp lệ
            className={`w-full py-2 rounded transition 
              ${
                isValidEmail
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            TIẾP THEO
          </button>
        </form>
      </div>

      {/* Modal Auth */}
      <AuthForgot
        open={showAuth}
        onClose={() => setShowAuth(false)}
        email={identifier}
      />
    </section>
  );
}
