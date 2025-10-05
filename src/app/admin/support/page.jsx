"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Send, Loader2 } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";

/* ====== API & helpers ====== */
const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");
const ORIGIN =
  (process.env.NEXT_PUBLIC_ASSET_ORIGIN || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
    .replace(/\/api$/, "")
    .replace(/\/$/, "");

const cls = (...a) => a.filter(Boolean).join(" ");
const fmtTime = (ts) => new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
const fmtDay = (ts) => new Date(ts).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });

const absUrl = (u) => {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  return `${ORIGIN}/${String(u).replace(/^\/+/, "")}`;
};

function authHeaders() {
  if (typeof window === "undefined") return {};
  let t = localStorage.getItem("token") || localStorage.getItem("access_token") || "";
  t = String(t).replace(/^"(.*)"$/, "$1").trim();
  if (t && !t.startsWith("Bearer ")) t = `Bearer ${t}`;
  return t ? { Authorization: t } : {};
}

/* ---------------- UI bits ---------------- */
function ThreadItem({ active, avatar, title, subtitle, time, unread, onClick }) {
  return (
    <button onClick={onClick} className={cls("w-full flex items-center gap-3 rounded-xl px-3 py-2 transition-colors", active ? "bg-[#e7f3ff]" : "hover:bg-gray-100")}>
      <img src={avatar } className="w-10 h-10 rounded-full border border-gray-200 object-cover" alt="" />
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium truncate text-gray-900">{title}</div>
          <div className="text-[11px] text-gray-500 shrink-0">{time}</div>
        </div>
        <div className="text-xs text-gray-500 truncate">{subtitle}</div>
      </div>
      {!!unread && <span className="ml-1 rounded-full bg-blue-600 text-white text-[10px] px-1.5 py-0.5">{unread}</span>}
    </button>
  );
}

function Bubble({ me, msg, otherAvatar, adminAvatar }) {
  const base = "max-w-[72%] px-3 py-2 rounded-2xl shadow-sm text-[15px] leading-snug border";
  const mine = "bg-[#0084ff] border-transparent text-white";
  const other = "bg-white border-gray-200 text-gray-900";
  return (
    <div className={cls("w-full mb-1.5 flex", me ? "justify-end" : "justify-start")}>
      {!me && <img src={otherAvatar } className="w-7 h-7 rounded-full border border-gray-200 mr-2 mt-auto object-cover" alt="" />}
      <div className={cls(base, me ? mine : other, me ? "rounded-br-md" : "rounded-bl-md")}>
        <div className="whitespace-pre-wrap break-words">{msg.text}</div>
        <div className={cls("mt-1 text-[11px]", me ? "text-blue-100" : "text-gray-400")}>{fmtTime(msg.ts)}</div>
      </div>
      {me && <img src={adminAvatar} className="w-7 h-7 rounded-full border border-gray-200 ml-2 mt-auto object-cover" alt="" />}
    </div>
  );
}

function DayDivider({ ts }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="text-[11px] text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-0.5">{fmtDay(ts)}</div>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function SystemBanner({ text }) {
  return (
    <div className="my-5 flex items-center">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="mx-3 text-[12px] text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1">
        {text}
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
  const [text, setText] = useState("");

  const listRef = useRef(null);

  /* admin avatar (fetch từ meta hoặc local) */
  const [adminAvatar, setAdminAvatar] = useState();
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("admin");
      if (raw) {
        const me = JSON.parse(raw);
        const av = me?.anh_dai_dien || me?.avatar || me?.avatar_url;
        if (av) setAdminAvatar(absUrl(av));
      }
    } catch {}
    fetch(`${API}/support/meta`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.adminAvatar) setAdminAvatar(absUrl(d.adminAvatar)); })
      .catch(() => {});
  }, []);

  const activeThread = useMemo(() => threads.find((t) => t.id === activeId) || null, [threads, activeId]);

  
  async function loadThreads() {
    setLoadingThreads(true);
    try {
      const res = await fetch(`${API}/support/threads`, { headers: { ...authHeaders() } });
      const data = await res.json();
      if (res.ok) {
        const normalized = (Array.isArray(data) ? data : []).map((t) => ({
          ...t,
          customerAvatar: t.customerAvatar ? absUrl(t.customerAvatar) : null,
        }));
        setThreads(normalized);
      }
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
      const res = await fetch(`${API}/support/threads/${activeId}/messages?${qs}`, { headers: { ...authHeaders() } });
      const data = await res.json();
      if (res.ok) {
        if (appendTop) setMessages((prev) => [...data, ...prev]);
        else {
          setMessages(data);
          setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 0);
        }
        setHasMore(Array.isArray(data) && data.length >= 50 && !data?.[0]?.system);
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
      body: JSON.stringify({ senderRole: "admin", text: content }),
    });
    await loadMessages();
    await loadThreads();
  }

  const [confirmOpen, setConfirmOpen] = useState(false);

