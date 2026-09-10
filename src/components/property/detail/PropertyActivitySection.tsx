"use client";

import React from "react";
import { Eye, MessageSquare, PhoneCall, Heart, Activity } from "lucide-react";

interface EngagementData {
  views: number;
  enquiries: number;
  contactOwner: number;
  shortlisted: number;
  isShortlisted?: boolean;
  period?: string;
}

interface Props {
  engagement: EngagementData | null;
}

export default function PropertyActivitySection({ engagement }: Props) {
  if (!engagement) return null;

  return (
    <section className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl p-5 sm:p-6 text-left shadow-3xs">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#ECE7DB]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] flex items-center justify-center text-[#9A720C] shrink-0 shadow-2xs">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              Property Activity
            </h3>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Based on activity in the last 30 days
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Views */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Views</span>
            <Eye size={14} className="text-[#9A720C]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {Number(engagement.views || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {Number(engagement.views || 0) === 1 ? "View" : "Views"}
            </span>
          </div>
        </div>

        {/* 2. Enquiries */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Enquiries</span>
            <MessageSquare size={14} className="text-[#0DBB58]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {Number(engagement.enquiries || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {Number(engagement.enquiries || 0) === 1 ? "Enquiry" : "Enquiries"}
            </span>
          </div>
        </div>

        {/* 3. Contact Owner */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Contact</span>
            <PhoneCall size={14} className="text-[#3B82F6]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {Number(engagement.contactOwner || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Contact Owner
            </span>
          </div>
        </div>

        {/* 4. Shortlisted */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Saved</span>
            <Heart size={14} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {Number(engagement.shortlisted || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Shortlisted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
