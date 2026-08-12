"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function getPasswordValidationState(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@#!%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const criteriaMet = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  return {
    hasMinLength,
    hasUppercase,
    hasNumber,
    hasSpecial,
    criteriaMet,
    isValid: criteriaMet === 4,
  };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { hasMinLength, hasUppercase, hasNumber, hasSpecial, criteriaMet } = getPasswordValidationState(password);

  // Strength Bar Configuration
  const getStrengthConfig = () => {
    switch (criteriaMet) {
      case 1:
        return { label: "Weak", color: "bg-red-500", textColor: "text-red-600", width: "w-1/4" };
      case 2:
        return { label: "Fair", color: "bg-amber-500", textColor: "text-amber-600", width: "w-2/4" };
      case 3:
        return { label: "Good", color: "bg-amber-600", textColor: "text-amber-700", width: "w-3/4" };
      case 4:
        return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600", width: "w-full" };
      default:
        return { label: "", color: "bg-gray-200", textColor: "text-gray-400", width: "w-0" };
    }
  };

  const strength = getStrengthConfig();

  const rules = [
    { label: "Minimum 8 characters", met: hasMinLength },
    { label: "At least 1 uppercase letter (A-Z)", met: hasUppercase },
    { label: "At least 1 number (0-9)", met: hasNumber },
    { label: "At least 1 special character (@#!%^&*)", met: hasSpecial },
  ];

  return (
    <div className="mt-3 space-y-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-150 transition-all">
      {/* Strength Bar & Label */}
      <div className="flex items-center justify-between gap-3 text-xs font-bold">
        <span className="text-gray-500">Password Strength:</span>
        <span className={`${strength.textColor} font-bold transition-colors`}>{strength.label}</span>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden p-0.5 flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-all duration-500 ${
              criteriaMet >= step ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Validation Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-medium">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              rule.met ? "text-emerald-700 font-semibold" : "text-gray-400"
            }`}
          >
            {rule.met ? (
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            ) : (
              <XCircle size={13} className="text-gray-300 shrink-0" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