async function endSessionRequest() {
  if (!activeId) return;
  // Trả về Promise để ConfirmModal có thể chờ và hiển thị toast
  const res = await fetch(`${API}/support/threads/${activeId}/end`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Không thể kết thúc phiên hỗ trợ");
  }
  // refresh UI 2 phía admin ngay sau khi xoá
  await loadMessages();
  await loadThreads();
}


  useEffect(() => {
    loadThreads();
    const itv = setInterval(loadThreads, 3000);
    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    loadMessages();
    fetch(`${API}/support/threads/${activeId}/read/admin`, { method: "POST", headers: { ...authHeaders() } }).catch(() => {});
    const itv = setInterval(loadMessages, 3000);
    return () => clearInterval(itv);
  }, [activeId]);

  const shownThreads = useMemo(() => {
    let arr = threads;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter((t) => (t.customerName || "").toLowerCase().includes(s) || (t.last?.text || "").toLowerCase().includes(s));
    }
    return arr;
  }, [threads, tab, q]);

  const renderedMessages = useMemo(() => {
    if (!messages.length) return null;

    // Nếu là system-only
    if (messages.length === 1 && messages[0]?.system) {
      return <SystemBanner text={messages[0].text} />;
    }

    const out = [];
    let last = "";
    for (const m of messages) {
      const k = new Date(m.ts).toDateString();
      if (k !== last) { out.push({ __d: true, ts: m.ts, key: `d-${out.length}` }); last = k; }
      out.push(m);
    }
    const otherAvatar = activeThread?.customerAvatar;
    return out.map((m, i) =>
      m.__d ? (
        <DayDivider key={m.key || `d-${i}`} ts={m.ts} />
      ) : (
        <Bubble key={m.id} me={m.senderRole === "admin"} msg={m} otherAvatar={otherAvatar} adminAvatar={adminAvatar} />
      )
    );
  }, [messages, activeThread, adminAvatar]);

  const sessionEnded = messages.length === 1 && messages[0]?.system === true;

  return (
    <div className="w-full overflow-hidden bg-[#f6f7f8]" style={{ height: "calc(100vh - 100px)" }}>
      <div className="grid gap-3 h-full" style={{ gridTemplateColumns: "360px 1fr" }}>
        {/* LEFT */}
        <section className="bg-white rounded-2xl shadow overflow-hidden flex flex-col border border-gray-100">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
            <div className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">Chăm sóc khách hàng</div>
            </div>
            <div className="px-4 pb-2">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm khách hàng"
                  className="w-full rounded-full bg-gray-100 text-gray-800 placeholder:text-gray-400 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-2 flex gap-2">
                {["Tất cả"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cls("text-sm px-3 py-1.5 rounded-full", tab === t ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100 text-gray-700")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                  avatar={t.customerAvatar}
                  title={t.customerName || `Khách ${t.id}`}
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
          <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeThread?.customerAvatar} className="w-10 h-10 rounded-full border border-gray-200 object-cover" alt="" />
              <div>
                <div className="font-semibold text-gray-900">{activeThread?.customerName || "Chọn cuộc trò chuyện"}</div>
                {activeThread && <div className="text-xs text-gray-500">Đang hoạt động</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!!activeId && (
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700"
                  title="Kết thúc hỗ trợ"
                  >
                  Kết thúc hỗ trợ
                  </button>

              )}
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-auto px-4 py-3 bg-[#f5f6f7] scroll-slim">
            {!activeId && <div className="h-full grid place-items-center text-gray-400">Chọn một đoạn chat để bắt đầu</div>}
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

                {renderedMessages}

                {loadingMsgs && (
                  <div className="flex justify-center py-2 text-xs text-gray-500">
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Đồng bộ tin nhắn…
                  </div>
                )}
              </>
            )}
          </div>

          <div className="px-3 py-2 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={activeId ? "Aa" : "Chọn đoạn chat để nhắn…"}
                disabled={!activeId || sessionEnded}
                className="flex-1 rounded-full bg-gray-100 text-gray-900 placeholder:text-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={() => { if (!text.trim()) return; send(); }}
                disabled={!activeId || !text.trim() || sessionEnded}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                title="Gửi"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .scroll-slim::-webkit-scrollbar { width: 8px; height: 8px; }
        .scroll-slim::-webkit-scrollbar-thumb { background: rgba(0,0,0,.15); border-radius: 9999px; }
        .scroll-slim:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,.25); }
      `}</style>
      <ConfirmModal
  open={confirmOpen}
  title="Kết thúc phiên hỗ trợ"
  message="Bạn có chắc muốn kết thúc phiên hỗ trợ này và xoá toàn bộ tin nhắn? Hành động không thể hoàn tác."
  onConfirm={endSessionRequest}
  onCancel={() => setConfirmOpen(false)}
  successMessage="Đã kết thúc phiên hỗ trợ"
  errorMessage="Không thể kết thúc phiên hỗ trợ"
/>

    </div>
  );
}
