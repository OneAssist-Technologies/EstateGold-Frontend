"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import api from "../../lib/api"
import { useAuth } from "@/src/hooks/useAuth";;


import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      const response = await api.post("/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      if (response.data.user.role === "admin") {
        window.location.href = "/admin/properties";
      } else {
        window.location.href = "/";
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message || "Invalid credentials or password"
        );
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#C89B1C] font-medium hover:gap-3 transition-all mb-4"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>

      <div className="md:hidden text-center mb-6">
        <h1 className="text-3xl font-bold text-[#C89B1C]">
          EstateGold
        </h1>
      </div>

      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-500">
          Sign in to continue your property journey
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleLogin}
        className="space-y-6"
      >
        {/* Email */}

        <div className="relative">
          <Mail
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-4 text-lg outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"
          />
        </div>

        {/* Password */}

        <div className="relative">
          <Lock
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            required
            className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-14 text-lg outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {/* Forgot Password */}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[#C89B1C] font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}

     <button
  type="submit"
  disabled={loading}
  className="shine-btn w-full h-16 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
>
  {loading
    ? "Signing In..."
    : "Sign In"}
</button>
      </form>


     <p className="mt-10 text-center text-gray-500">
  Dont have an account?{" "}
  <Link
    href="/register"
    className="text-[#C89B1C] font-semibold hover:underline"
  >
    Create Account
  </Link>
</p>

      {/* Terms */}

      <p className="mt-6 text-center text-sm text-gray-400 leading-6">
        By signing in, you agree to our
        Terms of Service and Privacy
        Policy.
      </p>
    </div>
  );
}