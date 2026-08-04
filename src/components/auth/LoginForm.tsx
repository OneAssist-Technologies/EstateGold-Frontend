"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import api from "../../services/api"
import { useAuth } from "@/src/context/AuthContext";


import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await api.post("/login",
         
          {
            email,
            password,
          }
        );

    //   localStorage.setItem(
    //     "token",
    //     response.data.token
    //   );

    //   localStorage.setItem(
    //     "user",
    //     JSON.stringify(
    //       response.data.user
    //     )
    //   );
    login(
  response.data.user,
  response.data.token
);

      if (response.data.user.role === "admin") {
  window.location.href = "/admin";
} else {
  window.location.href = "/";
}
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
      "Invalid credentials"
    );
  } else {
    alert("Something went wrong");
  }
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
      mb-4
    "
  >
    <ArrowLeft size={18} />
    Back to Home
  </Link>

      <div className="lg:hidden text-center mb-10">
        <h1 className="text-4xl font-bold text-[#C89B1C]">
          EstateGold
        </h1>
      </div>

      {/* Heading */}

      <div className="mb-10">
        <h2 className="text-5xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <p className="mt-4 text-lg text-gray-500">
          Sign in to continue your
          property journey
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleLogin}
        className="space-y-6"
      >
        {/* Email */}

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
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            required
            className="
              w-full
              h-16
              rounded-2xl
              border
              border-[#E5D7B3]
              pl-14
              pr-4
              text-lg
              outline-none
              focus:border-[#C89B1C]
              focus:ring-2
              focus:ring-[#C89B1C]/20
            "
          />
        </div>

        {/* Password */}

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
            className="
              w-full
              h-16
              rounded-2xl
              border
              border-[#E5D7B3]
              pl-14
              pr-14
              text-lg
              outline-none
              focus:border-[#C89B1C]
              focus:ring-2
              focus:ring-[#C89B1C]/20
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
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
            className="
              text-[#C89B1C]
              font-medium
              hover:underline
            "
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}

     <button
  type="submit"
  disabled={loading}
  className="
    shine-btn
    w-full
    h-16
    rounded-2xl
    bg-gradient-to-r
    from-[#C89B1C]
    to-[#D8B75A]
    text-white
    text-lg
    font-semibold
    transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-2xl
    active:scale-[0.98]
    disabled:opacity-50
  "
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
    className="
      text-[#C89B1C]
      font-semibold
      hover:underline
    "
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