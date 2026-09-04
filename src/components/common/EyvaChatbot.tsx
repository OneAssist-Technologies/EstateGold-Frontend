"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function EyvaChatbotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Eyva, your EstateGold AI property advisor 👋\nTell me what property you're looking for (e.g., '2 BHK in Coimbatore under 70 Lakhs').",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [suggestions, setSuggestions] = useState<string[]>([
    "2 BHK in Coimbatore 🏢",
    "Villa under 80 Lakhs 🏡",
    "Rental house in Peelamedu 🔑",
    "Plot / Land in Coimbatore 🌳",
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check URL param or event trigger
  useEffect(() => {
    if (searchParams?.get("eyva") === "open") {
      setIsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener("open_eyva_chat", handleOpen);
    return () => window.removeEventListener("open_eyva_chat", handleOpen);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!textToSend) setInput("");
    setSuggestions([]);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const backendMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post("/ai/eyva", {
        messages: backendMessages,
        filters: activeFilters,
      });

      if (res.data && res.data.success) {
        const replyText = res.data.reply || "I found properties matching your request!";
        const extractedFilters = res.data.filters || {};
        setActiveFilters(extractedFilters);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: replyText,
          },
        ]);

        if (res.data.suggestions && res.data.suggestions.length > 0) {
          setSuggestions(res.data.suggestions);
        }

        // Navigate or update properties page with parameters if search criteria present
        const params = new URLSearchParams();

        if (extractedFilters.purpose) params.set("purpose", String(extractedFilters.purpose));
        if (extractedFilters.city) params.set("city", String(extractedFilters.city));
        if (extractedFilters.propertyType) params.set("type", String(extractedFilters.propertyType));
        if (extractedFilters.bedrooms) params.set("bedrooms", String(extractedFilters.bedrooms));
        if (extractedFilters.minPrice) params.set("minPrice", String(extractedFilters.minPrice));
        if (extractedFilters.maxPrice) params.set("maxPrice", String(extractedFilters.maxPrice));
        if (extractedFilters.search) params.set("search", String(extractedFilters.search));
        if (extractedFilters.locality) params.set("locality", String(extractedFilters.locality));

        const hasFilters = Object.keys(extractedFilters).some(
          (k) => extractedFilters[k] !== undefined && extractedFilters[k] !== "" && extractedFilters[k] !== null
        );

        if (hasFilters) {
          const queryString = params.toString();
          const targetUrl = queryString ? `/property-listing?${queryString}` : `/property-listing`;
          router.push(targetUrl);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error("Eyva AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Button */}
      <div className="fixed right-5 bottom-5 z-50 flex items-center gap-3">
        <div className="relative group">
          {/* Tooltip on hover */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-[#14110F] text-[#F5C438] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap transition-all duration-200 border border-[#C89B1C]/50 pointer-events-none">
            <span>Ask Eyva</span>
            <div className="w-2 h-2 bg-[#14110F] rotate-45 absolute -right-1 top-1/2 -translate-y-1/2 border-r border-t border-[#C89B1C]/50"></div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#14110F] via-[#1A1715] to-[#26211C] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(200,155,28,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#C89B1C] focus:outline-none relative"
            aria-label="Toggle Eyva Chatbot"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#F5C438]" />
            ) : (
              <div className="relative flex items-center justify-center">
                <img
                  src="/eyva 1.png"
                  alt="Eyva AI"
                  className="w-9 h-9 object-contain drop-shadow-md"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#14110F] rounded-full animate-pulse"></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Compact Popup Chatbot Window */}
      {isOpen && (
        <div
          className="fixed right-4 sm:right-5 bottom-[85px] z-50 w-[calc(100vw-32px)] sm:w-[390px] h-[560px] max-h-[calc(100vh-105px)] bg-white rounded-2xl shadow-2xl border border-[#EBE3D5] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#14110F] via-[#1A1715] to-[#26211C] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#C89B1C]/40">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/10 p-0.5 border border-[#C89B1C] flex items-center justify-center shadow-inner">
                <img
                  src="/eyva 1.png"
                  alt="Eyva Logo"
                  className="w-7 h-7 object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#14110F] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-wide">Eyva AI</h3>
                  <span className="text-[10px] bg-[#C89B1C]/25 text-[#F5C438] font-bold px-2 py-0.5 rounded-full border border-[#C89B1C]/40">
                    Assistant
                  </span>
                </div>
                <p className="text-[11px] text-[#D8B75A]/90 font-light">EstateGold Intelligent Search</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-[#F5C438] transition cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF6EE]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#B88A1A] via-[#C89B1C] to-[#9A720C] text-white rounded-tr-none shadow-md font-medium"
                      : "bg-white text-[#161616] border border-[#EBE3D5] rounded-tl-none shadow-2xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#EBE3D5] px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B1C] animate-spin" />
                  <span className="text-xs text-gray-700 font-medium">Eyva is searching properties...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {suggestions.length > 0 && !loading && (
            <div className="px-3 py-2 bg-[#F3EAD9] border-t border-[#EBE3D5] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-gradient-to-r hover:from-[#B88A1A] hover:to-[#9A720C] hover:text-white text-[#161616] rounded-full border border-[#C89B1C]/40 transition-all whitespace-nowrap flex-shrink-0 shadow-2xs cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#EBE3D5] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Eyva for properties..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF6EE] border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#C89B1C] focus:bg-white text-[#161616] placeholder:text-gray-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-40 shadow-sm hover:opacity-95 cursor-pointer shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default function EyvaChatbot() {
  return (
    <Suspense fallback={null}>
      <EyvaChatbotContent />
    </Suspense>
  );
}
