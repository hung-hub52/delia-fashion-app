// src/app/admin/support/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Video,
  Info,
  Send,
  Smile,
  Image as Img,
  ThumbsUp,
  Loader2,
} from "lucide-react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");
const TABS = ["Tất cả", "Chưa đọc", "Nhóm"];
const cls = (...a) => a.filter(Boolean).join(" ");
const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
const fmtDay = (ts) =>
  new Date(ts).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function authHeaders() {
  if (typeof window === "undefined") return {};
  let t = localStorage.getItem("token") || localStorage.getItem("access_token") || "";
  t = String(t).replace(/^"(.*)"$/, "$1").trim();
  if (t && !t.startsWith("Bearer ")) t = `Bearer ${t}`;
  return t ? { Authorization: t } : {};
}

/* ---------------- Left item ---------------- */
function ThreadItem({ active, title, subtitle, time, unread, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors",
        active ? "bg-[#e7f3ff]" : "hover:bg-gray-100"
      )}
    >
      <img
        src="https://i.pravatar.cc/40"
        className="w-10 h-10 rounded-full border border-gray-200"
        alt=""
      />
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium truncate text-gray-900">{title}</div>
          <div className="text-[11px] text-gray-500 shrink-0">{time}</div>
        </div>
        <div className="text-xs text-gray-500 truncate">{subtitle}</div>
      </div>
      {!!unread && (
        <span className="ml-1 rounded-full bg-blue-600 text-white text-[10px] px-1.5 py-0.5">
          {unread}
        </span>
      )}
    </button>
  );
}

function Bubble({ me, msg }) {
  const base =
    "max-w-[72%] px-3 py-2 rounded-2xl shadow-sm text-[15px] leading-snug border";
  const mine = "bg-[#0084ff] border-transparent text-white";
  const other = "bg-white border-gray-200 text-gray-900";
  return (
    <div className={cls("w-full mb-1.5 flex", me ? "justify-end" : "justify-start")}>
      {!me && (
        <img
          src="https://i.pravatar.cc/28"
          className="w-7 h-7 rounded-full border border-gray-200 mr-2 mt-auto"
          alt=""
        />
      )}
      <div className={cls(base, me ? mine : other, me ? "rounded-br-md" : "rounded-bl-md")}>
        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
        <div className={cls("mt-1 text-[11px]", me ? "text-blue-100" : "text-gray-400")}>
          {fmtTime(msg.ts)}
        </div>
      </div>
      {me && (
        <img
          src="https://i.pravatar.cc/28?u=me"
          className="w-7 h-7 rounded-full border border-gray-200 ml-2 mt-auto"
          alt=""
        />
      )}
    </div>
  );
}

