// src/components/admin/orders/PrintInvoice.jsx
"use client";
import { Printer } from "lucide-react";

const maskPhone = (phone) => {
  if (!phone) return "---";
  return phone.replace(/\d(?=\d{4})/g, "•");
};

export default function PrintInvoice({ order }) {
  if (!order) return null;

  const getInvoiceHtml = () => {
    const maskedPhone = maskPhone(order.phone);
    const maskedNote = order.note || "---";

    const itemsHtml = order.items
      ?.map(
        (item, idx) => `
          <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#fafafa"}">
            <td>${item.name}</td>
            <td style="text-align:center">${item.qty}</td>
            <td style="text-align:right">${item.price.toLocaleString(
              "vi-VN"
            )} ₫</td>
            <td style="text-align:right">${(
              item.qty * item.price
            ).toLocaleString("vi-VN")} ₫</td>
          </tr>`
      )
      .join("");

    return `
      <html>
        <head>
          <title>Hóa đơn ${order.code}</title>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            :root { color-scheme: light only; }
            body { font-family: 'Inter', sans-serif; padding: 0; margin: 0; background: #f5f7fa; color: #333; }
            .wrap { max-width: 560px; margin: 24px auto; }
            .toolbar { display:flex; gap:8px; justify-content:center; margin-bottom:12px; }
            .btn { padding:10px 14px; border-radius:10px; font-weight:600; color:#fff; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.12); }
            .btn-print { background: linear-gradient(90deg,#16a34a,#22c55e); }
            .btn-download { background: #2563eb; }
            .invoice { background:#fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(90deg, #111827, #1f2937); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
            .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
            .header p { margin: 4px 0 0; font-size: 13px; color: #d1d5db; }
            .info { padding: 18px 20px; font-size: 14px; }
            .info h3 { margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #111827; }
            .info p { margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { background: linear-gradient(90deg, #16a34a, #22c55e); color: white; padding: 10px; font-weight: 600; text-align: left; font-size: 13px; }
            td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            .total-box { padding: 18px 20px; text-align: right; }
            .total { display: inline-block; background: #ecfdf5; color: #065f46; padding: 10px 18px; font-size: 16px; font-weight: 700; border-radius: 10px; }
            .qr { margin: 22px 0; text-align: center; padding-bottom: 8px; }
            .qr img { width: 240px; height: 240px; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); object-fit: cover; }
            .qr p { margin-top: 10px; font-size: 13px; color: #555; }
            .footer { background: #f9fafb; text-align: center; padding: 14px; font-size: 12px; color: #666; font-style: italic; border-top: 1px solid #eee; }
            @media print {
              .toolbar { display: none !important; }
              body { background: #fff; }
              .wrap { margin: 0; max-width: none; }
              .invoice { box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="toolbar">
              <button class="btn btn-print" id="btnPrint">🖨 In</button>
              <button class="btn btn-download" id="btnDownload">⬇ Tải ảnh (.jpg)</button>
            </div>

            <div class="invoice" id="invoiceRoot">
              <div class="header">
                <div>
                  <h1>Delia</h1>
                  <p>Hóa đơn bán hàng • Hotline: 0123 456 789</p>
                </div>
                <div style="text-align:right">
                  <h1>#${order.code}</h1>
                  <p>${order.date}</p>
                </div>
              </div>

              <div class="info">
                <h3>Khách hàng</h3>
                <p><b>Tên:</b> ${order.customer}</p>
                <p><b>Địa chỉ:</b> ${order.address}</p>
                <p><b>Điện thoại:</b> ${maskedPhone}</p>
                <p><b>Ghi chú:</b> ${maskedNote}</p>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style="width:40%">Tên mặt hàng</th>
                    <th style="width:15%; text-align:center">SL</th>
                    <th style="width:20%; text-align:right">Đơn giá</th>
                    <th style="width:25%; text-align:right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>

              <div class="total-box">
                <span class="total">Tổng cộng: ${order.total.toLocaleString(
                  "vi-VN"
                )} ₫</span>
              </div>

              <div class="qr">
                <p><b>Quét mã để thanh toán</b></p>
                <img src="/qr-mb.png" alt="QR Thanh toán" crossorigin="anonymous" />
                <p>(Hỗ trợ MoMo / VNPay / Ngân hàng)</p>
              </div>

              <div class="footer">
                Cảm ơn quý khách đã mua sắm tại <b>Delia</b>. Chúng tôi hân hạnh phục vụ bạn ❤️
              </div>
            </div>
          </div>

          <!-- html2canvas CDN để chụp ảnh -->
          <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
          <script>
            // In
            document.getElementById('btnPrint')?.addEventListener('click', function() {
              window.print();
            });

            // Tải JPG
            document.getElementById('btnDownload')?.addEventListener('click', async function() {
              const node = document.getElementById('invoiceRoot');
              if (!node) return;
              try {
                const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                const link = document.createElement('a');
                link.download = 'invoice-${order.code}.jpg';
                link.href = canvas.toDataURL('image/jpeg', 0.95);
                link.click();
              } catch (e) {
                alert('Không thể tạo ảnh. Kiểm tra lại ảnh QR có cùng domain (CORS) nhé!');
              }
            });
          </script>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = getInvoiceHtml();
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <button
      onClick={handlePrint}
      className="rounded-md bg-gradient-to-r from-green-600 to-emerald-700 px-5 py-2.5 text-white hover:opacity-90 flex items-center gap-2 shadow-lg"
    >
      <Printer size={18} /> In hóa đơn
    </button>
  );
}
