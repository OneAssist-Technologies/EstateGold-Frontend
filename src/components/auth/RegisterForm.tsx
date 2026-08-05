"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../services/api";

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

import RoleSelector from "./RoleSelector";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  ownerName?: string;
  agencyName?: string;
  reraNumber?: string;
  password?: string;
  confirmPassword?: string;
  server?: string;
}

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    ownerName: "",
    agencyName: "",
    reraNumber: "",
    password: "",
    confirmPassword: "",
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
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    const phoneClean = form.phone.trim().replace(/[\s\-\(\)]/g, "");
    if (!phoneClean) {
      newErrors.phone = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number starting with 6-9";
    }

    if (role === "seller" && !form.ownerName.trim()) {
      newErrors.ownerName = "Owner / Company Name is required";
    }

    if (role === "agent") {
      if (!form.agencyName.trim()) {
        newErrors.agencyName = "Agency Name is required";
      }
      if (!form.reraNumber.trim()) {
        newErrors.reraNumber = "RERA Registration Number is required";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
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

    try {
      setLoading(true);
      setErrors({});

      const response = await api.post("/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim().replace(/[\s\-\(\)]/g, ""),
        password: form.password,
        role,
        ownerName: form.ownerName.trim(),
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
    <div className="w-full">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-2
          text-[#C89B1C]
          font-medium
          hover:gap-3
          transition-all
          mb-8
        "
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      <div className="mb-8">
        <h2 className="text-5xl font-bold">Create Account</h2>

        <p className="mt-3 text-gray-500">Join EstateGold today</p>
      </div>

      {errors.server && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium">
          <AlertCircle size={20} className="shrink-0" />
          <span>{errors.server}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Role Selection */}
        <RoleSelector role={role} setRole={(r) => { setRole(r); setErrors({}); }} />

        {/* Full Name */}
        <div>
          <div className="relative">
            <User
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={`
                w-full
                h-16
                rounded-2xl
                border
                ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                pl-14
                pr-4
                outline-none
                transition-colors
              `}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`
                w-full
                h-16
                rounded-2xl
                border
                ${errors.email ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                pl-14
                pr-4
                outline-none
                transition-colors
              `}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <div className="relative">
            <Phone
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="tel"
              placeholder="Mobile Number (10 digits)"
              value={form.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`
                w-full
                h-16
                rounded-2xl
                border
                ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                pl-14
                pr-4
                outline-none
                transition-colors
              `}
            />
          </div>
          {errors.phone && (
            <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Seller Fields */}
        {role === "seller" && (
          <div>
            <div className="relative">
              <Building2
                size={20}
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Owner / Company Name"
                value={form.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                className={`
                  w-full
                  h-16
                  rounded-2xl
                  border
                  ${errors.ownerName ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                  pl-14
                  pr-4
                  outline-none
                  transition-colors
                `}
              />
            </div>
            {errors.ownerName && (
              <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.ownerName}</p>
            )}
          </div>
        )}

        {/* Agent Fields */}
        {role === "agent" && (
          <>
            <div>
              <div className="relative">
                <Building2
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Agency Name"
                  value={form.agencyName}
                  onChange={(e) => handleInputChange("agencyName", e.target.value)}
                  className={`
                    w-full
                    h-16
                    rounded-2xl
                    border
                    ${errors.agencyName ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                    pl-14
                    pr-4
                    outline-none
                    transition-colors
                  `}
                />
              </div>
              {errors.agencyName && (
                <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.agencyName}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <BadgeCheck
                  size={20}
                  className="
                    absolute
                    left-5
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="RERA Registration Number"
                  value={form.reraNumber}
                  onChange={(e) => handleInputChange("reraNumber", e.target.value)}
                  className={`
                    w-full
                    h-16
                    rounded-2xl
                    border
                    ${errors.reraNumber ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                    pl-14
                    pr-4
                    outline-none
                    transition-colors
                  `}
                />
              </div>
              {errors.reraNumber && (
                <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.reraNumber}</p>
              )}
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <div className="relative">
            <Lock
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 6 characters)"
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`
                w-full
                h-16
                rounded-2xl
                border
                ${errors.password ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                pl-14
                pr-14
                outline-none
                transition-colors
              `}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-gray-600
              "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Lock
              size={20}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`
                w-full
                h-16
                rounded-2xl
                border
                ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-[#E5D7B3]"}
                pl-14
                pr-14
                outline-none
                transition-colors
              `}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-gray-600
              "
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 ml-2 text-xs font-medium text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 rounded accent-[#C89B1C]" />

          <span className="text-sm text-gray-500">
            I agree to the Terms & Conditions and Privacy Policy
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            h-16
            rounded-2xl
            bg-gradient-to-r
            from-[#C89B1C]
            to-[#D8B75A]
            hover:from-[#b68c17]
            hover:to-[#c7a74a]
            text-white
            text-lg
            font-semibold
            transition-all
            shadow-md
            hover:shadow-lg
            disabled:opacity-50
          "
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="
            text-[#C89B1C]
            font-semibold
            hover:underline
          "
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}