"use client";

import React, { useMemo } from "react";
import {
  Eye,
  MessageSquare,
  PhoneCall,
  Heart,
  Activity,
  Flame,
  Zap,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

export interface DemandInfo {
  score: number;
  totalInteractions: number;
  level: "VERY_HIGH" | "MODERATE" | "STEADY" | "LOW";
  label: string;
  color: "rose" | "amber" | "emerald" | "slate";
  percentage: number;
  description: string;
}

export interface EngagementData {
  views: number;
  enquiries: number;
  contactOwner: number;
  shortlisted: number;
  isShortlisted?: boolean;
  period?: string;
  demand?: DemandInfo;
}

interface Props {
  engagement: EngagementData | null;
}

export function computeClientDemand(
  views = 0,
  enquiries = 0,
  contactOwner = 0,
  shortlisted = 0
): DemandInfo {
  const v = Math.max(0, Number(views) || 0);
  const e = Math.max(0, Number(enquiries) || 0);
  const c = Math.max(0, Number(contactOwner) || 0);
  const s = Math.max(0, Number(shortlisted) || 0);

  const totalInteractions = v + e + c + s;
  const score = v * 1 + s * 3 + e * 5 + c * 6;

  if (score >= 25 || e + c >= 4 || v >= 50) {
    const percentage = Math.min(98, Math.max(76, 75 + Math.floor(score / 3)));
    return {
      score,
      totalInteractions,
      level: "VERY_HIGH",
      label: "High Demand",
      color: "rose",
      percentage,
      description:
        "High buyer interest! This property is receiving frequent enquiries & direct owner contact actions.",
    };
  }

  if (score >= 12 || e + c >= 1 || s >= 3 || v >= 15) {
    const percentage = Math.min(75, Math.max(48, 45 + Math.floor(score * 1.5)));
    return {
      score,
      totalInteractions,
      level: "MODERATE",
      label: "Moderate Demand",
      color: "amber",
      percentage,
      description:
        "Active interest with steady buyer engagement and interactions over the last 30 days.",
    };
  }

  if (score >= 4 || v >= 5 || s >= 1) {
    const percentage = Math.min(47, Math.max(25, 25 + score * 2));
    return {
      score,
      totalInteractions,
      level: "STEADY",
      label: "Steady Demand",
      color: "emerald",
      percentage,
      description:
        "Growing buyer awareness with regular views and shortlisted interest recorded.",
    };
  }

  const percentage = Math.max(10, Math.min(24, score * 4 + 10));
  return {
    score,
    totalInteractions,
    level: "LOW",
    label: "Low Demand",
    color: "slate",
    percentage,
    description:
      "Newly listed or early period. An ideal window for prospective buyers to inquire early.",
  };
}

export default function PropertyActivitySection({ engagement }: Props) {
  if (!engagement) return null;

  const views = Number(engagement.views || 0);
  const enquiries = Number(engagement.enquiries || 0);
  const contactOwner = Number(engagement.contactOwner || 0);
  const shortlisted = Number(engagement.shortlisted || 0);

  const demand: DemandInfo = useMemo(() => {
    if (engagement.demand && engagement.demand.label) {
      return engagement.demand;
    }
    return computeClientDemand(views, enquiries, contactOwner, shortlisted);
  }, [engagement.demand, views, enquiries, contactOwner, shortlisted]);

  // Color & badge styling configs
  const badgeConfig = {
    VERY_HIGH: {
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      dotBg: "bg-rose-500",
      pingBg: "bg-rose-400",
      icon: <Flame size={14} className="text-rose-600 animate-pulse shrink-0" />,
      barGradient: "from-amber-400 via-orange-500 to-rose-500",
      glowColor: "shadow-rose-100",
      textColor: "text-rose-700",
    },
    MODERATE: {
      badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
      dotBg: "bg-amber-500",
      pingBg: "bg-amber-400",
      icon: <Zap size={14} className="text-amber-600 shrink-0" />,
      barGradient: "from-yellow-400 via-amber-400 to-amber-500",
      glowColor: "shadow-amber-100",
      textColor: "text-amber-800",
    },
    STEADY: {
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotBg: "bg-emerald-500",
      pingBg: "bg-emerald-400",
      icon: <TrendingUp size={14} className="text-emerald-600 shrink-0" />,
      barGradient: "from-emerald-400 to-teal-500",
      glowColor: "shadow-emerald-100",
      textColor: "text-emerald-800",
    },
    LOW: {
      badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
      dotBg: "bg-slate-400",
      pingBg: "bg-slate-300",
      icon: <Sparkles size={14} className="text-slate-500 shrink-0" />,
      barGradient: "from-slate-300 to-slate-400",
      glowColor: "shadow-slate-100",
      textColor: "text-slate-700",
    },
  }[demand.level] || {
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotBg: "bg-slate-400",
    pingBg: "bg-slate-300",
    icon: <Sparkles size={14} className="text-slate-500 shrink-0" />,
    barGradient: "from-slate-300 to-slate-400",
    glowColor: "shadow-slate-100",
    textColor: "text-slate-700",
  };

  return (
    <section className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-2xl p-5 sm:p-6 text-left shadow-3xs">
      {/* Header with Title & Demand Indicator Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#ECE7DB]">
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

        {/* Live Demand Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold shadow-2xs ${badgeConfig.badgeBg}`}
          title={`Demand Level: ${demand.label} (${demand.percentage}% Activity Index)`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeConfig.pingBg}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${badgeConfig.dotBg}`}
            />
          </span>
          {badgeConfig.icon}
          <span>{demand.label}</span>
        </div>
      </div>

      {/* 4 Activity Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Views */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D8B56A] transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Views
            </span>
            <Eye size={14} className="text-[#9A720C]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {views.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {views === 1 ? "View" : "Views"}
            </span>
          </div>
        </div>

        {/* 2. Enquiries */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D8B56A] transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Enquiries
            </span>
            <MessageSquare size={14} className="text-[#0DBB58]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {enquiries.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {enquiries === 1 ? "Enquiry" : "Enquiries"}
            </span>
          </div>
        </div>

        {/* 3. Contact Owner */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D8B56A] transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </span>
            <PhoneCall size={14} className="text-[#3B82F6]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {contactOwner.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Contact Owner
            </span>
          </div>
        </div>

        {/* 4. Shortlisted */}
        <div className="bg-white border border-[#ECE7DB] rounded-xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-[#D8B56A] transition-colors">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Saved
            </span>
            <Heart size={14} className="text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {shortlisted.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Shortlisted
            </span>
          </div>
        </div>
      </div>

      {/* Demand Indicator Meter & Insight Section */}
      <div className="mt-4 pt-4 border-t border-[#ECE7DB] bg-white border border-[#ECE7DB] rounded-xl p-4 shadow-2xs">
        {/* Demand Meter Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9A720C]"></span>
              Demand Indicator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700">
              Activity Score:
            </span>
            <span
              className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${badgeConfig.badgeBg}`}
            >
              {demand.percentage}% ({demand.label})
            </span>
          </div>
        </div>

        {/* Progress / Demand Meter Gauge */}
        <div className="space-y-1.5 my-2.5">
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/70">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${badgeConfig.barGradient} transition-all duration-700 ease-out shadow-xs`}
              style={{ width: `${Math.max(8, demand.percentage)}%` }}
            />
          </div>

          {/* 4 Tier Labels */}
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-0.5">
            <span
              className={
                demand.level === "LOW" ? "text-slate-800 font-bold" : ""
              }
            >
              Low
            </span>
            <span
              className={
                demand.level === "STEADY" ? "text-emerald-700 font-bold" : ""
              }
            >
              Steady
            </span>
            <span
              className={
                demand.level === "MODERATE" ? "text-amber-700 font-bold" : ""
              }
            >
              Moderate
            </span>
            <span
              className={
                demand.level === "VERY_HIGH" ? "text-rose-700 font-bold" : ""
              }
            >
              High
            </span>
          </div>
        </div>

        {/* Summary Description & Insight */}
        <div className="mt-3 pt-2.5 border-t border-dashed border-[#ECE7DB] flex items-start gap-2 text-xs text-gray-600">
          <Info size={15} className="text-[#9A720C] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-gray-700 leading-relaxed">
              {demand.description}
            </p>
            <p className="text-[11px] text-gray-400">
              Demand index is dynamically evaluated from views ({views}), saves ({shortlisted}), enquiries ({enquiries}), and owner contacts ({contactOwner}).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
