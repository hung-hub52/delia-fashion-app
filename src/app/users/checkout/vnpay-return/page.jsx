"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function VNPayReturn() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("vnp_ResponseCode");

    if (code === "00") {
      toast.success("🎉 Thanh toán VNPay thành công!");
    } else {
      toast.error("❌ Thanh toán VNPay thất bại hoặc bị hủy!");
    }

    setTimeout(() => router.push("/users/checkout/pending"), 2000);
  }, [params, router]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-2xl font-bold text-pink-600">
        Đang xử lý thanh toán VNPay...
      </h1>
      <p className="mt-2 text-gray-600">
        Vui lòng chờ trong giây lát, hệ thống đang xác nhận giao dịch.
      </p>
    </div>
  );
}
