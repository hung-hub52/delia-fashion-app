// src/app/api/payment/momo/verify/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 MoMo IPN Callback:", body);

    // Ở bản chính thức cậu nên verify lại signature để chống giả mạo
    // hiện tại chỉ log kết quả ra cho dễ test
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("IPN error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
