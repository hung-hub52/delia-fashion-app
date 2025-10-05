"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, Minus, Send } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

/* ---------- Helpers ---------- */
function getCustomerId(user) {
  if (!user) return null;
  return (
    user.id ??
    user.userId ??
    user.user_id ??
    user.id_user ??
    user.id_nguoidung ??
    user.idNguoiDung ??
    null
  );
}

const REOPEN_KEY = "cskh_reopen";               // mở lại 1 lần sau khi user bấm "Đi tới Đăng nhập"
const SUPPRESS_END_KEY = "chat_suppress_end_once"; // ẩn banner kết thúc ở lần mở kế tiếp

export default function CustomerCareChat({
  user,
  adminName = "CSKH DELIA ELLY",
  adminAvatar = "/images/avatar-user.jpg",
  loginHref = "/login",
}) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname?.startsWith("/admin")) return null; // ẩn trên trang admin

  /* ---------- State ---------- */
  const [open, setOpen] = useState(false);        // KHÔNG auto-open
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasInit, setHasInit] = useState(false);
  const [online] = useState(true);

  const listRef = useRef(null);

  const customerId = getCustomerId(user);
  const isAuthed = !!customerId;

  /* ---------- Reopen logic (chỉ khi user bấm nút Đăng nhập trong popup) ---------- */
  useEffect(() => {
    if (!isAuthed) return;
    if (sessionStorage.getItem(REOPEN_KEY) === "1") {
      sessionStorage.removeItem(REOPEN_KEY);
      setOpen(true);              // mở lại 1 lần
      setMinimized(false);
    }
  }, [isAuthed]);

  /* ---------- Soft init thread khi đã login ---------- */
  useEffect(() => {
    setHasInit(false);
    setMessages([]);
    if (!isAuthed) return;

    fetch(`${API}/support/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
      credentials: "include",
    })
      .catch(() => {})
      .finally(() => setHasInit(true));
  }, [isAuthed, customerId]);

  /* ---------- Load & poll messages ---------- */
  const loadMessages = async () => {
    if (!isAuthed) return;
    const res = await fetch(`${API}/support/threads/${customerId}/messages?limit=50`, {
      credentials: "include",
    });
    let data = await res.json();

   if (Array.isArray(data)) {
     if (
     data.length === 1 &&
     data[0]?.senderRole === "system" &&
     /kết thúc/i.test(String(data[0]?.text || ""))
   ) {
     data = [];
   }
   setMessages(data);
 }
    fetch(`${API}/support/threads/${customerId}/read/user`, { method: "POST" }).catch(() => {});
  };

  useEffect(() => {
    if (!open || !hasInit || !isAuthed) return;
    loadMessages();
    const itv = setInterval(loadMessages, 3000);
    return () => clearInterval(itv);
  }, [open, hasInit, isAuthed, customerId]);

  /* ---------- Auto scroll cuối ---------- */
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  const timeString = useMemo(() => {
    const d = new Date();
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }, [messages]);

  const idgen = () =>
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()));

  /* ---------- Trạng thái phiên đã kết thúc ---------- */
  const isEnded = useMemo(() => {
    if (!messages.length) return false;
    const last = messages[messages.length - 1];
    return last?.senderRole === "system" && /kết thúc/i.test(String(last?.text || ""));
  }, [messages]);

  /* ---------- Send ---------- */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending || !isAuthed || isEnded) return;

    setSending(true);
    setInput("");

    const tmp = { id: idgen(), senderRole: "user", text, ts: Date.now(), __tmp: true };
    setMessages((m) => [...m, tmp]);

    try {
      await fetch(`${API}/support/threads/${customerId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderRole: "user", text }),
        credentials: "include",
      });
      await loadMessages();
    } catch {
      setMessages((m) => m.filter((x) => x !== tmp));
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ---------- Close ---------- */
  const closeChat = () => {
    setOpen(false);
    setMinimized(false);
    setMessages([]);
    // Lần mở kế tiếp ẩn banner “kết thúc”
    sessionStorage.setItem(SUPPRESS_END_KEY, "1");
  };

  /* =================================================================== */
  return (
    <>
      {/* FAB – chỉ mở khi bấm */}
      <button
        onClick={() => { setOpen(true); setMinimized(false); }}
        aria-label="Chăm sóc khách hàng"
        className="fixed right-6.5 bottom-10 z-[1000] flex items-center justify-center w-14 h-14 rounded-full bg-pink-600 text-white shadow-lg hover:bg-pink-700 transition"
      >
        <img src="/icons/cskh.png" alt="CSKH" className="w-10 h-10 object-contain" draggable={false} />
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed right-5 bottom-5 z-[1000] w-[360px] max-w-[92vw] rounded-xl shadow-2xl overflow-hidden border border-black/10 bg-[#0f0f10] text-white">
          {/* Header */}
          <div className="relative bg-[#1c1e21] px-3 py-2 flex items-center gap-2">
            <img src={adminAvatar} alt="admin" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 leading-tight">
              <div className="font-semibold">{adminName}</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-gray-400"}`} />
                {online ? "Đang hoạt động" : "Ngoại tuyến"}
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <button className="p-1 rounded hover:bg-white/10" title="Thu nhỏ" onClick={() => setMinimized((v) => !v)}><Minus size={16} /></button>
              <button className="p-1 rounded hover:bg-white/10" title="Đóng" onClick={closeChat}><X size={16} /></button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              {/* Chưa đăng nhập -> mời đăng nhập */}
              {!isAuthed ? (
                <div className="h-[410px] p-4 flex flex-col items-center justify-center text-center gap-3">
                  <img src="/icons/chuy.png" alt="" className="w-16 h-16 opacity-80" />
                  <div className="text-[15px] leading-relaxed text-gray-200">
                    Bạn cần <span className="font-semibold text-white">đăng nhập tài khoản</span> để được hỗ trợ trực tiếp qua chat.
                  </div>
                  <button
                    onClick={() => {
                      sessionStorage.setItem(REOPEN_KEY, "1"); // chỉ mở lại khi user bấm nút này
                      setOpen(false);
                      router.push(loginHref);
                    }}
                    className="mt-1 px-4 py-2 rounded-full bg-white text-black hover:bg-gray-100"
                  >
                    Đi tới Đăng nhập
                  </button>
                  <div className="text-[11px] text-gray-400 mt-2">{timeString} • CSKH trực tuyến</div>
                </div>
              ) : (
                <>
                  {/* Danh sách tin nhắn */}
                  <div ref={listRef} className="h-[410px] overflow-y-auto p-3 space-y-2 custom-scroll">
                    {isEnded ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="bg-[#2a2b2c] border border-white/10 text-white/90 px-4 py-2 rounded-full text-sm">
                          Phiên hỗ trợ khách hàng hiện tại đã kết thúc!
                        </div>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const mine = m.senderRole === "user";
                        return (
                          <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                            {!mine && <img src={adminAvatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-[6px]" />}
                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${mine ? "bg-[#1877f2] text-white" : "bg-[#3a3b3c] text-[#e4e6eb]"}`}>
                              {m.text}
                              <div className={`text-[10px] opacity-70 mt-1 ${mine ? "text-white" : "text-gray-300"}`}>
                                {new Date(m.ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Composer */}
                  <div className="px-3 pb-3">
                    <div className={`flex items-end gap-2 rounded-2xl px-3 pt-2 pb-2.5 ${isEnded ? "bg-[#242526]/50" : "bg-[#242526]"}`}>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        rows={1}
                        placeholder={isEnded ? "Phiên đã kết thúc" : "Aa"}
                        disabled={isEnded || sending}
                        className="flex-1 resize-none bg-transparent outline-none text-[15px] placeholder:text-gray-400 max-h-32 disabled:cursor-not-allowed"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!input.trim() || sending || isEnded}
                        className="disabled:opacity-60 disabled:cursor-not-allowed rounded-full p-2 bg-[#1877f2] hover:bg-[#1462c6]"
                        title="Gửi"
                      >
                        <Send size={16} className="text-white" />
                      </button>
                    </div>
                    {!isEnded && (
                      <div className="text-[10px] text-gray-400 mt-1">
                        {timeString} • Tin nhắn sẽ được gửi tới quản trị viên
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Scrollbar */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 999px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </>
  );
}
