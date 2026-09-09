"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Check, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  isPushNotificationSupported,
  getNotificationPermission,
  subscribeToPush,
  syncPushIfGranted,
} from "../../utils/pushNotification";
import toast from "react-hot-toast";

export default function PushPermissionPrompt() {
  const { isAuthenticated, loading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    if (!isPushNotificationSupported()) return;

    const currentPermission = getNotificationPermission();

    // If already granted, auto-sync subscription silently in background without prompting
    if (currentPermission === "granted") {
      syncPushIfGranted();
      return;
    }

    // If permission is default (never asked or not yet decided) and not dismissed in session
    if (currentPermission === "default") {
      const isDismissed = sessionStorage.getItem("estategold_push_prompt_dismissed");
      if (!isDismissed) {
        // Small delay to let the page render smoothly first
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loading]);

  const handleAllow = async () => {
    setSubscribing(true);
    try {
      const result = await subscribeToPush();
      if (result.success) {
        toast.success("Push notifications enabled for this device!");
        setShowPrompt(false);
      } else {
        if (result.permission === "denied") {
          toast.error("Notifications blocked in browser. Please enable in browser settings if needed.");
        }
        setShowPrompt(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Could not enable push notifications.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("estategold_push_prompt_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt || !isAuthenticated) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-[380px] w-[calc(100vw-40px)] bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#E8DCC1] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
        aria-label="Dismiss notification prompt"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-[#FFF9EC] border border-[#E8DCC1] text-[#9A720C] flex items-center justify-center shrink-0 shadow-2xs">
          <Bell size={20} className="animate-bounce" />
        </div>

        <div className="flex-1 pr-3">
          <h4 className="text-sm font-bold text-gray-900 leading-snug">
            Real-Time Device Alerts
          </h4>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Get instant mobile & desktop alerts when new callback enquiries arrive or property prices drop.
          </p>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAllow}
              disabled={subscribing}
              className="px-4 py-2 bg-gradient-to-r from-[#B88A1A] via-[#D4B04C] to-[#8C6605] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {subscribing ? (
                <>
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Allow Notifications</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
