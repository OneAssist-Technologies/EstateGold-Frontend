"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calculator,
  Info,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  PieChart,
  TrendingUp,
  CheckCircle2,
  Building2,
  Percent,
  Wallet,
  Sparkles,
} from "lucide-react";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import LoanEnquiryModal from "@/src/components/loan/LoanEnquiryModal";
import {
  calculateHomeLoanEMI,
  formatIndianCurrency,
  formatAbbreviatedCurrency,
} from "@/src/utils/emiCalculator";

function EmiCalculatorContent() {
  const searchParams = useSearchParams();
  const rawPriceParam = searchParams.get("price") || searchParams.get("amount");

  // Prevent minus sign ('-') and exponent ('e' / 'E') from being typed
  const preventNegativeKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  // Determine initial total property price from URL or default ₹62,50,000
  const initialPropertyPrice = useMemo(() => {
    if (!rawPriceParam) return 6250000;
    const parsed = parseFloat(rawPriceParam);
    if (!isNaN(parsed) && parsed > 0) {
      return Math.round(Math.max(0, parsed));
    }
    return 6250000;
  }, [rawPriceParam]);

  // Total Property Amount state
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPropertyPrice);
  const [propertyPriceInput, setPropertyPriceInput] = useState<string>(initialPropertyPrice.toString());

  // Down Payment percentage (default 20%)
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);

  // Loan Amount, Interest Rate, and Tenure
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(initialPropertyPrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  // String input states for smooth text editing
  const [loanAmountInput, setLoanAmountInput] = useState<string>(
    Math.round(initialPropertyPrice * 0.8).toString()
  );
  const [interestRateInput, setInterestRateInput] = useState<string>("8.5");
  const [tenureYearsInput, setTenureYearsInput] = useState<string>("20");

  // Loan Enquiry Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Sync loan amount when property price or down payment percentage changes
  const handlePropertyPriceChange = (newPrice: number) => {
    const validPrice = Math.max(0, isNaN(newPrice) ? 0 : newPrice);
    setPropertyPrice(validPrice);
    setPropertyPriceInput(validPrice.toString());
    const newLoan = Math.round(validPrice * ((100 - downPaymentPercent) / 100));
    setLoanAmount(newLoan);
    setLoanAmountInput(newLoan.toString());
  };

  // Sync when selecting a specific Loan Option (e.g. 80%, 85%, 90%, 100%)
  const handleSelectLoanOption = (ltvPercentage: number) => {
    const downPercent = 100 - ltvPercentage;
    setDownPaymentPercent(downPercent);
    const newLoan = Math.round(propertyPrice * (ltvPercentage / 100));
    setLoanAmount(newLoan);
    setLoanAmountInput(newLoan.toString());
  };

  // Sync inputs when state updates
  useEffect(() => {
    setLoanAmountInput(loanAmount.toString());
  }, [loanAmount]);

  useEffect(() => {
    setInterestRateInput(interestRate.toString());
  }, [interestRate]);

  useEffect(() => {
    setTenureYearsInput(tenureYears.toString());
  }, [tenureYears]);

  // Computed Down Payment amount
  const downPaymentAmount = useMemo(() => {
    return Math.max(0, propertyPrice - loanAmount);
  }, [propertyPrice, loanAmount]);

  // LTV (Loan-To-Value) percentage
  const currentLtvPercentage = useMemo(() => {
    if (!propertyPrice || propertyPrice <= 0) return 100;
    return Math.min(100, Math.max(0, (loanAmount / propertyPrice) * 100));
  }, [loanAmount, propertyPrice]);

  // Dynamic EMI calculation
  const result = useMemo(() => {
    return calculateHomeLoanEMI(loanAmount, interestRate, tenureYears);
  }, [loanAmount, interestRate, tenureYears]);

  // Percentages for Donut chart
  const principalPercentage = useMemo(() => {
    if (!result.totalPayment || result.totalPayment <= 0) return 100;
    return Math.min(100, Math.max(0, (result.principal / result.totalPayment) * 100));
  }, [result]);

  const interestPercentage = useMemo(() => {
    if (!result.totalPayment || result.totalPayment <= 0) return 0;
    return Math.min(100, Math.max(0, (result.totalInterest / result.totalPayment) * 100));
  }, [result]);

  // Handle direct text box inputs with strict non-negative sanitization
  const handlePropertyPriceInputChange = (val: string) => {
    const cleanVal = val.replace(/[-eE]/g, "");
    setPropertyPriceInput(cleanVal);
    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      handlePropertyPriceChange(Math.max(0, num));
    }
  };

  const handleLoanAmountInputChange = (val: string) => {
    const cleanVal = val.replace(/[-eE]/g, "");
    setLoanAmountInput(cleanVal);
    const num = parseFloat(cleanVal.replace(/,/g, ""));
    if (!isNaN(num)) {
      setLoanAmount(Math.min(100000000, Math.max(0, num)));
    }
  };

  const handleInterestRateInputChange = (val: string) => {
    const cleanVal = val.replace(/[-eE]/g, "");
    setInterestRateInput(cleanVal);
    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      setInterestRate(Math.min(30, Math.max(0, num)));
    }
  };

  const handleTenureInputChange = (val: string) => {
    const cleanVal = val.replace(/[-eE]/g, "");
    setTenureYearsInput(cleanVal);
    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      setTenureYears(Math.min(30, Math.max(0, num)));
    }
  };

  const handleReset = () => {
    const defaultPrice = 6250000;
    setPropertyPrice(defaultPrice);
    setPropertyPriceInput(defaultPrice.toString());
    setDownPaymentPercent(20);
    setLoanAmount(5000000);
    setLoanAmountInput("5000000");
    setInterestRate(8.5);
    setTenureYears(20);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-gray-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Top Breadcrumb & Header */}
        <div className="space-y-3">
          <nav className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-gray-700 font-semibold">Home Loan EMI Calculator</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECE7DB] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[#FFF9EC] border border-[#E8DCC1] flex items-center justify-center text-[#9A720C] shadow-2xs">
                  <Calculator size={20} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  EstateGold Home Loan EMI Calculator
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                Calculate home loan EMIs, down payments, and loan options based on total property price.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-fit px-4 py-2 rounded-xl border border-gray-300 hover:border-[#9A720C] hover:bg-[#FFFDF6] text-xs font-semibold text-gray-700 hover:text-[#9A720C] flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
          </div>
        </div>

        {/* SECTION 1: Total Property Amount Banner & Loan Options */}
        <div className="bg-white border border-[#E8DCC1] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#9A720C]" />
                <h2 className="text-lg font-bold text-gray-900">Total Property Price & Loan Options</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Adjust property price and select loan options based on your down payment preference.
              </p>
            </div>

            {/* Total Property Price Display Box */}
            <div className="flex items-center gap-3 bg-[#FFFDF6] border border-[#E8DCC1] p-3 px-5 rounded-2xl shadow-3xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Property Price:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#9A720C] font-serif">
                {formatIndianCurrency(propertyPrice)}
              </span>
            </div>
          </div>

          {/* Property Price Input & Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 space-y-3">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                Total Property Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  onKeyDown={preventNegativeKeys}
                  value={propertyPriceInput}
                  onChange={(e) => handlePropertyPriceInputChange(e.target.value)}
                  className="w-full h-11 pl-8 pr-4 text-base font-bold text-gray-900 bg-[#FAF8F5] border border-[#ECE7DB] focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] rounded-xl outline-none transition-all"
                  placeholder="6250000"
                />
              </div>

              {/* Quick Property Price Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[3000000, 5000000, 7500000, 10000000, 15000000, 25000000].map((presetPrice) => (
                  <button
                    key={presetPrice}
                    type="button"
                    onClick={() => handlePropertyPriceChange(presetPrice)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      propertyPrice === presetPrice
                        ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#9A720C] hover:bg-[#FFF9EC]"
                    }`}
                  >
                    {formatAbbreviatedCurrency(presetPrice)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Property vs Loan Breakdown Metrics */}
            <div className="md:col-span-6 grid grid-cols-2 gap-3 p-4 bg-[#FAF8F5] border border-[#ECE7DB] rounded-2xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Down Payment ({ (100 - currentLtvPercentage).toFixed(0) }%)
                </span>
                <span className="text-base sm:text-lg font-bold text-green-700 mt-0.5 block">
                  {formatIndianCurrency(downPaymentAmount)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Upfront Payment</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Net Home Loan ({ currentLtvPercentage.toFixed(0) }%)
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#9A720C] mt-0.5 block">
                  {formatIndianCurrency(loanAmount)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Bank Financed</span>
              </div>
            </div>
          </div>

          {/* LOAN OPTIONS CARDS based on Property Amount */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#9A720C]" /> Select Recommended Loan Funding Option:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { ltv: 80, label: "80% Loan Option", desc: "Standard 20% Down Payment", tag: "Most Popular" },
                { ltv: 85, label: "85% Loan Option", desc: "15% Down Payment", tag: "Low Down Payment" },
                { ltv: 90, label: "90% Loan Option", desc: "10% Down Payment", tag: "Max Bank Loan" },
                { ltv: 100, label: "100% Loan Option", desc: "Full Value Funding", tag: "0% Down Payment" },
              ].map((opt) => {
                const optLoan = Math.round(propertyPrice * (opt.ltv / 100));
                const isSelected = Math.abs(currentLtvPercentage - opt.ltv) < 1;
                return (
                  <button
                    key={opt.ltv}
                    type="button"
                    onClick={() => handleSelectLoanOption(opt.ltv)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      isSelected
                        ? "bg-[#FFFDF6] border-[#9A720C] shadow-md ring-1 ring-[#9A720C]"
                        : "bg-white border-[#ECE7DB] hover:border-[#D4B04C] hover:bg-[#FFF9EC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold ${isSelected ? "text-[#9A720C]" : "text-gray-900"}`}>
                        {opt.label}
                      </span>
                      {opt.tag && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-[#9A720C] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {opt.tag}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {formatIndianCurrency(optLoan)}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: Main Calculator Inputs & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 bg-white border border-[#ECE7DB] rounded-[28px] p-6 sm:p-8 space-y-8 shadow-2xs">
            {/* Input 1: Loan Amount */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Wallet size={16} className="text-[#9A720C]" /> Loan Amount
                  <span className="text-[11px] font-normal text-gray-400">
                    (Financed Amount)
                  </span>
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={preventNegativeKeys}
                    value={loanAmountInput}
                    onChange={(e) => handleLoanAmountInputChange(e.target.value)}
                    className="w-full sm:w-44 h-10 pl-7 pr-3 text-sm font-bold text-gray-900 bg-[#FAF8F5] border border-[#ECE7DB] focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] rounded-xl outline-none transition-all text-right"
                    placeholder="5000000"
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={Math.max(50000000, propertyPrice)}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9A720C]"
              />

              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[2000000, 3500000, 5000000, 7500000, 10000000, 20000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLoanAmount(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      loanAmount === preset
                        ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#9A720C] hover:bg-[#FFF9EC]"
                    }`}
                  >
                    {formatAbbreviatedCurrency(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Interest Rate */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Percent size={16} className="text-[#9A720C]" /> Interest Rate
                  <span className="text-[11px] font-normal text-gray-400">
                    (% per annum)
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="25"
                    onKeyDown={preventNegativeKeys}
                    value={interestRateInput}
                    onChange={(e) => handleInterestRateInputChange(e.target.value)}
                    className="w-full sm:w-28 h-10 pl-3 pr-7 text-sm font-bold text-gray-900 bg-[#FAF8F5] border border-[#ECE7DB] focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] rounded-xl outline-none transition-all text-right"
                    placeholder="8.5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    %
                  </span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={20}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9A720C]"
              />

              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[7.5, 8.0, 8.5, 9.0, 9.5, 10.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setInterestRate(rate)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      interestRate === rate
                        ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#9A720C] hover:bg-[#FFF9EC]"
                    }`}
                  >
                    {rate}% p.a.
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Loan Tenure */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Calculator size={16} className="text-[#9A720C]" /> Loan Tenure
                  <span className="text-[11px] font-normal text-gray-400">
                    (Years)
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    onKeyDown={preventNegativeKeys}
                    value={tenureYearsInput}
                    onChange={(e) => handleTenureInputChange(e.target.value)}
                    className="w-full sm:w-28 h-10 pl-3 pr-10 text-sm font-bold text-gray-900 bg-[#FAF8F5] border border-[#ECE7DB] focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] rounded-xl outline-none transition-all text-right"
                    placeholder="20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    Yrs
                  </span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9A720C]"
              />

              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[5, 10, 15, 20, 25, 30].map((years) => (
                  <button
                    key={years}
                    type="button"
                    onClick={() => setTenureYears(years)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      tenureYears === years
                        ? "bg-[#9A720C] text-white border-[#9A720C] shadow-2xs"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#9A720C] hover:bg-[#FFF9EC]"
                    }`}
                  >
                    {years} Years
                  </button>
                ))}
              </div>
            </div>

            {/* Validation alert if loan amount is 0 */}
            {loanAmount <= 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2">
                <Info size={16} className="text-amber-600 shrink-0" />
                <span>Please enter a loan amount greater than ₹0 to calculate EMI.</span>
              </div>
            )}
          </div>

          {/* Right Column: Calculated Results & Donut Chart */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic EMI Result Banner - Light Theme UI */}
            <div className="bg-[#FFFDF6] border border-[#E8DCC1] rounded-[28px] p-6 sm:p-8 space-y-5 shadow-2xs">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#9A720C]">
                Calculated Monthly EMI
              </span>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-serif">
                  {formatIndianCurrency(result.emi)}
                  <span className="text-xs font-sans text-gray-500 font-normal"> / month</span>
                </div>
                <p className="text-xs text-gray-600 font-medium mt-1">
                  At {result.annualInterestRate}% p.a. for {result.tenureYears} Years ({result.tenureMonths} EMIs)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#ECE7DB] flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles size={15} /> Apply for Home Loan / Loan Enquiry
                </button>

                <Link
                  href="/property-listing"
                  className="w-full h-10 rounded-xl border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Explore Eligible Properties <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Summary Breakdown Grid */}
            <div className="bg-white border border-[#ECE7DB] rounded-[28px] p-6 space-y-6 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
                <PieChart size={16} className="text-[#9A720C]" /> Loan Breakdown
              </h3>

              {/* Data Rows */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9A720C]" />
                    <span className="text-gray-600 font-medium">Principal Amount</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {formatIndianCurrency(result.principal)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5D2A0]" />
                    <span className="text-gray-600 font-medium">Total Interest Payable</span>
                  </div>
                  <span className="font-bold text-[#9A720C] text-sm">
                    {formatIndianCurrency(result.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 font-bold text-sm">
                  <span className="text-gray-900">Total Amount Payable</span>
                  <span className="text-gray-900 font-extrabold text-base">
                    {formatIndianCurrency(result.totalPayment)}
                  </span>
                </div>
              </div>

              {/* Dynamic SVG Donut Chart */}
              <div className="pt-4 border-t border-gray-100 flex flex-col items-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring (Interest Portion) */}
                    <path
                      className="text-[#E5D2A0]"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Foreground Ring (Principal Portion) */}
                    <path
                      className="text-[#9A720C] transition-all duration-700 ease-out"
                      strokeDasharray={`${principalPercentage}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-gray-400">Principal</span>
                    <span className="text-lg font-extrabold text-gray-900">
                      {principalPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Legend Bar */}
                <div className="w-full grid grid-cols-2 gap-2 mt-4 text-center text-xs font-semibold">
                  <div className="p-2 rounded-xl bg-[#9A720C]/10 border border-[#9A720C]/20 text-[#9A720C]">
                    Principal: {principalPercentage.toFixed(1)}%
                  </div>
                  <div className="p-2 rounded-xl bg-[#E5D2A0]/20 border border-[#E5D2A0]/40 text-amber-900">
                    Interest: {interestPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Guidance Section */}
        <div className="bg-white border border-[#ECE7DB] rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xs">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#9A720C]" /> About Home Loan EMI Calculation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DB]">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#9A720C]" /> Standard Formula
              </h3>
              <p>
                Calculated using the Reducing Balance method:
                <code className="block mt-2 p-2 bg-white rounded border text-[11px] font-mono text-gray-800">
                  EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
                </code>
                where <strong>P</strong> is Loan Amount, <strong>R</strong> is Monthly Interest Rate, and <strong>N</strong> is Total Months.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DB]">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#9A720C]" /> Tax Benefits
              </h3>
              <p>
                Home loan borrowers in India can claim tax deductions up to <strong>₹2 Lakhs</strong> on interest paid (Section 24) and up to <strong>₹1.5 Lakhs</strong> on principal repayment (Section 80C) every financial year.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DB]">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Info size={16} className="text-[#9A720C]" /> Smart EMI Tips
              </h3>
              <p>
                Making partial pre-payments early in your loan tenure significantly reduces your overall interest burden and shortens your total loan duration.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LoanEnquiryModal
        open={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        loanAmount={loanAmount}
        interestRate={interestRate}
        tenureYears={tenureYears}
        calculatedEmi={result.emi}
      />
    </div>
  );
}

export default function EmiCalculatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <EmiCalculatorContent />
    </Suspense>
  );
}
