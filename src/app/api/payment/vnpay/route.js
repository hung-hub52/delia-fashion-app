import { NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";

export async function POST(req) {
  try {
    const { amount, orderInfo } = await req.json();

    // ✅ Thông tin sandbox
    const vnp_TmnCode = "2WBMBIX7";
    const vnp_HashSecret = "NLR2ITTDVRVU39S67NID6MFJ3AW06TQE";
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/users/checkout/vnpay-return`;

    // ✅ Thời gian + mã đơn
    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);
    const orderId = date.getTime();

    // ✅ Dữ liệu bắt buộc
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo || "Thanh toán đơn hàng Delia Elly",
      vnp_OrderType: "other",
      vnp_Amount: amount * 100, // nhân 100
      vnp_ReturnUrl,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // ✅ Sắp xếp và ký đúng chuẩn VNPay
    const sorted = Object.keys(vnp_Params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});

    // ⚡ Tạo chuỗi để ký (không encode)
    const signData = qs.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(signData, "utf-8").digest("hex");

    // ⚡ Encode lại khi tạo URL (VNPay yêu cầu)
    const paymentUrl = `${vnp_Url}?${qs.stringify(sorted, {
      encode: true,
    })}&vnp_SecureHash=${signed}`;

    console.log("🧾 signData (raw):", signData);
    console.log("🔐 signed:", signed);
    console.log("✅ VNPay Payment URL:", paymentUrl);
    

    console.log("✅ VNPay Payment URL:", paymentUrl);
    return NextResponse.json({ paymentUrl });
  } catch (err) {
    console.error("💥 Lỗi tạo URL VNPay:", err);
    return NextResponse.json(
      { error: "Lỗi khi tạo liên kết VNPay", message: err.message },
      { status: 500 }
    );
  }
}
