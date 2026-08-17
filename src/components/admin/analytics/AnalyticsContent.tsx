"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  Users,
  UserCheck,
  Clock,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Tag,
  Handshake,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { getAnalytics } from "@/src/services/adminPropertyService";

export default function AnalyticsContent() {
  const [range, setRange] = useState("30days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async (opts: { range: string; startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);
      const res = await getAnalytics(opts);
      if (res?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData({ range });
  }, [range]);

  const handleSelectPreset = (presetRange: string) => {
    setRange(presetRange);
    setShowDatePicker(false);
    fetchAnalyticsData({ range: presetRange });
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    setRange("custom");
    setShowDatePicker(false);
    fetchAnalyticsData({ range: "custom", startDate: customStart, endDate: customEnd });
  };

  const dateRangeDisplayLabel = () => {
    if (data?.startDate && data?.endDate) {
      const s = new Date(data.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const e = new Date(data.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${s} - ${e}`;
    }

    const now = new Date();
    if (range === "lastMonth") {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else if (range === "thisMonth") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - Today`;
    }

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return `${thirtyDaysAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const handleExport = () => {
    const activeData = data || {};
    const kpis = activeData.kpis || {};

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvLines: string[] = [];

    // Title & Header Info
    csvLines.push(`${escapeCsv("ESTATEGOLD ANALYTICS REPORT")}`);
    csvLines.push(`${escapeCsv(`Range: ${range}`)},${escapeCsv(`Generated: ${new Date().toLocaleString()}`)}`);
    csvLines.push("");

    // Section 1: KPI Summary
    csvLines.push(`${escapeCsv("1. KEY PERFORMANCE INDICATORS (KPIs)")}`);
    csvLines.push(`${escapeCsv("Metric")},${escapeCsv("Value")},${escapeCsv("Trend")}`);
    csvLines.push(`${escapeCsv("Total Properties")},${escapeCsv(kpis.totalProperties?.value ?? 0)},${escapeCsv(kpis.totalProperties?.trend ?? "0.0%")}`);
    csvLines.push(`${escapeCsv("Active Listings")},${escapeCsv(kpis.activeListings?.value ?? 0)},${escapeCsv(kpis.activeListings?.trend ?? "0.0%")}`);
    csvLines.push(`${escapeCsv("Total Users")},${escapeCsv(kpis.totalUsers?.value ?? 0)},${escapeCsv(kpis.totalUsers?.trend ?? "0.0%")}`);
    csvLines.push(`${escapeCsv("Total Agents")},${escapeCsv(kpis.totalAgents?.value ?? 0)},${escapeCsv(kpis.totalAgents?.trend ?? "0.0%")}`);
    csvLines.push(`${escapeCsv("Pending Requests")},${escapeCsv(kpis.pendingRequests?.value ?? 0)},${escapeCsv(kpis.pendingRequests?.trend ?? "0.0%")}`);
    csvLines.push("");

    // Section 2: Properties by Service Area
    csvLines.push(`${escapeCsv("2. PROPERTIES BY SERVICE AREA")}`);
    csvLines.push(`${escapeCsv("Service Area")},${escapeCsv("Total Properties")},${escapeCsv("Active")},${escapeCsv("Sold")},${escapeCsv("Available")}`);
    const areas = activeData.serviceAreaStats || [];
    areas.forEach((row: any) => {
      csvLines.push(`${escapeCsv(row.serviceArea)},${escapeCsv(row.totalProperties)},${escapeCsv(row.active)},${escapeCsv(row.sold)},${escapeCsv(row.available)}`);
    });
    csvLines.push("");

    // Section 3: Properties by Type
    csvLines.push(`${escapeCsv("3. PROPERTIES BY TYPE")}`);
    csvLines.push(`${escapeCsv("Property Type")},${escapeCsv("Count")},${escapeCsv("Percentage")}`);
    const types = activeData.propertiesByType || [];
    types.forEach((row: any) => {
      csvLines.push(`${escapeCsv(row.name)},${escapeCsv(row.value)},${escapeCsv(`${row.percentage}%`)}`);
    });
    csvLines.push("");

    // Section 4: Users by Role
    csvLines.push(`${escapeCsv("4. USERS BY ROLE")}`);
    csvLines.push(`${escapeCsv("Role")},${escapeCsv("User Count")},${escapeCsv("Percentage")}`);
    const roles = activeData.usersByRole || [];
    roles.forEach((row: any) => {
      csvLines.push(`${escapeCsv(row.role)},${escapeCsv(row.count)},${escapeCsv(`${row.percentage}%`)}`);
    });
    csvLines.push("");

    // Section 5: Buy vs Rent
    csvLines.push(`${escapeCsv("5. BUY VS RENT")}`);
    csvLines.push(`${escapeCsv("Purpose")},${escapeCsv("Property Count")},${escapeCsv("Percentage")}`);
    const buyRent = activeData.buyVsRent || [];
    buyRent.forEach((row: any) => {
      csvLines.push(`${escapeCsv(row.name)},${escapeCsv(row.count)},${escapeCsv(`${row.percentage}%`)}`);
    });
    csvLines.push("");

    // Section 6: Monthly Overview
    csvLines.push(`${escapeCsv("6. MONTHLY OVERVIEW")}`);
    csvLines.push(`${escapeCsv("Month")},${escapeCsv("Properties Added")},${escapeCsv("Properties Sold")},${escapeCsv("Properties Rented")}`);
    const monthly = activeData.monthlyOverview || [];
    monthly.forEach((row: any) => {
      csvLines.push(`${escapeCsv(row.month)},${escapeCsv(row.added)},${escapeCsv(row.sold)},${escapeCsv(row.rented)}`);
    });

    const csvContent = "\uFEFF" + csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.setAttribute("download", `EstateGold_Analytics_Report_${range}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  const kpis = data?.kpis;
  const listingTrends = data?.listingTrends || [];
  const totalAdded = listingTrends.reduce((sum: number, item: any) => sum + (item.added || 0), 0);
  const totalSold = listingTrends.reduce((sum: number, item: any) => sum + (item.sold || 0), 0);
  const totalRented = listingTrends.reduce((sum: number, item: any) => sum + (item.rented || 0), 0);
  const totalRemoved = listingTrends.reduce((sum: number, item: any) => sum + (item.removed || 0), 0);
  const propertiesByType = data?.propertiesByType || [];
  const serviceAreaStats = data?.serviceAreaStats || [];
  const usersByRole = data?.usersByRole || [];
  const buyVsRent = data?.buyVsRent || [];
  const recentActivities = data?.recentActivities || [];
  const monthlyOverview = data?.monthlyOverview || [];

  // Helper for Pie Charts when values are 0 so donut ring ALWAYS renders
  const getPieChartData = (arr: any[], valueKey: string) => {
    if (!arr || arr.length === 0) return [];
    const hasNonZero = arr.some((item) => (item[valueKey] || 0) > 0);
    if (hasNonZero) return arr;
    return arr.map((item) => ({ ...item, [valueKey]: 1 }));
  };

  // Colors matching EstateGold palette
  const TYPE_COLORS = ["#D4B04C", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444"];
  const ROLE_COLORS = ["#D4B04C", "#3B82F6", "#8B5CF6"];
  const PURPOSE_COLORS = ["#D4B04C", "#10B981"];

  return (
    <div className="space-y-6 sm:space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#161616] tracking-tight">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track your platform performance and insights
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center relative">
          {/* Interactive Date Range Selector Button & Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 bg-white hover:bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#ECE7DB] text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer"
            >
              <Calendar size={15} className="text-[#C89B1C]" />
              <span>{dateRangeDisplayLabel()}</span>
              <span className="text-[10px] text-gray-400">▾</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-11 z-50 bg-white rounded-2xl border border-[#ECE7DB] shadow-2xl p-4 min-w-[280px] space-y-3 animate-in fade-in zoom-in duration-150">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Date Range
                </p>

                <div className="space-y-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("lastMonth")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold transition-colors flex items-center justify-between cursor-pointer ${range === "lastMonth" ? "bg-[#FFF9EC] text-[#9A720C]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <span>📆 Past Month (Last Month)</span>
                    {range === "lastMonth" && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("thisMonth")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer ${range === "thisMonth" ? "bg-[#FFF9EC] text-[#9A720C]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <span>📅 This Month</span>
                    {range === "thisMonth" && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("30days")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer ${range === "30days" ? "bg-[#FFF9EC] text-[#9A720C]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <span>⚡ Last 30 Days</span>
                    {range === "30days" && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("3months")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer ${range === "3months" ? "bg-[#FFF9EC] text-[#9A720C]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <span>📊 Last 3 Months</span>
                    {range === "3months" && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("6months")}
                    className={`w-full text-left px-3 py-2 rounded-xl font-semibold transition-colors flex items-center justify-between cursor-pointer ${range === "6months" ? "bg-[#FFF9EC] text-[#9A720C]" : "hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <span>📈 Last 6 Months</span>
                    {range === "6months" && <span className="text-xs">✓</span>}
                  </button>
                </div>

                {/* Custom Date Range Inputs */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <p className="text-[11px] font-bold text-gray-500">Custom Date Range</p>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-400 font-medium">Start Date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-1.5 outline-none focus:border-[#C89B1C]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-medium">End Date</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-1.5 outline-none focus:border-[#C89B1C]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCustom}
                      className="w-full py-1.5 mt-1 rounded-xl bg-[#9A720C] text-white font-bold text-xs hover:bg-[#8C6605] transition-colors cursor-pointer"
                    >
                      Apply Custom Range
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Report CTA */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 bg-white hover:bg-[#FAF8F5] text-[#8C6605] border border-[#D4B04C]/50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download size={15} className="text-[#C89B1C]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Cards (5 compact cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Properties */}
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Properties</span>
            <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] text-[#9A720C] flex items-center justify-center border border-[#F5E8C7]">
              <Home size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">
              {loading ? "..." : kpis?.totalProperties?.value ?? 0}
            </h2>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${kpis?.totalProperties?.isUp ? "text-emerald-600" : "text-rose-600"}`}>
              {kpis?.totalProperties?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpis?.totalProperties?.trend ?? "0.0%"}</span>
              <span className="text-gray-400 font-normal ml-0.5">from previous period</span>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Listings</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Building2 size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">
              {loading ? "..." : kpis?.activeListings?.value ?? 0}
            </h2>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${kpis?.activeListings?.isUp ? "text-emerald-600" : "text-rose-600"}`}>
              {kpis?.activeListings?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpis?.activeListings?.trend ?? "0.0%"}</span>
              <span className="text-gray-400 font-normal ml-0.5">from previous period</span>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Users</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">
              {loading ? "..." : kpis?.totalUsers?.value ?? 0}
            </h2>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${kpis?.totalUsers?.isUp ? "text-emerald-600" : "text-rose-600"}`}>
              {kpis?.totalUsers?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpis?.totalUsers?.trend ?? "0.0%"}</span>
              <span className="text-gray-400 font-normal ml-0.5">from previous period</span>
            </div>
          </div>
        </div>

        {/* Total Agents */}
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Agents</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <UserCheck size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">
              {loading ? "..." : kpis?.totalAgents?.value ?? 0}
            </h2>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${kpis?.totalAgents?.isUp ? "text-emerald-600" : "text-rose-600"}`}>
              {kpis?.totalAgents?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpis?.totalAgents?.trend ?? "0.0%"}</span>
              <span className="text-gray-400 font-normal ml-0.5">from previous period</span>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl border border-[#ECE7DB] p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Pending Requests</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#161616]">
              {loading ? "..." : kpis?.pendingRequests?.value ?? 0}
            </h2>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${kpis?.pendingRequests?.isUp ? "text-[#C89B1C]" : "text-emerald-600"}`}>
              {kpis?.pendingRequests?.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpis?.pendingRequests?.trend ?? "0.0%"}</span>
              <span className="text-gray-400 font-normal ml-0.5">from previous period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Property Listings Trend (Line Chart) + Properties by Type (Donut) + Properties by Service Area (Table) */}
      <div className="grid grid-cols-12 gap-6">
        {/* 2. Property Listings Trend (Stacked Area Charts - 5 Cols on desktop) */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#161616]">Property Listings Trend</h3>

            {/* Time range filter */}
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-xs bg-[#FAFAF8] border border-[#E8E1D4] rounded-lg px-2.5 py-1 text-gray-700 outline-none focus:border-[#C89B1C] cursor-pointer font-medium"
            >
              <option value="today">Today</option>
              <option value="7days">7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col justify-between space-y-4">
            {loading ? (
              <div className="h-[320px] flex items-center justify-center text-xs text-gray-400">
                Loading trend analytics...
              </div>
            ) : (
              <>
                {/* 1. Properties Added */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0">
                  <div className="flex items-center gap-3.5 w-40 shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] flex items-center justify-center shrink-0 relative">
                      <Home size={18} className="text-[#D4B04C]" />
                      <span className="absolute -bottom-1 -right-1 bg-[#D4B04C] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold border border-white shrink-0">
                        +
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 leading-tight">Properties Added</span>
                      <span className="block text-xl font-black text-[#D4B04C] mt-0.5">
                        {totalAdded}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 h-[72px] pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={listingTrends}
                        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorAddedRow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4B04C" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#D4B04C" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F8F8F6" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            borderRadius: "8px",
                            border: "1px solid #ECE7DB",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="added"
                          stroke="#D4B04C"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAddedRow)"
                          dot={{ r: 2.5, fill: "#D4B04C", stroke: "#D4B04C", strokeWidth: 0 }}
                          activeDot={{ r: 4.5, strokeWidth: 0 }}
                          name="Added"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Properties Sold */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3.5 w-40 shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center shrink-0">
                      <Handshake size={18} className="text-[#10B981]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 leading-tight">Properties Sold</span>
                      <span className="block text-xl font-black text-[#10B981] mt-0.5">
                        {totalSold}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 h-[72px] pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={listingTrends}
                        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorSoldRow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F8F8F6" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            borderRadius: "8px",
                            border: "1px solid #ECE7DB",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sold"
                          stroke="#10B981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSoldRow)"
                          dot={{ r: 2.5, fill: "#10B981", stroke: "#10B981", strokeWidth: 0 }}
                          activeDot={{ r: 4.5, strokeWidth: 0 }}
                          name="Sold"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Properties Rented */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3.5 w-40 shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center shrink-0 relative">
                      <Home size={18} className="text-[#3B82F6]" />
                      <span className="absolute -bottom-1 -right-1 bg-[#3B82F6] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold border border-white shrink-0">
                        🔑
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 leading-tight">Properties Rented</span>
                      <span className="block text-xl font-black text-[#3B82F6] mt-0.5">
                        {totalRented}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 h-[72px] pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={listingTrends}
                        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorRentedRow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F8F8F6" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            borderRadius: "8px",
                            border: "1px solid #ECE7DB",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="rented"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRentedRow)"
                          dot={{ r: 2.5, fill: "#3B82F6", stroke: "#3B82F6", strokeWidth: 0 }}
                          activeDot={{ r: 4.5, strokeWidth: 0 }}
                          name="Rented"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Properties Removed */}
                <div className="flex items-center justify-between py-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3.5 w-40 shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center shrink-0">
                      <Trash2 size={18} className="text-[#EF4444]" />
                    </div>
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 leading-tight">Properties Removed</span>
                      <span className="block text-xl font-black text-[#EF4444] mt-0.5">
                        {totalRemoved}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 h-[72px] pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={listingTrends}
                        margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorRemovedRow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F8F8F6" vertical={false} />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: "#9CA3AF" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            borderRadius: "8px",
                            border: "1px solid #ECE7DB",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="removed"
                          stroke="#EF4444"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRemovedRow)"
                          dot={{ r: 2.5, fill: "#EF4444", stroke: "#EF4444", strokeWidth: 0 }}
                          activeDot={{ r: 4.5, strokeWidth: 0 }}
                          name="Removed"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Properties by Type (Donut Chart - 3 Cols on desktop) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#161616] mb-2">Properties by Type</h3>

          <div className="relative h-[180px] w-full flex items-center justify-center">
            {loading ? (
              <div className="text-xs text-gray-400">Loading donut chart...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData(propertiesByType, "value")}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {propertiesByType.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Count */}
                <div className="absolute text-center pointer-events-none">
                  <span className="block text-lg font-bold text-[#161616]">
                    {data?.totalPropertiesCount ?? 0}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium">Total</span>
                </div>
              </>
            )}
          </div>

          {/* Donut Side Legend */}
          <div className="space-y-1.5 text-xs pt-3 border-t border-gray-100">
            {propertiesByType.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between font-medium">
                <div className="flex items-center gap-2 text-gray-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: TYPE_COLORS[idx % TYPE_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">{item.percentage ?? 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Properties by Service Area (Table - 4 Cols on desktop) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#161616]">Properties by Service Area</h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-2">Service Area</th>
                  <th className="pb-2 text-right">Properties</th>
                  <th className="pb-2 text-right">Active</th>
                  <th className="pb-2 text-right">Sold</th>
                  <th className="pb-2 text-right">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {serviceAreaStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-400 text-xs">
                      No service areas configured
                    </td>
                  </tr>
                ) : (
                  serviceAreaStats.slice(0, 5).map((row: any) => (
                    <tr key={row.serviceArea} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 font-semibold text-gray-900">{row.serviceArea}</td>
                      <td className="py-2.5 text-right font-medium text-gray-700">{row.totalProperties}</td>
                      <td className="py-2.5 text-right font-medium text-emerald-600">{row.active}</td>
                      <td className="py-2.5 text-right font-medium text-gray-500">{row.sold}</td>
                      <td className="py-2.5 text-right font-medium text-gray-800">{row.available}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-2 text-center">
            <Link
              href="/admin/locations"
              className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] text-[#9A720C] hover:text-[#8C6605] text-xs font-bold transition-all"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Users by Role (Donut) + Buy vs Rent (Donut) + Recent Activity (List Panel) */}
      <div className="grid grid-cols-12 gap-6">
        {/* 5. Users by Role (Donut Chart - 4 Cols) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#161616] mb-2">Users by Role</h3>

          <div className="relative h-[180px] w-full flex items-center justify-center">
            {loading ? (
              <div className="text-xs text-gray-400">Loading role breakdown...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData(usersByRole, "count")}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {usersByRole.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute text-center pointer-events-none">
                  <span className="block text-lg font-bold text-[#161616]">
                    {data?.totalUsersCount ?? 0}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium">Total Users</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
            {usersByRole.map((item: any, idx: number) => (
              <div key={item.role} className="flex items-center justify-between font-medium">
                <div className="flex items-center gap-2 text-gray-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ROLE_COLORS[idx % ROLE_COLORS.length] }}
                  />
                  <span>{item.role}</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {(item.count ?? 0).toLocaleString()} ({item.percentage ?? 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Buy vs Rent (Donut Chart - 4 Cols) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#161616] mb-2">Buy vs Rent</h3>

          <div className="relative h-[180px] w-full flex items-center justify-center">
            {loading ? (
              <div className="text-xs text-gray-400">Loading buy vs rent...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData(buyVsRent, "count")}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {buyVsRent.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={PURPOSE_COLORS[index % PURPOSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute text-center pointer-events-none">
                  <span className="block text-lg font-bold text-[#161616]">
                    {data?.totalPropertiesCount ?? 0}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-medium">Total</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
            {buyVsRent.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between font-medium">
                <div className="flex items-center gap-2 text-gray-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PURPOSE_COLORS[idx % PURPOSE_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {item.percentage ?? 0}% ({item.count ?? 0})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Recent Activity (Feed Panel - 4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-[#ECE7DB] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#161616]">Recent Activity</h3>
            <span className="text-xs font-semibold text-[#9A720C] hover:underline cursor-pointer">
              View All
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {recentActivities.length === 0 ? (
              <div className="text-xs text-gray-400 py-6 text-center">
                No recent activity recorded
              </div>
            ) : (
              recentActivities.slice(0, 5).map((act: any) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="h-8 w-8 rounded-xl bg-[#FFF9EC] border border-[#F5E8C7] text-[#9A720C] flex items-center justify-center shrink-0 mt-0.5">
                    {act.type === "property_listed" ? (
                      <Home size={15} />
                    ) : act.type === "agent_approved" ? (
                      <UserCheck size={15} className="text-emerald-600" />
                    ) : act.type === "role_requested" ? (
                      <FileText size={15} className="text-blue-600" />
                    ) : (
                      <Tag size={15} className="text-amber-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-gray-900 truncate">{act.title}</p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                        {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{act.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 4: 8. Monthly Overview (Last 6 Months) (Grouped Bar Chart - Full Width) */}
      <div className="bg-white rounded-2xl border border-[#ECE7DB] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#161616]">Monthly Overview (Last 6 Months)</h3>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#D4B04C]"></span>
              <span>Properties Added</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#10B981]"></span>
              <span>Properties Sold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#3B82F6]"></span>
              <span>Properties Rented</span>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Loading monthly overview chart...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyOverview} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="added" fill="#D4B04C" radius={[4, 4, 0, 0]} maxBarSize={32} name="Added" />
                <Bar dataKey="sold" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} name="Sold" />
                <Bar dataKey="rented" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} name="Rented" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
