"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  MapPin,
  ShieldCheck,
  Lock,
  Sliders,
  Activity,
  Camera,
  Check,
  CheckCircle2,
  AlertCircle,
  Building2,
  Heart,
  MessageSquare,
  FileText,
  ChevronRight,
  Eye,
  EyeOff,
  Bell,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Shield,
  LogOut,
  Upload,
} from "lucide-react";

import { useAuth, User } from "@/src/context/AuthContext";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import api from "@/src/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, refreshUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "personal" | "address" | "roles" | "preferences" | "activity"
  >("personal");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Stats state
  const [stats, setStats] = useState({
    publishedCount: 0,
    savedCount: 0,
    enquiriesCount: 0,
  });

  // Personal Information Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [reraNumber, setReraNumber] = useState("");

  // Address Form state
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    propertyAlerts: true,
    enquiryNotifications: true,
    savedSearchAlerts: true,
  });

  // Photo Upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setDob((user as any).dob || "");
      setGender((user as any).gender || "");
      setProfileImage((user as any).profileImage || "");
      setAgencyName(user.agencyName || "");
      setReraNumber(user.reraNumber || "");

      setHouseNo((user as any).houseNo || "");
      setStreet((user as any).street || "");
      setLocality((user as any).locality || "");
      setCity((user as any).city || "");
      setStateName((user as any).state || "");
      setPincode((user as any).pincode || "");
      setCountry((user as any).country || "India");

      if ((user as any).preferences) {
        setPreferences((prev) => ({
          ...prev,
          ...(user as any).preferences,
        }));
      }

      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Published Properties Count
      const propRes = await api.get("/my-properties");
      const pubCount = propRes.data.counts?.all || propRes.data.data?.length || 0;

      setStats({
        publishedCount: pubCount,
        savedCount: 0,
        enquiriesCount: 0,
      });
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setMessage(null);
      const formData = new FormData();
      formData.append("photo", file);

      const res = await api.post("/upload-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setProfileImage(res.data.imageUrl);
        await refreshUser();
        setMessage({ type: "success", text: "Profile photo updated successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload profile photo.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePersonal = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const payload = {
        fullName,
        phone,
        dob,
        gender,
        agencyName,
        reraNumber,
        profileImage,
      };

      const res = await api.put("/profile", payload);
      if (res.data.success) {
        await refreshUser();
        setMessage({ type: "success", text: "Personal information saved successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save personal information.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const payload = {
        houseNo,
        street,
        locality,
        city,
        state: stateName,
        pincode,
        country,
      };

      const res = await api.put("/profile", payload);
      if (res.data.success) {
        await refreshUser();
        setMessage({ type: "success", text: "Address details saved successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save address details.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const res = await api.put("/profile", { preferences });
      if (res.data.success) {
        await refreshUser();
        setMessage({ type: "success", text: "Preferences saved successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save preferences.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-[#E8DCC1] border-t-[#9A720C] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate dynamic roles
  const userRoles: string[] =
    user.roles && user.roles.length > 0 ? user.roles : [user.role || "buyer"];

  const hasBuyerRole = userRoles.includes("buyer");
  const hasSellerRole = userRoles.includes("seller");
  const hasAgentRole = userRoles.includes("agent");

  // Account status formatting
  const accountStatus = user.isActive
    ? user.verificationStatus === "pending"
      ? "Pending"
      : "Active"
    : "Suspended";

  const accountStatusBadgeColor =
    accountStatus === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : accountStatus === "Pending"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

  // Joined date formatting
  const joinedDate = (user as any).createdAt
    ? new Date((user as any).createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1450px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Top-Right User Quick Identity Bar */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              className="relative p-2.5 rounded-full bg-white border border-[#EBE6DA] text-gray-600 hover:text-[#9A720C] hover:bg-[#FFFDF8] transition-all shadow-2xs cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-4 w-4 bg-[#9A720C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-[#EBE6DA] shadow-2xs">
              <div className="h-8 w-8 rounded-full bg-[#9A720C] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                {profileImage ? (
                  <img src={profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-bold text-gray-800">{user.fullName}</span>
            </div>
          </div>
        </div>

        {/* Global Notification Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-2xs ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600 font-bold ml-4 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-3xl border border-[#ECE7DB] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Avatar & User Basic Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            {/* Profile Avatar Container with Camera Button */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-3 border-[#F4EBD7] overflow-hidden bg-[#FAF5EA] flex items-center justify-center text-3xl font-bold text-[#9A720C] shadow-xs">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#9A720C] text-white flex items-center justify-center hover:bg-[#856108] transition-all shadow-md cursor-pointer border-2 border-white"
                title="Upload Profile Photo"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleProfileImageUpload}
              />
            </div>

            {/* Name & Contact Specs */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {user.fullName}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("personal")}
                  className="sm:hidden self-center px-3 py-1 bg-[#9A720C] text-white rounded-xl text-xs font-bold shadow-2xs"
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start justify-center sm:justify-start gap-3 text-xs text-gray-600 font-medium w-full overflow-hidden">
                {/* Email */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 shrink-0 max-w-full">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-800 break-all select-all">{user.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5 shrink-0">
                    Verified <Check size={10} />
                  </span>
                </div>

                {/* Mobile */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-800">{user.phone || "+91 98765 43210"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5 shrink-0">
                    Verified <Check size={10} />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-400 font-medium pt-0.5">
                <Calendar size={13} className="text-gray-400" />
                <span>Joined on {joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#F4EFE6] w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className="hidden sm:inline-flex px-4 py-2 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Edit Profile
            </button>

            <div className="w-full md:w-auto space-y-2 text-center md:text-right">
              {/* Dynamic Roles */}
              <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 mr-1">Your Roles:</span>

                {hasBuyerRole && (
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1">
                    Buyer <Check size={11} />
                  </span>
                )}

                {hasSellerRole && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    Seller <Check size={11} />
                  </span>
                )}

                {hasAgentRole && (
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1">
                    Agent <Check size={11} />
                  </span>
                )}
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-500 mr-1">Account Status:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${accountStatusBadgeColor}`}
                >
                  {accountStatus} <Check size={11} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          {[
            { id: "personal", label: "Personal Information", icon: UserIcon },
            { id: "address", label: "Address", icon: MapPin },
            { id: "roles", label: "Roles & Verification", icon: ShieldCheck },
            { id: "preferences", label: "Preferences", icon: Sliders },
            { id: "activity", label: "My Activity", icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:py-2.5 sm:px-4 text-[10px] sm:text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#C89B1C] border-[#C89B1C] text-white shadow-[0_4px_12px_rgba(200,155,28,0.2)] font-bold"
                    : "bg-white border-[#EBE3D5] text-[#6B7280] hover:border-[#C89B1C] hover:text-[#C89B1C]"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-gray-400"} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN 2-COLUMN GRID SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT CONTENT AREA (8 columns) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#ECE7DB] p-5 sm:p-7 shadow-2xs space-y-6">
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Update your personal details and contact info
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full h-11 pl-4 pr-20 text-xs font-medium rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-not-allowed"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                        Verified <Check size={10} />
                      </span>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Mobile Number</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 pl-4 pr-20 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none transition-all"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                        Verified <Check size={10} />
                      </span>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Date of Birth (Optional)
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Gender (Optional)</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none transition-all bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo Block */}
                <div className="border border-[#F4EFE6] rounded-2xl p-4 bg-[#FAFAF8] space-y-3">
                  <label className="text-xs font-bold text-gray-800">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full border border-[#E5DCC6] bg-[#FAF5EA] flex items-center justify-center text-xl font-bold text-[#9A720C] overflow-hidden shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        fullName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] text-gray-500 font-medium">
                        JPG, PNG or WEBP. Max size 2MB.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-[#9A720C] text-[#9A720C] hover:bg-[#FFF9EC] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload size={13} /> Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePersonal}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ADDRESS */}
            {activeTab === "address" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Address Details</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage your location and residence address
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">House / Flat Number</label>
                    <input
                      type="text"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      placeholder="e.g. Flat 4B / Door No. 12"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Street / Road</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. MG Road / Main Street"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Locality / Area</label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Saibaba Colony / Indiranagar"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Coimbatore / Bangalore"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">State</label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="e.g. Tamil Nadu / Karnataka"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="641001"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving Address..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ROLES & VERIFICATION */}
            {activeTab === "roles" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Roles & Verification</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Overview of your active account roles and credentials
                    </p>
                  </div>
                </div>

                {/* Role Specific Sections */}
                <div className="space-y-4">
                  {/* BUYER ROLE CARD */}
                  {hasBuyerRole && (
                    <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserIcon size={18} className="text-blue-700" />
                          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                            BUYER ROLE
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300">
                          Active Role
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        You can search verified properties, save favorites, send callback inquiries, and contact property owners.
                      </p>
                    </div>
                  )}

                  {/* SELLER / OWNER ROLE CARD */}
                  {hasSellerRole && (
                    <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-emerald-700" />
                          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                            SELLER / OWNER ROLE
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                          Active Role
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">
                        You are authorized to list your own properties, manage active listings, and receive buyer inquiries.
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-700">
                          Published Properties: {stats.publishedCount}
                        </span>
                        <Link
                          href="/my-properties"
                          className="text-[#9A720C] font-bold hover:underline"
                        >
                          Manage Listings →
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* AGENT ROLE CARD */}
                  {hasAgentRole && (
                    <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase size={18} className="text-purple-700" />
                          <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                            LICENSED AGENT ROLE
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-300 capitalize">
                          Verification: {user.verificationStatus || "Approved"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-gray-500 font-medium">Agency Name:</span>
                          <p className="font-bold text-gray-900">{agencyName || "Independent Agent"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">RERA Registration:</span>
                          <p className="font-bold text-gray-900">{reraNumber || "Verified Agent"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: PREFERENCES */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Account Preferences</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage email notifications, search alerts, and communication preferences
                  </p>
                </div>

                <div className="space-y-4 border border-[#ECE7DB] rounded-2xl p-4 bg-white divide-y divide-gray-100">
                  {[
                    {
                      key: "emailNotifications",
                      title: "Email Notifications",
                      desc: "Receive important system updates, security alerts, and account activity.",
                    },
                    {
                      key: "propertyAlerts",
                      title: "Property Alerts",
                      desc: "Get notified when new properties matching your interest are listed.",
                    },
                    {
                      key: "enquiryNotifications",
                      title: "Enquiry Notifications",
                      desc: "Receive instant updates when buyers or owners send callback inquiries.",
                    },
                    {
                      key: "savedSearchAlerts",
                      title: "Saved Search Alerts",
                      desc: "Receive weekly digests for saved cities, localities, and budget updates.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between gap-4 ${idx !== 0 ? "pt-4" : ""}`}
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPreferences((prev: any) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                          (preferences as any)[item.key] ? "bg-[#9A720C]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            (preferences as any)[item.key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving Preferences..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: MY ACTIVITY */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">My Activity</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Summary of your published listings and inquiries
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-[#ECE7DB] bg-[#FAF8F3] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-500">Properties Published</span>
                      <h4 className="text-2xl font-bold text-[#9A720C]">
                        {stats.publishedCount}
                      </h4>
                    </div>
                    <Building2 size={24} className="text-[#9A720C]" />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <Link
                    href="/my-properties"
                    className="px-4 py-2 rounded-xl bg-[#9A720C] text-white text-xs font-bold hover:bg-[#856108] transition-all"
                  >
                    View My Properties
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT-SIDE ACCOUNT OVERVIEW (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Overview Summary Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#ECE7DB] p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <Activity size={18} className="text-[#9A720C]" />
                <h3 className="text-sm font-bold text-gray-900">Account Overview</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <Building2 size={15} className="text-gray-400" />
                    <span>Properties Published</span>
                  </span>
                  <span className="h-6 w-6 rounded-full bg-[#FFF9EC] border border-[#F3E5C8] text-[#9A720C] font-bold flex items-center justify-center text-xs">
                    {stats.publishedCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <Heart size={15} className="text-gray-400" />
                    <span>Saved Properties</span>
                  </span>
                  <span className="h-6 w-6 rounded-full bg-[#FFF9EC] border border-[#F3E5C8] text-[#9A720C] font-bold flex items-center justify-center text-xs">
                    {stats.savedCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="flex items-center gap-2 text-gray-600 font-medium">
                    <MessageSquare size={15} className="text-gray-400" />
                    <span>Enquiries Sent</span>
                  </span>
                  <span className="h-6 w-6 rounded-full bg-[#FFF9EC] border border-[#F3E5C8] text-[#9A720C] font-bold flex items-center justify-center text-xs">
                    {stats.enquiriesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#ECE7DB] p-4 sm:p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <FileText size={18} className="text-[#9A720C]" />
                <h3 className="text-sm font-bold text-gray-900">Quick Links</h3>
              </div>

              <div className="space-y-1">
                {(hasSellerRole || hasAgentRole) && (
                  <Link
                    href="/my-properties"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EE] text-xs font-semibold text-gray-700 hover:text-[#9A720C] transition-colors"
                  >
                    <span>My Properties</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                )}

                <Link
                  href="/property-listing"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EE] text-xs font-semibold text-gray-700 hover:text-[#9A720C] transition-colors"
                >
                  <span>Saved Properties</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>

                {(hasSellerRole || hasAgentRole) && (
                  <Link
                    href="/my-properties"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EE] text-xs font-semibold text-gray-700 hover:text-[#9A720C] transition-colors"
                  >
                    <span>My Enquiries</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                )}

                <Link
                  href="/forgot-password"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF6EE] text-xs font-semibold text-gray-700 hover:text-[#9A720C] transition-colors"
                >
                  <span>Reset Password (Email OTP)</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BANNER: Complete Your Profile */}
        <div className="bg-[#FAF5E8] border border-[#E8DEC3] rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-2xl bg-[#9A720C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Complete your profile</h4>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                A complete profile builds trust and helps others connect with you easily.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className="px-5 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Update Profile
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
