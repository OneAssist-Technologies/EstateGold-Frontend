"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import api from "../../lib/api";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  BadgeCheck,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import PasswordStrengthMeter, { getPasswordValidationState } from "./PasswordStrengthMeter";

import RoleSelector from "./RoleSelector";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  agencyName?: string;
  reraNumber?: string;
  password?: string;
  confirmPassword?: string;
  server?: string;
}

export default function RegisterForm() {
  const router = useRouter();

  // Role defaults to "seller" (Member / Buyer / Seller / Owner)
  const [role, setRole] = useState("seller");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    agencyName: "",
    reraNumber: "",
    password: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. you@example.com)";
    }

    const phoneClean = form.phone.trim().replace(/[\s\-\(\)]/g, "");
    if (!phoneClean) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (role === "agent") {
      if (!form.agencyName.trim()) {
        newErrors.agencyName = "Agency Name is required";
      }
      if (!form.reraNumber.trim()) {
        newErrors.reraNumber = "RERA Registration Number is required";
      }
    }

    const passState = getPasswordValidationState(form.password);
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passState.hasMinLength) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passState.hasUppercase) {
      newErrors.password = "Password must contain at least one uppercase letter (A-Z)";
    } else if (!passState.hasNumber) {
      newErrors.password = "Password must contain at least one number (0-9)";
    } else if (!passState.hasSpecial) {
      newErrors.password = "Password must contain at least one special character (@#!%^&*)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors] || errors.server) {
      setErrors((prev) => ({ ...prev, [field]: undefined, server: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!form.termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        server: "Please agree to the Terms of Service and Privacy Policy.",
      }));
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await api.post("/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim().replace(/[\s\-\(\)]/g, ""),
        password: form.password,
        role: role === "agent" ? "agent" : "seller",
        agencyName: form.agencyName.trim(),
        reraNumber: form.reraNumber.trim(),
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      window.location.href = "/";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Registration failed. Please check your details.";
        setErrors((prev) => ({ ...prev, server: message }));
      } else {
        setErrors((prev) => ({
          ...prev,
          server: "Something went wrong. Please try again later.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full font-sans"
    >
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[#C89B1C] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Brand Header for Mobile App View */}
      <div className="md:hidden text-center mb-6">
        <h1 className="text-3xl font-bold text-[#C89B1C]">
          EstateGold
        </h1>
      </div>

      {/* Heading */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#171412] tracking-tight">
          Create Your Free Account
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-[#C89B1C] font-semibold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {errors.server && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errors.server}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        {/* Role Selection */}
        <RoleSelector role={role} setRole={(r) => { setRole(r); setErrors({}); }} />

        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={`
                w-full
                h-[56px]
                rounded-2xl
                border
                ${errors.fullName ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                pl-11
                pr-4
                text-sm
                placeholder-gray-400
                outline-none
                transition-all
              `}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`
                w-full
                h-[56px]
                rounded-2xl
                border
                ${errors.email ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                pl-11
                pr-4
                text-sm
                placeholder-gray-400
                outline-none
                transition-all
              `}
            />
          </div>
          {errors.email && (
            <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Mobile Number
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              placeholder="+91 10-digit mobile number"
              maxLength={10}
              value={form.phone}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleInputChange("phone", sanitized);
              }}
              className={`
                w-full
                h-[56px]
                rounded-2xl
                border
                ${errors.phone ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                pl-11
                pr-4
                text-sm
                placeholder-gray-400
                outline-none
                transition-all
              `}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Agent Fields */}
        {role === "agent" && (
          <>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Agency Name
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Your agency or firm name"
                  value={form.agencyName}
                  onChange={(e) => handleInputChange("agencyName", e.target.value)}
                  className={`
                    w-full
                    h-[56px]
                    rounded-2xl
                    border
                    ${errors.agencyName ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                    pl-11
                    pr-4
                    text-sm
                    placeholder-gray-400
                    outline-none
                    transition-all
                  `}
                />
              </div>
              {errors.agencyName && (
                <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.agencyName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                RERA Registration Number
              </label>
              <div className="relative">
                <BadgeCheck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="RERA registration number"
                  value={form.reraNumber}
                  onChange={(e) => handleInputChange("reraNumber", e.target.value)}
                  className={`
                    w-full
                    h-[56px]
                    rounded-2xl
                    border
                    ${errors.reraNumber ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                    pl-11
                    pr-4
                    text-sm
                    placeholder-gray-400
                    outline-none
                    transition-all
                  `}
                />
              </div>
              {errors.reraNumber && (
                <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.reraNumber}</p>
              )}
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
            Create Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`
                w-full
                h-[56px]
                rounded-2xl
                border
                ${errors.password ? "border-red-500" : "border-gray-200 focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"}
                pl-11
                pr-11
                text-sm
                placeholder-gray-400
                outline-none
                transition-all
              `}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 ml-1 text-xs font-medium text-red-500">{errors.password}</p>
          )}

          {/* Password Strength Meter & Live Checklist */}
          <PasswordStrengthMeter password={form.password} />
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer pt-2 pb-1">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-[#C89B1C] focus:ring-[#C89B1C] accent-[#C89B1C] cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-600 leading-tight">
            I agree to EstateGold's{" "}
            <a href="#" className="text-[#C89B1C] font-semibold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#C89B1C] font-semibold hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit Button */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full h-[58px] mt-4 rounded-2xl bg-gradient-to-r from-[#C89B1C] via-[#D8B75A] to-[#C89B1C] hover:from-[#b88c17] hover:to-[#b88c17] text-white text-base sm:text-lg font-bold tracking-wide shadow-[0_4px_20px_rgba(200,155,28,0.25)] hover:shadow-[0_6px_25px_rgba(200,155,28,0.4)] transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          {loading
            ? role === "agent"
              ? "Registering..."
              : "Creating Account..."
            : role === "agent"
            ? "Register as Agent — Free"
            : "Create Account — It's Free"}
        </motion.button>
      </form>
    </motion.div>
  );
}