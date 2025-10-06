// src/app/api/payment/momo/route.js
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;

    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = "Thanh toán qua MoMo Sandbox";
    const redirectUrl = `${process.env.APP_URL}/users/checkout/momo-return`;
    const ipnUrl = `${process.env.APP_URL}/api/payment/momo/verify`;
    const requestType = "payWithMethod";
    const extraData = "";

    // tạo chuỗi ký signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode,
      partnerName: "DeliaFashion",
      storeId: "DeliaStore",
      requestId,
      amount: String(amount),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      autoCapture: true,
      extraData,
      signature,
    };

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log("MoMo response:", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("MoMo API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
