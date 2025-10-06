"use client";
import { useState } from "react";
import { Send, Bot, X } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // 🆕 hiệu ứng typing

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true); // 🟡 bật trạng thái “đang nhập”

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Lỗi hệ thống, vui lòng thử lại sau!",
        },
      ]);
    } finally {
      setIsTyping(false); // 🔵 tắt trạng thái “đang nhập”
    }
  };

  return (
    <>
      {/* Nút bật/tắt Chat */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-500 transition z-50"
      >
        {open ? <X size={22} /> : <Bot size={24} />}
      </button>

      {/* Hộp Chat */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white border shadow-xl rounded-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-pink-600 text-white px-4 py-2 flex items-center gap-2">
            <Bot size={18} />
            <span className="font-medium">Delia AI ChatBot</span>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-96 text-gray-800">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/icons/bot-avatar.png"
                    alt="Bot"
                    className="w-6 h-6 rounded-full mr-2 border"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-pink-100 text-gray-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 🟢 Hiệu ứng “bot đang nhập…” */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 px-3 py-1">
                <img
                  src="/icons/bot-avatar.png"
                  alt="Bot"
                  className="w-6 h-6 rounded-full border"
                />
                <span className="animate-pulse">Đang nhập...</span>
              </div>
            )}
          </div>

          {/* Ô nhập */}
          <div className=" p-2 flex items-center text-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400"
            />
            <button
              onClick={sendMessage}
              className="ml-2 p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
