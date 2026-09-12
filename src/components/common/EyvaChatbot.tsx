"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Send, X, Sparkles, MapPin, Bed, Bath, Car, ChevronRight, Calendar, Bookmark } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/api";

/* ───────────── Types ───────────── */

interface PropertyResult {
  id: string;
  title: string;
  purpose?: string;
  propertyType?: string;
  city?: string;
  locality?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishing?: string;
  parking?: boolean;
  amenities?: string[];
  photos?: string[];
  matchScore?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  properties?: PropertyResult[];
  isStreaming?: boolean;
}

/* ───────────── Helpers ───────────── */

function formatPrice(price: number | undefined): string {
  if (!price) return "Price on request";
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1).replace(/\.0$/, "")} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

/* ───────────── Property Card ───────────── */

function PropertyCard({ property, onViewDetails }: { property: PropertyResult; onViewDetails: (id: string) => void }) {
  const photoUrl = property.photos?.[0]
    ? property.photos[0].startsWith("http")
      ? property.photos[0]
      : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/uploads/${property.photos[0]}`
    : null;

  return (
    <div className="bg-white border border-[#EBE3D5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Photo */}
      {photoUrl && (
        <div className="h-28 w-full overflow-hidden bg-[#F5F0E8]">
          <img src={photoUrl} alt={property.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Info */}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-bold text-[#161616] leading-tight line-clamp-2">{property.title}</p>
          {property.matchScore && (
            <span className="shrink-0 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
              {property.matchScore}%
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-[#9A720C] mt-1">{formatPrice(property.price)}</p>

        <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-gray-500">
          {property.bedrooms && (
            <span className="flex items-center gap-0.5">
              <Bed className="w-3 h-3" /> {property.bedrooms} BHK
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-0.5">
              <Bath className="w-3 h-3" /> {property.bathrooms}
            </span>
          )}
          {property.area && <span>{property.area} sq.ft</span>}
          {property.parking && (
            <span className="flex items-center gap-0.5">
              <Car className="w-3 h-3" />
            </span>
          )}
        </div>

        {property.locality && (
          <p className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-1">
            <MapPin className="w-2.5 h-2.5" />
            {property.locality}{property.city ? `, ${property.city}` : ""}
          </p>
        )}

        <button
          onClick={() => onViewDetails(property.id)}
          className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-semibold text-[#9A720C] bg-[#FAF6EE] border border-[#E8DCC1] rounded-lg py-1.5 hover:bg-[#F0E8D5] transition-colors cursor-pointer"
        >
          View Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ───────────── Main Component ───────────── */

function EyvaChatbotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Eyva, your EstateGold AI property advisor 👋\nTell me what you're looking for — location, budget, bedrooms, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([
    "2 BHK in Coimbatore 🏢",
    "Villa under 80 Lakhs 🏡",
    "Rental house in Peelamedu 🔑",
    "What documents do I need? 📄",
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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

  const handleViewDetails = useCallback((propertyId: string) => {
    router.push(`/property/${propertyId}`);
  }, [router]);

  /* ───── Send Message with SSE Streaming ───── */

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!textToSend) setInput("");
    setSuggestions([]);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Create placeholder assistant message for streaming
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    try {
      // Try SSE streaming first
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/ai/eyva/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            message: text,
            conversationId,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Streaming not available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      let streamedProperties: PropertyResult[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(line.slice(6));

            switch (data.type) {
              case "conversation_id":
                setConversationId(data.conversationId);
                break;

              case "properties":
                streamedProperties = [...streamedProperties, ...(data.properties || [])];
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, properties: streamedProperties }
                      : m
                  )
                );
                break;

              case "text_delta":
                streamedContent += data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: streamedContent }
                      : m
                  )
                );
                break;

              case "text_end":
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, isStreaming: false }
                      : m
                  )
                );
                break;

              case "done":
                break;

              case "error":
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: data.message || "Something went wrong.", isStreaming: false }
                      : m
                  )
                );
                break;
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }

      // Ensure streaming flag is removed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, isStreaming: false } : m
        )
      );
    } catch {
      // Fallback to synchronous API if streaming fails
      try {
        const res = await api.post("/ai/eyva", {
          message: text,
          conversationId,
        });

        if (res.data?.success) {
          setConversationId(res.data.conversationId || conversationId);

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: res.data.reply || "I found some results!",
                    properties: res.data.properties || [],
                    isStreaming: false,
                  }
                : m
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: res.data?.reply || "Sorry, something went wrong.", isStreaming: false }
                : m
            )
          );
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: "I'm having trouble connecting. Please try again.", isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, conversationId, router]);

  /* ───── Render ───── */

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
                  src="/eyva-logo.png"
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
          className="fixed right-4 sm:right-5 bottom-[85px] z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[600px] max-h-[calc(100vh-105px)] bg-white rounded-2xl shadow-2xl border border-[#EBE3D5] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#14110F] via-[#1A1715] to-[#26211C] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#C89B1C]/40">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/10 p-0.5 border border-[#C89B1C] flex items-center justify-center shadow-inner">
                <img
                  src="/eyva-logo.png"
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
              <div key={msg.id}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#B88A1A] via-[#C89B1C] to-[#9A720C] text-white rounded-tr-none shadow-md font-medium"
                        : "bg-white text-[#161616] border border-[#EBE3D5] rounded-tl-none shadow-2xs"
                    }`}
                  >
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-[#C89B1C] ml-0.5 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>

                {/* Property Cards */}
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-2 ml-1">
                    <div className="flex overflow-x-auto gap-2.5 pb-1 no-scrollbar">
                      {msg.properties.map((property) => (
                        <div key={property.id} className="min-w-[200px] max-w-[220px] flex-shrink-0">
                          <PropertyCard property={property} onViewDetails={handleViewDetails} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && !messages[messages.length - 1]?.isStreaming && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#EBE3D5] px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B1C] animate-spin" />
                  <span className="text-xs text-gray-700 font-medium">Eyva is thinking...</span>
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
              placeholder="Ask Eyva anything..."
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
