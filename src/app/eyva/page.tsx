"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { Property } from "../../types/property";
import PropertyCard from "../../components/property/listing/PropertyCard";
import { useCompareSession } from "../../hooks/useCompareSession";
import { removePropertyFromCompare, clearCompareSession } from "../../services/compareService";;

interface ExtendedProperty extends Property {
  matchScore?: number;
  matchedDetails?: string[];
  mismatchedDetails?: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function EyvaPage() {
  const router = useRouter();
  const session = useCompareSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm Eyva 👋\nTell me about your dream property, and I'll help you find the right matches.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [matchingProperties, setMatchingProperties] = useState<ExtendedProperty[]>([]);
  const [activeExplanation, setActiveExplanation] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Buy a home 🏠",
    "Rent a property 🔑",
    "Apartment / Flat 🏢",
    "Plot / Land 🌳"
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setSuggestions([]);

    const updatedMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const backendMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post("/api/ai/eyva", {
        messages: backendMessages,
        filters: filters,
      });

      if (res.data && res.data.success) {
        if (res.data.filters) {
          setFilters(res.data.filters);
          if (typeof window !== "undefined") {
            localStorage.setItem("estategold_user_preferences", JSON.stringify(res.data.filters));
            window.dispatchEvent(new Event("estategold_user_preferences_changed"));
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
          },
        ]);

        if (res.data.properties && res.data.properties.length > 0) {
          setMatchingProperties(res.data.properties);
        }
        if (res.data.explanation) {
          setActiveExplanation(res.data.explanation);
        }
        setSuggestions(res.data.suggestions || []);
      }
    } catch (err) {
      console.error("Eyva request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a small connection issue. Could you repeat that or try again?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestionText: string) => {
    if (loading) return;
    setSuggestions([]);

    const updatedMessages = [...messages, { role: "user" as const, content: suggestionText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const backendMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post("/api/ai/eyva", {
        messages: backendMessages,
        filters: filters,
      });

      if (res.data && res.data.success) {
        if (res.data.filters) {
          setFilters(res.data.filters);
          if (typeof window !== "undefined") {
            localStorage.setItem("estategold_user_preferences", JSON.stringify(res.data.filters));
            window.dispatchEvent(new Event("estategold_user_preferences_changed"));
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
          },
        ]);

        if (res.data.properties && res.data.properties.length > 0) {
          setMatchingProperties(res.data.properties);
        }
        if (res.data.explanation) {
          setActiveExplanation(res.data.explanation);
        }
        setSuggestions(res.data.suggestions || []);
      }
    } catch (err) {
      console.error("Eyva request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a small connection issue. Could you repeat that or try again?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full bg-[#FAF8F5] overflow-hidden">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">

        {/* Left Column: Chat Area */}
        <section className="lg:col-span-5 flex flex-col bg-white border-r border-[#EBE3D5] h-full overflow-hidden">
          {/* Chat Header */}
          <div className="bg-[#FAF6EE] border-b border-[#EBE3D5] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/eyva 1.png"
                alt="Eyva Logo"
                className="h-10 w-10 rounded-full object-cover border border-[#EBE3D5] bg-white shadow-3xs"
              />
              <div>
                <h1 className="font-bold text-gray-900 text-base leading-tight flex items-center gap-1.5">
                  Eyva <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF9EC] text-[#9A720C] border border-[#F3EAD9] font-medium">Assistant</span>
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">EstateGold Personal Property Consultant</p>
              </div>
            </div>
            {/* Return to Home Link */}
            <Link
              href="/"
              className="text-xs font-bold text-[#9A720C] hover:text-[#805F0A] flex items-center gap-1.5 bg-white border border-[#EBE3D5] px-3 py-1.5 rounded-xl transition-all shadow-3xs"
            >
              <Home size={14} className="text-[#9A720C]" />
              <span>Return Home</span>
            </Link>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
              >
                <div className="flex flex-col space-y-1.5 w-full max-w-[90%] md:max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-3xs ${msg.role === "user"
                        ? "bg-[#9A720C] text-white rounded-br-none self-end"
                        : "bg-[#FAF6EE] text-gray-800 border border-[#EBE3D5] rounded-bl-none self-start"
                      }`}
                  >
                    <p className="whitespace-pre-line font-medium">{msg.content}</p>
                  </div>

                  {msg.role === "assistant" && idx === messages.length - 1 && matchingProperties.length > 0 && (
                    <div className="mt-3 w-full lg:hidden space-y-3 animate-in fade-in duration-300 text-left border border-[#EBE3D5] p-4 bg-white rounded-2xl">
                      <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-2">
                        <span className="text-[11px] font-black uppercase text-[#9A720C] tracking-wider">Matching Properties</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#9A720C] text-white font-bold">{matchingProperties.length} Found</span>
                      </div>
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {matchingProperties.map((property) => (
                          <div key={property._id} className="w-full">
                            <PropertyCard property={property} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#FAF6EE] border border-[#EBE3D5] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-[#9A720C] rounded-full animate-bounce duration-300" />
                  <div className="h-2 w-2 bg-[#9A720C] rounded-full animate-bounce duration-300 delay-150" />
                  <div className="h-2 w-2 bg-[#9A720C] rounded-full animate-bounce duration-300 delay-300" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Dynamic Suggestion Chips */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-3 bg-[#FAFBF9] border-t border-[#EBE3D5]">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(sug)}
                  disabled={loading}
                  className="text-xs font-bold text-[#9A720C] bg-[#FFF9EC] border border-[#F3EAD9] px-3.5 py-1.5 rounded-full hover:bg-[#9A720C] hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#EBE3D5] bg-white flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your preferences to Eyva..."
              disabled={loading}
              className="flex-1 border border-[#EBE3D5] bg-[#FAF8F5] rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#9A720C] focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#9A720C] hover:bg-[#805F0A] text-white p-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </section>

        {/* Right Column: Properties Results Area */}
        <section className="hidden lg:flex lg:col-span-7 flex flex-col bg-white h-full overflow-hidden">
          {/* Header Panel */}
          <div className="px-6 py-5 bg-[#FAF6EE] border-b border-[#EBE3D5] flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Home size={18} className="text-[#9A720C]" />
              <span>Matching Properties</span>
            </h2>
            {matchingProperties.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#9A720C] text-white font-bold">
                {matchingProperties.length} Found
              </span>
            )}
          </div>

          {/* Criteria Explanation block */}
          {activeExplanation && (
            <div className="bg-[#FFF9EC] border-b border-[#EBE3D5] px-6 py-4">
              <div className="flex items-start gap-2.5">
                <Sparkles size={16} className="text-[#9A720C] mt-0.5 shrink-0" />
                <div className="text-xs text-gray-700 font-medium whitespace-pre-line leading-relaxed">
                  {activeExplanation}
                </div>
              </div>
            </div>
          )}

          {/* Property Grid Results */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#FAFBF9]">
            {matchingProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingProperties.map((property) => (
                  <div key={property._id} className="h-full">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : messages.length > 1 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
                <div className="h-16 w-16 bg-[#FFF9EC] border border-[#F3EAD9] rounded-2xl flex items-center justify-center text-[#9A720C] mb-4 shadow-sm">
                  <Home size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">No matching properties available</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  I couldn't find any properties matching your exact specifications. You can try adjusting your requirements or asking me to search in other cities.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
                <img
                  src="/eyva 1.png"
                  alt="Eyva"
                  className="h-16 w-16 rounded-2xl object-cover border border-[#EBE3D5] bg-white mb-2 shadow-sm"
                />
                <div className="text-sm font-bold mb-4 tracking-wide">
                  <span className="text-[#B88A1A]">Ask </span>
                  <span className="text-[#1F2937]">Eyva</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Discover Properties Real-time</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Provide your budget, location, and requirements to Eyva. Matching verified properties will populate here dynamically as you chat.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Floating Compare Bar */}
      {session.properties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-[#ECE7DB] shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-6 max-w-4xl w-[90%] md:w-fit transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="h-6 px-2 rounded-full bg-[#FFF9EC] text-[#9A720C] text-xs font-black flex items-center justify-center border border-[#F4E3B5]">
              {session.properties.length}
            </span>
            <span className="text-xs font-black text-gray-800 uppercase tracking-wider hidden md:inline">
              Compare List
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {session.properties.map((p) => {
              const image = p.photos?.[0]
                ? (p.photos[0].startsWith("http") ? p.photos[0] : `http://localhost:5000/uploads/properties/${p.photos[0].replace(/^\/+/, "").replace(/^uploads\/properties\//, "").replace(/^uploads\//, "")}`)
                : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=80&q=80";
              return (
                <div key={p._id} className="relative group flex items-center gap-2 bg-[#FFFDF6] border border-[#F4E3B5] px-2 py-1.5 rounded-xl shadow-3xs hover:border-[#9A720C] transition-colors shrink-0">
                  <img src={image} className="w-8 h-8 object-cover rounded-lg border border-[#F4E3B5]" />
                  <div className="leading-tight max-w-[120px] truncate text-left">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block truncate">{p.propertyType}</span>
                    <span className="text-xs font-bold text-gray-900 block truncate">{p.bedrooms ? `${p.bedrooms} BHK` : ""} {p.locality || p.city}</span>
                  </div>
                  <button
                    onClick={() => removePropertyFromCompare(p._id)}
                    className="text-gray-400 hover:text-red-500 text-sm font-black ml-1.5 cursor-pointer bg-none border-none"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={clearCompareSession} className="text-xs font-bold text-gray-400 hover:text-red-500 cursor-pointer bg-none border-none">
              Clear All
            </button>
            <button
              onClick={() => {
                if (session.properties.length < 2) {
                  alert("Select at least 2 properties to compare.");
                  return;
                }
                router.push(`/properties/compare?ids=${session.properties.map(p => p._id).join(",")}`);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 ${session.properties.length >= 2
                ? "bg-[#9A720C] hover:bg-[#856108]"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Compare Now {session.properties.length >= 2 ? `(${session.properties.length})` : ""}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
