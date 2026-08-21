"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import api from "@/src/services/api";
import AuthLayout from "@/src/components/auth/AuthLayout";
import PasswordStrengthMeter, { getPasswordValidationState } from "@/src/components/auth/PasswordStrengthMeter";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step state: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !email.trim()) {
      setMessage({ type: "error", text: "Please enter your registered email address." });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/forgot-password", { email: email.trim() });
      if (res.data.success) {
        setMessage({ type: "success", text: res.data.message || "OTP code sent to your email address!" });
        setStep(2);
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP. Please check your email.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!otp || otp.trim().length !== 6) {
      setMessage({ type: "error", text: "Please enter the complete 6-digit OTP code." });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/verify-otp", { email: email.trim(), otp: otp.trim() });
      if (res.data.success) {
        setMessage({ type: "success", text: "OTP verified successfully. Please set a new password." });
        setStep(3);
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid or expired OTP code.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const passState = getPasswordValidationState(newPassword);
    if (!newPassword || !passState.hasMinLength) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    if (!passState.hasUppercase) {
      setMessage({ type: "error", text: "Password must contain at least one uppercase letter (A-Z)." });
      return;
    }

    if (!passState.hasNumber) {
      setMessage({ type: "error", text: "Password must contain at least one number (0-9)." });
      return;
    }

    if (!passState.hasSpecial) {
      setMessage({ type: "error", text: "Password must contain at least one special character (@#!%^&*)." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirm password do not match." });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
  

      if (res.data.success) {
        setMessage({ type: "success", text: "Password reset successfully!" });
        setStep(4);
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" description="Verify your identity via Email OTP to reset password">
      <div className="w-full">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#C89B1C] font-medium hover:gap-3 transition-all mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP Code"}
            {step === 3 && "Create New Password"}
            {step === 4 && "Password Reset Successful"}
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            {step === 1 && "Enter your registered email address and we will send you a 6-digit OTP verification code via SMTP."}
            {step === 2 && `We sent a 6-digit verification OTP code to ${email}.`}
            {step === 3 && "Enter your new password below to complete the reset process."}
            {step === 4 && "Your account password has been updated. You can now log in with your new credentials."}
          </p>
        </div>

        {/* Global Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-2xs ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {message.type === "success" ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-red-600 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 1: EMAIL REQUEST FORM */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div className="relative">
              <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter Registered Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-4 text-base outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shine-btn w-full h-16 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-base font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Sending Verification OTP..." : "Send Verification OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION FORM */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="relative">
              <KeyRound size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                maxLength={6}
                placeholder="6-Digit OTP (e.g. 123456)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-4 text-center text-xl tracking-widest font-bold outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Didn't receive the OTP?</span>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="text-[#C89B1C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Resend OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shine-btn w-full h-16 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-base font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Verifying OTP..." : "Verify OTP Code"}
            </button>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD FORM */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative">
              <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-14 text-base outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Meter & Live Checklist */}
            <PasswordStrengthMeter password={newPassword} />

            <div className="relative">
              <ShieldCheck size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-16 rounded-2xl border border-[#E5D7B3] pl-14 pr-14 text-base outline-none focus:border-[#C89B1C] focus:ring-2 focus:ring-[#C89B1C]/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="shine-btn w-full h-16 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-base font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? "Resetting Password..." : "Reset Password & Login"}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={40} />
            </div>

            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Your password has been updated successfully. You can now use your new password to sign into your EstateGold account.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="shine-btn w-full h-16 rounded-2xl bg-gradient-to-r from-[#C89B1C] to-[#D8B75A] text-white text-base font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer"
            >
              Proceed to Sign In
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
