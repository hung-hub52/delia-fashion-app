"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MomoReturnPage() {
  const params = useSearchParams();

  useEffect(() => {
    console.log("MoMo return params:", Object.fromEntries(params.entries()));
  }, []);

  const resultCode = params.get("resultCode");
  const message =
    resultCode === "0"
      ? "🎉 Thanh toán thành công!"
      : "❌ Thanh toán thất bại hoặc bị hủy.";

  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <h1 className="text-2xl font-semibold mb-4">Kết quả thanh toán MoMo</h1>
      <p className="text-gray-700">{message}</p>
      <a
        href="/users/menuaccount/purchase"
        className="text-blue-600 underline mt-6 inline-block"
      >
        Quay lại đơn hàng
      </a>
    </div>
  );
}
