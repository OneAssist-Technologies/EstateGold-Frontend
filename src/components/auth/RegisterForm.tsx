"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../services/api"

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  BadgeCheck,
  ArrowLeft
} from "lucide-react";

import RoleSelector from "./RoleSelector";

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] =
    useState("buyer");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      phone: "",
      ownerName: "",
      agencyName: "",
      reraNumber: "",
      password: "",
      confirmPassword: "",
    });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      form.password !==
      form.confirmPassword
    ) {
      return alert(
        "Passwords do not match"
      );
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/register",
          {
            ...form,
            role,
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

    window.location.href = "/";
    } catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    alert(
      error.response?.data?.message ||
      "Registration failed"
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
      mb-8
    "
  >
    <ArrowLeft size={18} />
    Back to Home
  </Link>
      <div className="mb-8">
        <h2 className="text-5xl font-bold">
          Create Account
        </h2>

        <p className="mt-3 text-gray-500">
          Join EstateGold today
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Role Selection */}

        <RoleSelector
          role={role}
          setRole={setRole}
        />

        {/* Full Name */}

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
            onChange={(e) =>
              setForm({
                ...form,
                fullName:
                  e.target.value,
              })
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
            "
          />
        </div>

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
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
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
            "
          />
        </div>

        {/* Mobile */}

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
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
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
            "
          />
        </div>

        {/* Seller Fields */}

        {role === "seller" && (
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
              onChange={(e) =>
                setForm({
                  ...form,
                  ownerName:
                    e.target.value,
                })
              }
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-[#E5D7B3]
                pl-14
              "
            />
          </div>
        )}

        {/* Agent Fields */}

        {role === "agent" && (
          <>
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    agencyName:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-[#E5D7B3]
                  pl-14
                "
              />
            </div>

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
                onChange={(e) =>
                  setForm({
                    ...form,
                    reraNumber:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  border
                  border-[#E5D7B3]
                  pl-14
                "
              />
            </div>
          </>
        )}

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
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
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
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* Confirm Password */}

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
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={
              form.confirmPassword
            }
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword:
                  e.target.value,
              })
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
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
            "
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* Terms */}

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            className="mt-1"
          />

          <span className="text-sm text-gray-500">
            I agree to the Terms &
            Conditions and Privacy
            Policy
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
            text-white
            text-lg
            font-semibold
          "
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
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