function DayDivider({ ts }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="text-[11px] text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-0.5">
        {fmtDay(ts)}
      </div>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

/* =================== PAGE =================== */
export default function SupportPage() {
  /* left */
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [tab, setTab] = useState("Tất cả");
  const [q, setQ] = useState("");

  /* right */
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const listRef = useRef(null);
  const [text, setText] = useState("");

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );

  async function loadThreads() {
    setLoadingThreads(true);
    try {
      const res = await fetch(`${API}/support/threads`, { headers: { ...authHeaders() } });
      const data = await res.json();
      if (res.ok) setThreads(Array.isArray(data) ? data : []);
    } finally {
      setLoadingThreads(false);
    }
  }

  async function loadMessages({ beforeTs, appendTop } = {}) {
    if (!activeId) return;
    setLoadingMsgs(true);
    try {
      const qs = new URLSearchParams();
      if (beforeTs) qs.set("beforeTs", String(beforeTs));
      qs.set("limit", "50");
      const res = await fetch(
        `${API}/support/threads/${activeId}/messages?${qs}`,
        { headers: { ...authHeaders() } }
      );
      const data = await res.json();
      if (res.ok) {
        if (appendTop) setMessages((prev) => [...data, ...prev]);
        else {
          setMessages(data);
          setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 0);
        }
        setHasMore(data.length >= 50);
      }
    } finally {
      setLoadingMsgs(false);
    }
  }

  async function send() {
    const content = text.trim();
    if (!content || !activeId) return;
    setText("");
    await fetch(`${API}/support/threads/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ senderId: 1, senderRole: "admin", text: content }),
    });
    await loadMessages();
    await loadThreads();
  }

  async function createThread() {
    const customerId = prompt("ID khách hàng?");
    if (!customerId) return;
    const res = await fetch(`${API}/support/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ customerId: Number(customerId), title: `Khách ${customerId}` }),
    });
    const data = await res.json();
    if (res.ok) {
      await loadThreads();
      setActiveId(data.id);
    } else alert(data?.message || "Không tạo được hội thoại");
  }

  useEffect(() => {
    loadThreads();
    const itv = setInterval(loadThreads, 3000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    loadMessages();
    fetch(`${API}/support/threads/${activeId}/read/admin`, {
      method: "POST",
      headers: { ...authHeaders() },
    }).catch(() => {});
    const itv = setInterval(loadMessages, 3000);
    return () => clearInterval(itv);
  }, [activeId]);

  const shownThreads = useMemo(() => {
    let arr = threads;
    if (tab === "Chưa đọc") arr = arr.filter((t) => (t.unreadForAdmin || 0) > 0);
    if (tab === "Nhóm") arr = arr.filter((t) => (t.title || "").toLowerCase().includes("nhóm"));
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter(
        (t) =>
          (t.title || "").toLowerCase().includes(s) ||
          (t.last?.text || "").toLowerCase().includes(s)
      );
    }
    return arr;
  }, [threads, tab, q]);

  /* ========== LAYOUT: 2 CỘT CỐ ĐỊNH – LIGHT MODE ONLY ========== */
  return (
    <div
      className="w-full overflow-hidden bg-[#f6f7f8]"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="grid gap-3 h-full" style={{ gridTemplateColumns: "360px 1fr" }}>
        {/* LEFT */}
        <section className="bg-white rounded-2xl shadow overflow-hidden flex flex-col border border-gray-100">
          {/* header + search + tabs */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">Đoạn chat</div>
              <button
                onClick={createThread}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Tạo mới"
              >
                <Plus size={18} className="text-gray-700" />
              </button>
            </div>

            <div className="px-4 pb-2">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm trên Messenger"
                  className="w-full rounded-full bg-gray-100 text-gray-800 placeholder:text-gray-400 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-2 flex gap-2">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cls(
                      "text-sm px-3 py-1.5 rounded-full",
                      tab === t
                        ? "bg-gray-200 text-gray-900"
                        : "hover:bg-gray-100 text-gray-700"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* list */}
          <div className="flex-1 overflow-auto px-2 pb-3 scroll-slim">
            {loadingThreads && (
              <div className="px-3 py-6 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Đang tải cuộc trò chuyện…
              </div>
            )}
            {!loadingThreads && shownThreads.length === 0 && (
              <div className="px-3 py-6 text-sm text-gray-400 italic">Không có đoạn chat</div>
            )}
            {shownThreads.map((t) => (
              <div key={t.id} className="px-2">
                <ThreadItem
                  active={activeId === t.id}
                  title={t.title}
                  subtitle={(t.last?.senderRole === "admin" ? "Bạn: " : "KH: ") + (t.last?.text || "")}
                  time={t.updatedAt ? fmtTime(t.updatedAt) : ""}
                  unread={t.unreadForAdmin}
                  onClick={() => setActiveId(t.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <section className="bg-white rounded-2xl shadow overflow-hidden flex flex-col border border-gray-100">
          {/* top bar */}
          <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full border border-gray-200"
                alt=""
              />
              <div>
                <div className="font-semibold text-gray-900">
                  {activeThread?.title || "Chọn cuộc trò chuyện"}
                </div>
                {activeThread && <div className="text-xs text-gray-500">Đang hoạt động</div>}
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <button className="p-2 rounded-full hover:bg-gray-100" title="Gọi thoại">
                <Phone size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" title="Gọi video">
                <Video size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" title="Thông tin">
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* messages */}
          <div ref={listRef} className="flex-1 overflow-auto px-4 py-3 bg-[#f5f6f7] scroll-slim">
            {!activeId && (
              <div className="h-full grid place-items-center text-gray-400">
                Chọn một đoạn chat để bắt đầu
              </div>
            )}

            {activeId && (
              <>
                {hasMore && (
                  <div className="flex justify-center mb-3">
                    <button
                      onClick={() => {
                        const first = messages[0];
                        loadMessages({ beforeTs: first?.ts, appendTop: true });
                      }}
                      className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                      disabled={loadingMsgs}
                    >
                      {loadingMsgs ? "Đang tải..." : "Xem thêm"}
                    </button>
                  </div>
                )}

                {useMemo(() => {
                  if (!messages.length) return null;
                  const out = [];
                  let last = "";
                  for (const m of messages) {
                    const k = new Date(m.ts).toDateString();
                    if (k !== last) {
                      out.push({ __d: true, ts: m.ts });
                      last = k;
                    }
                    out.push(m);
                  }
                  return out.map((m, i) =>
                    m.__d ? (
                      <DayDivider key={`d-${i}`} ts={m.ts} />
                    ) : (
                      <Bubble key={m.id} me={m.senderRole === "admin"} msg={m} />
                    )
                  );
                }, [messages])}

                {loadingMsgs && (
                  <div className="flex justify-center py-2 text-xs text-gray-500">
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Đồng bộ tin nhắn…
                  </div>
                )}
              </>
            )}
          </div>

          {/* composer */}
          <div className="px-3 py-2 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100" title="Thêm">
                <Plus size={18} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" title="Ảnh/Video">
                <Img size={18} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" title="Emoji">
                <Smile size={18} className="text-gray-700" />
              </button>

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={activeId ? "Aa" : "Chọn đoạn chat để nhắn…"}
                disabled={!activeId}
                className="flex-1 rounded-full bg-gray-100 text-gray-900 placeholder:text-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />

              <button
                onClick={() => {
                  if (!text.trim()) return;
                  send();
                }}
                disabled={!activeId || !text.trim()}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                title="Gửi"
              >
                <Send size={18} />
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100" title="Thích">
                <ThumbsUp size={18} className="text-blue-600" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Scrollbar (Light) */}
      <style jsx global>{`
        .scroll-slim::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scroll-slim::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 9999px;
        }
        .scroll-slim:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
