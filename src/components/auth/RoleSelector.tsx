"use client";

import { motion } from "framer-motion";
import { Home, ShieldCheck, Check } from "lucide-react";

interface Props {
  role: string;
  setRole: (role: string) => void;
}

export default function RoleSelector({ role, setRole }: Props) {
  // Map "seller" or "buyer" to "seller" (Member / Owner)
  const isMember = role === "seller" || role === "buyer";
  const isAgent = role === "agent";

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        I am registering as
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Buyer / Seller / Owner */}
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRole("seller")}
          className={`
            p-5
            rounded-2xl
            border-2
            text-left
            transition-all
            duration-300
            cursor-pointer
            relative
            flex
            flex-col
            justify-between
            h-full
            ${
              isMember
                ? "border-[#C89B1C] bg-[#FFFBF0] shadow-md ring-1 ring-[#C89B1C]/30"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            }
          `}
        >
          <div>
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isMember ? "bg-[#C89B1C]/15 text-[#C89B1C]" : "bg-gray-100 text-gray-500"
              }`}
            >
              <Home size={22} />
            </div>

            <h4 className="font-bold text-base text-[#171412] mb-1">
              Buyer / Seller / Owner
            </h4>

            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              I want to buy, rent, or list my own property
            </p>

            <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-[#C89B1C] shrink-0" />
                <span>Browse & enquire about properties</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-[#C89B1C] shrink-0" />
                <span>List your own property for free</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={14} className="text-[#C89B1C] shrink-0" />
                <span>No brokerage fees</span>
              </li>
            </ul>
          </div>
        </motion.button>

        {/* Card 2: Agent / Broker */}
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setRole("agent")}
          className={`
            p-5
            rounded-2xl
            border-2
            text-left
            transition-all
            duration-300
            cursor-pointer
            relative
            flex
            flex-col
            justify-between
            h-full
            ${
              isAgent
                ? "border-[#C89B1C] bg-[#FFFBF0] shadow-md ring-1 ring-[#C89B1C]/30"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            }
          `}
        >
          <div>
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isAgent ? "bg-[#C89B1C]/15 text-[#C89B1C]" : "bg-gray-100 text-gray-500"
              }`}
            >
              <ShieldCheck size={22} />
            </div>

            <h4 className="font-bold text-base text-[#171412] mb-1">
              Agent / Broker
            </h4>

            <p className="text-xs text-gray-500 leading-relaxed">
              I manage or list properties professionally for clients
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}