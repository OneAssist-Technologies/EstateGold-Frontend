"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardLayout from "@/src/components/admin/DashboardLayout";
import api from "@/src/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Globe,
  Building2,
  ShieldCheck,
  Bell,
  Lock,
  Camera,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Laptop,
  LogOut,
  Upload,
  UserCheck,
  KeyRound,
  Sliders,
  Shield,
  Layers,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [activeSection, setActiveSection] = useState<
    "profile" | "platform" | "property" | "access" | "notification" | "security"
  >("profile");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Admin Profile State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Platform Settings State
  const [platformName, setPlatformName] = useState("EstateGold");
  const [platformLogo, setPlatformLogo] = useState("");
  const [supportEmail, setSupportEmail] = useState("support@estategold.com");
  const [supportPhone, setSupportPhone] = useState("+91 1800-123-4567");
  const [supportAddress, setSupportAddress] = useState("12th Floor, Trade Centre, Mumbai");
  const [defaultCountry, setDefaultCountry] = useState("India");
  const [defaultCurrency, setDefaultCurrency] = useState("INR (₹)");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");

  // 3. Property Settings State
  const [propertyApprovalRequired, setPropertyApprovalRequired] = useState(true);
  const [allowEditingPublished, setAllowEditingPublished] = useState(true);
  const [defaultPropertyStatus, setDefaultPropertyStatus] = useState("on_sale");
  const [allowPropertyHold, setAllowPropertyHold] = useState(true);
  const [maxImagesPerProperty, setMaxImagesPerProperty] = useState(15);
  const [listingExpiry, setListingExpiry] = useState("60");

  // 4. Access Control State
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [selectedStaffUser, setSelectedStaffUser] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    dashboard: { view: true, create: true, edit: true, delete: true, approve: true },
    properties: { view: true, create: true, edit: true, delete: false, approve: true },
    users: { view: true, create: true, edit: true, delete: false, approve: true },
    locations: { view: true, create: true, edit: true, delete: false, approve: true },
    analytics: { view: true, create: false, edit: false, delete: false, approve: false },
    settings: { view: true, create: true, edit: true, delete: false, approve: true },
  });

  // 5. Notification Settings State
  const [newUserRegistration, setNewUserRegistration] = useState(true);
  const [newPropertySubmitted, setNewPropertySubmitted] = useState(true);
  const [propertyApprovedRejected, setPropertyApprovedRejected] = useState(true);
  const [newEnquiry, setNewEnquiry] = useState(true);
  const [newProjectSubmitted, setNewProjectSubmitted] = useState(true);

  // 6. Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setProfileImage((user as any).profileImage || "");
    }
    fetchSettings();
    fetchStaffUsers();
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin/settings");
      if (res.data.success && res.data.settings) {
        const s = res.data.settings;
        setPlatformName(s.platformName || "EstateGold");
        setPlatformLogo(s.platformLogo || "");
        setSupportEmail(s.supportEmail || "support@estategold.com");
        setSupportPhone(s.supportPhone || "+91 1800-123-4567");
        setSupportAddress(s.supportAddress || "12th Floor, Trade Centre, Mumbai");
        setDefaultCountry(s.defaultCountry || "India");
        setDefaultCurrency(s.defaultCurrency || "INR (₹)");
        setTimeZone(s.timeZone || "Asia/Kolkata");

        setPropertyApprovalRequired(s.propertyApprovalRequired ?? true);
        setAllowEditingPublished(s.allowEditingPublished ?? true);
        setDefaultPropertyStatus(s.defaultPropertyStatus || "on_sale");
        setAllowPropertyHold(s.allowPropertyHold ?? true);
        setMaxImagesPerProperty(s.maxImagesPerProperty || 15);
        setListingExpiry(s.listingExpiry || "60");

        setNewUserRegistration(s.newUserRegistration ?? true);
        setNewPropertySubmitted(s.newPropertySubmitted ?? true);
        setPropertyApprovedRejected(s.propertyApprovedRejected ?? true);
        setNewEnquiry(s.newEnquiry ?? true);
        setNewProjectSubmitted(s.newProjectSubmitted ?? true);
      }
    } catch (err) {
      console.error("Failed to fetch admin system settings:", err);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      const res = await api.get("/admin/staff-users");
      if (res.data.success && res.data.users) {
        setStaffUsers(res.data.users);
        if (res.data.users.length > 0 && !selectedStaffUser) {
          const first = res.data.users[0];
          setSelectedStaffUser(first);
          if (first.permissions) {
            setPermissions((prev) => ({
              ...prev,
              ...first.permissions,
            }));
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch staff users:", err);
    }
  };

  const handleSelectStaffUser = (u: any) => {
    setSelectedStaffUser(u);
    if (u.permissions) {
      setPermissions((prev) => ({
        ...prev,
        ...u.permissions,
      }));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const res = await api.put("/profile", { fullName, phone, profileImage });
      if (res.data.success) {
        await refreshUser();
        setMessage({ type: "success", text: "Admin Profile updated successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
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
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to upload photo." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlatformSettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = {
        platformName,
        platformLogo,
        supportEmail,
        supportPhone,
        supportAddress,
        defaultCountry,
        defaultCurrency,
        timeZone,
      };
      const res = await api.put("/admin/settings", payload);
      if (res.data.success) {
        setMessage({ type: "success", text: "Platform Settings saved persistently!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save platform settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePropertySettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = {
        propertyApprovalRequired,
        allowEditingPublished,
        defaultPropertyStatus,
        allowPropertyHold,
        maxImagesPerProperty,
        listingExpiry,
      };
      const res = await api.put("/admin/settings", payload);
      if (res.data.success) {
        setMessage({ type: "success", text: "Property Settings saved successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save property settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedStaffUser) return;
    try {
      setSaving(true);
      setMessage(null);
      const res = await api.put(`/admin/users/${selectedStaffUser._id}/permissions`, { permissions });
      if (res.data.success) {
        setMessage({
          type: "success",
          text: `Permissions for ${selectedStaffUser.fullName} saved & enforced!`,
        });
        fetchStaffUsers();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update permissions." });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = {
        newUserRegistration,
        newPropertySubmitted,
        propertyApprovedRejected,
        newEnquiry,
        newProjectSubmitted,
      };
      const res = await api.put("/admin/settings", payload);
      if (res.data.success) {
        setMessage({ type: "success", text: "Notification Settings saved successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to save notification settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and Confirm password do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      const res = await api.put("/change-password", { currentPassword, newPassword });
      if (res.data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage({ type: "success", text: "Password updated successfully!" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (moduleName: string, actionName: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [actionName]: !prev[moduleName]?.[actionName],
      },
    }));
  };

  const navItems = [
    { id: "profile", label: "Admin Profile", icon: UserIcon },
    { id: "platform", label: "Platform Settings", icon: Globe },
    { id: "property", label: "Property Settings", icon: Building2 },
    { id: "access", label: "Access Control", icon: ShieldCheck },
    { id: "notification", label: "Notification Settings", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ];

  const joinedDate = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Administrator";

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6 font-sans">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-serif">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Manage platform settings, property controls, access permissions, and account configurations
          </p>
        </div>

        {/* Global Alert Notification */}
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

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Settings Navigation Sidebar (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-[#ECE7DB] p-3 shadow-2xs">
            {/* Mobile Scrollable Horizontal Tabs */}
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id as any)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap text-left w-full ${
                      isActive
                        ? "bg-[#FAF5EA] border border-[#C89B1C]/50 text-[#9A720C] font-bold shadow-2xs"
                        : "text-gray-600 hover:bg-[#FAF8F3] hover:text-gray-900 font-medium"
                    }`}
                  >
                    <Icon size={19} className={isActive ? "text-[#9A720C]" : "text-gray-400"} />
                    <span className="tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Selected Section Content Panel (9 Cols) */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-[#ECE7DB] p-5 sm:p-7 shadow-2xs space-y-6">
            {/* SECTION 1: ADMIN PROFILE */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Admin Profile</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage your administrator account credentials and personal details
                  </p>
                </div>

                {/* Profile Photo Header Block */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 border border-[#F4EFE6] rounded-2xl bg-[#FAFAF8]">
                  <div className="relative shrink-0">
                    <div className="h-20 w-20 rounded-full border-2 border-[#E5DCC6] bg-[#FAF5EA] flex items-center justify-center text-2xl font-bold font-serif text-[#9A720C] overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user?.fullName?.charAt(0).toUpperCase() || "A"
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#9A720C] text-white flex items-center justify-center hover:bg-[#856108] transition-all shadow-md cursor-pointer border-2 border-white"
                      title="Upload Photo"
                    >
                      <Camera size={13} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleProfileImageUpload}
                    />
                  </div>

                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-lg font-bold text-gray-900">{user?.fullName || "Administrator"}</h4>
                    <p className="text-xs text-gray-500 font-medium">Administrator Account</p>
                    <p className="text-[11px] text-gray-400 pt-1">Joined on {joinedDate}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Admin Name"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="w-full h-11 pl-4 pr-20 text-xs font-medium rounded-xl border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-not-allowed"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                        Verified <Check size={10} />
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Phone Number</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 pl-4 pr-20 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                      />
                      <span className="absolute right-3 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-0.5">
                        Verified <Check size={10} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 2: PLATFORM SETTINGS */}
            {activeSection === "platform" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Platform Settings</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Manage global platform branding, contact info, and regional defaults
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Platform Name</label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      placeholder="EstateGold"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Platform Logo URL</label>
                    <input
                      type="text"
                      value={platformLogo}
                      onChange={(e) => setPlatformLogo(e.target.value)}
                      placeholder="https://estategold.com/logo.png"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Support Email</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="support@estategold.com"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Support Phone</label>
                    <input
                      type="text"
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      placeholder="+91 1800-123-4567"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Support Address</label>
                    <input
                      type="text"
                      value={supportAddress}
                      onChange={(e) => setSupportAddress(e.target.value)}
                      placeholder="12th Floor, Trade Centre, Mumbai"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Default Country</label>
                    <input
                      type="text"
                      value={defaultCountry}
                      onChange={(e) => setDefaultCountry(e.target.value)}
                      placeholder="India"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Default Currency</label>
                    <input
                      type="text"
                      value={defaultCurrency}
                      onChange={(e) => setDefaultCurrency(e.target.value)}
                      placeholder="INR (₹)"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">Time Zone</label>
                    <input
                      type="text"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      placeholder="Asia/Kolkata"
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePlatformSettings}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Saving Platform Settings..." : "Save Platform Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: PROPERTY SETTINGS */}
            {activeSection === "property" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Property Settings</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Control global property-listing submission and approval behavior
                  </p>
                </div>

                <div className="space-y-4 border border-[#ECE7DB] rounded-2xl p-4 bg-white divide-y divide-gray-100">
                  {/* Property Approval Required */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Property Approval Required</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        New property listings require admin approval before being published live.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPropertyApprovalRequired(!propertyApprovalRequired)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                        propertyApprovalRequired ? "bg-[#9A720C]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          propertyApprovalRequired ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Allow Editing Published Properties */}
                  <div className="flex items-center justify-between gap-4 pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Allow Editing Published Properties</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Owners and agents can edit details of active published listings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowEditingPublished(!allowEditingPublished)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                        allowEditingPublished ? "bg-[#9A720C]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          allowEditingPublished ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Allow Property Hold */}
                  <div className="flex items-center justify-between gap-4 pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Allow Property Hold Status</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Properties can be placed on temporary hold status by owners or admins.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowPropertyHold(!allowPropertyHold)}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                        allowPropertyHold ? "bg-[#9A720C]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          allowPropertyHold ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Default Property Status</label>
                    <select
                      value={defaultPropertyStatus}
                      onChange={(e) => setDefaultPropertyStatus(e.target.value)}
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none bg-white"
                    >
                      <option value="on_sale">On Sale</option>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Maximum Images Per Property</label>
                    <input
                      type="number"
                      value={maxImagesPerProperty}
                      onChange={(e) => setMaxImagesPerProperty(Number(e.target.value))}
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Listing Expiry</label>
                    <select
                      value={listingExpiry}
                      onChange={(e) => setListingExpiry(e.target.value)}
                      className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none bg-white"
                    >
                      <option value="disabled">Disabled (Never Expires)</option>
                      <option value="30">30 Days</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePropertySettings}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Saving Property Settings..." : "Save Property Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 4: ACCESS CONTROL */}
            {activeSection === "access" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Access Control & Staff Permissions</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Configure module-level view, edit, approve, and delete permissions for admin & staff users
                  </p>
                </div>

                {/* Staff User Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Select Admin / Staff User</label>
                  <select
                    value={selectedStaffUser?._id || ""}
                    onChange={(e) => {
                      const u = staffUsers.find((userItem) => userItem._id === e.target.value);
                      if (u) handleSelectStaffUser(u);
                    }}
                    className="w-full sm:w-80 h-11 px-4 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none bg-white"
                  >
                    {staffUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName} ({u.role.toUpperCase()}) - {u.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected User Summary Badge */}
                {selectedStaffUser && (
                  <div className="p-4 rounded-2xl border border-[#ECE7DB] bg-[#FAF8F3] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#9A720C] text-white font-bold flex items-center justify-center text-sm">
                        {selectedStaffUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{selectedStaffUser.fullName}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{selectedStaffUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 capitalize">
                        Role: {selectedStaffUser.role}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        Status: Active
                      </span>
                    </div>
                  </div>
                )}

                {/* Permissions Matrix */}
                <div className="border border-[#ECE7DB] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="bg-[#F8F5EE] px-4 py-3 border-b border-[#ECE7DB] grid grid-cols-6 gap-2 text-xs font-bold text-gray-700">
                    <span>Module</span>
                    <span className="text-center">View</span>
                    <span className="text-center">Create</span>
                    <span className="text-center">Edit</span>
                    <span className="text-center">Delete</span>
                    <span className="text-center">Approve</span>
                  </div>

                  <div className="divide-y divide-gray-100 bg-white">
                    {[
                      { key: "dashboard", label: "Dashboard" },
                      { key: "properties", label: "Properties" },
                      { key: "users", label: "Users" },
                      { key: "locations", label: "Locations" },
                      { key: "analytics", label: "Analytics" },
                      { key: "settings", label: "Settings" },
                    ].map((mod) => (
                      <div key={mod.key} className="px-4 py-3.5 grid grid-cols-6 gap-2 items-center text-xs">
                        <span className="font-bold text-gray-800">{mod.label}</span>

                        {["view", "create", "edit", "delete", "approve"].map((action) => {
                          const isChecked = permissions[mod.key]?.[action] ?? false;

                          return (
                            <div key={action} className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(mod.key, action)}
                                className="h-4 w-4 rounded text-[#9A720C] focus:ring-[#9A720C] cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSavePermissions}
                    disabled={saving || !selectedStaffUser}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Enforcing Permissions..." : "Save & Enforce Permissions"}
                  </button>

                  <span className="text-[11px] text-gray-400 font-medium">
                    Enforced both on Frontend & Backend API middleware
                  </span>
                </div>
              </div>
            )}

            {/* SECTION 5: NOTIFICATION SETTINGS */}
            {activeSection === "notification" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Notification Settings</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Configure platform event notifications and automated alert triggers
                  </p>
                </div>

                <div className="space-y-4 border border-[#ECE7DB] rounded-2xl p-4 bg-white divide-y divide-gray-100">
                  {[
                    {
                      title: "New User Registration",
                      desc: "Send admin notification whenever a new buyer, owner, or agent registers.",
                      state: newUserRegistration,
                      setter: setNewUserRegistration,
                    },
                    {
                      title: "New Property Submitted",
                      desc: "Send admin notification when a new listing is submitted for approval.",
                      state: newPropertySubmitted,
                      setter: setNewPropertySubmitted,
                    },
                    {
                      title: "Property Approved / Rejected",
                      desc: "Send email notifications to listing creator upon property status review.",
                      state: propertyApprovedRejected,
                      setter: setPropertyApprovedRejected,
                    },
                    {
                      title: "New Property Enquiry",
                      desc: "Send instant notification to property owner when a buyer submits an inquiry.",
                      state: newEnquiry,
                      setter: setNewEnquiry,
                    },
                    {
                      title: "New Project Submitted",
                      desc: "Send alert to admin team when a commercial or new residential project is created.",
                      state: newProjectSubmitted,
                      setter: setNewProjectSubmitted,
                    },
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      className={`flex items-center justify-between gap-4 ${idx !== 0 ? "pt-4" : ""}`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => item.setter(!item.state)}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                          item.state ? "bg-[#9A720C]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            item.state ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveNotificationSettings}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? "Saving Notification Settings..." : "Save Notification Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: SECURITY */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Security & Authentication Controls</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Update account credentials, two-factor authentication, and active session controls
                  </p>
                </div>

                {/* Change Password Sub-Section */}
                <div className="p-5 border border-[#ECE7DB] rounded-2xl bg-white space-y-4 max-w-md">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <KeyRound size={16} className="text-[#9A720C]" /> Change Admin Password
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-4 pr-10 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full h-11 pl-4 pr-10 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full h-11 pl-4 pr-10 text-xs font-medium rounded-xl border border-gray-300 focus:border-[#9A720C] focus:ring-1 focus:ring-[#9A720C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full py-2.5 bg-[#9A720C] hover:bg-[#856108] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Updating Password..." : "Update Password"}
                  </button>
                </div>

                {/* Two-Factor Authentication Block */}
                <div className="p-5 border border-[#ECE7DB] rounded-2xl bg-[#FAF8F3] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Require an authenticator code alongside your password for admin logins.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                    Optional / Configurable
                  </span>
                </div>

                {/* Active Sessions */}
                <div className="p-5 border border-[#ECE7DB] rounded-2xl bg-white space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                    <Laptop size={16} className="text-[#9A720C]" /> Active Admin Sessions
                  </h4>

                  <div className="p-3.5 rounded-xl border border-gray-200 bg-[#FAFAF8] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900">Current Session (Chrome on Windows)</span>
                      <p className="text-[11px] text-gray-500">IP: 127.0.0.1 • Active Now</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
