"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PropertyFormData, PgDetails, PgRoom } from "@/src/types/property";
import { Plus, Trash2, Edit3, Bed, Check, AlertCircle, Sparkles, Shield, X, Power } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  errors?: Record<string, string>;
}

export default function PgRoomConfigStep({ formData, setFormData, errors }: Props) {
  const pgDetails: PgDetails = formData.pgDetails || {};
  const rooms: PgRoom[] = pgDetails.rooms || [];

  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [roomForm, setRoomForm] = useState<PgRoom>({
    roomType: "Single Sharing",
    sharingType: "Single Sharing",
    roomCount: 1,
    totalBeds: 1,
    occupiedBeds: 0,
    reservedBeds: 0,
    availableBeds: 1,
    pricePerPerson: 10000,
    securityDeposit: 20000,
    bathroomType: "Attached",
    ac: true,
    furnishing: "Fully Furnished",
    description: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showModal]);

  const openAddModal = () => {
    setEditingIndex(null);
    setRoomForm({
      roomType: "Single Sharing",
      sharingType: "Single Sharing",
      roomCount: 1,
      totalBeds: 1,
      occupiedBeds: 0,
      reservedBeds: 0,
      availableBeds: 1,
      pricePerPerson: 10000,
      securityDeposit: 20000,
      bathroomType: "Attached",
      ac: true,
      furnishing: "Fully Furnished",
      description: "",
      status: "AVAILABLE",
    });
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setRoomForm({
      ...rooms[index],
      roomCount: rooms[index].roomCount || 1,
      status: rooms[index].status || "AVAILABLE",
    });
    setShowModal(true);
  };

  const handleDeleteRoom = (index: number) => {
    const updated = rooms.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        rooms: updated,
      },
    }));
    toast.success("Room configuration removed.");
  };

  const handleSaveRoom = () => {
    if (!roomForm.roomType) {
      toast.error("Please select a room sharing type.");
      return;
    }
    const rCount = roomForm.roomCount && roomForm.roomCount > 0 ? roomForm.roomCount : 1;
    const bedsPerRoom = roomForm.totalBeds && roomForm.totalBeds > 0 ? roomForm.totalBeds : 1;
    const totCapacity = rCount * bedsPerRoom;

    if (roomForm.occupiedBeds > totCapacity) {
      toast.error(`Occupied beds (${roomForm.occupiedBeds}) cannot exceed total capacity (${totCapacity} beds).`);
      return;
    }
    if (!roomForm.pricePerPerson || roomForm.pricePerPerson <= 0) {
      toast.error("Price per person must be greater than ₹0.");
      return;
    }

    const avail = Math.max(0, totCapacity - roomForm.occupiedBeds - (roomForm.reservedBeds || 0));
    let status = roomForm.status || "AVAILABLE";
    if (status !== "UNAVAILABLE" && status !== "BLOCKED") {
      if (avail === 0) status = "FULL";
      else if (roomForm.occupiedBeds > 0) status = "PARTIALLY_AVAILABLE";
    }

    const finalRoom: PgRoom = {
      ...roomForm,
      roomCount: rCount,
      totalBeds: bedsPerRoom,
      availableBeds: avail,
      status,
      roomId: roomForm.roomId || `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    let updatedRooms = [...rooms];
    if (editingIndex !== null) {
      updatedRooms[editingIndex] = finalRoom;
    } else {
      updatedRooms.push(finalRoom);
    }

    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        rooms: updatedRooms,
      },
    }));

    setShowModal(false);
    toast.success(editingIndex !== null ? "Room configuration updated!" : "Room configuration added!");
  };

  const handleQuickRoomCountChange = (index: number, newCount: number) => {
    if (newCount < 1) return;
    const r = rooms[index];
    const totCapacity = newCount * r.totalBeds;
    const avail = Math.max(0, totCapacity - r.occupiedBeds - (r.reservedBeds || 0));

    let status = r.status || "AVAILABLE";
    if (status !== "UNAVAILABLE" && status !== "BLOCKED") {
      if (avail === 0) status = "FULL";
      else if (r.occupiedBeds > 0) status = "PARTIALLY_AVAILABLE";
      else status = "AVAILABLE";
    }

    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...r,
      roomCount: newCount,
      availableBeds: avail,
      status,
    };

    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        rooms: updatedRooms,
      },
    }));
  };

  const handleToggleRoomStatus = (index: number, newStatus: string) => {
    const r = rooms[index];
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...r,
      status: newStatus as any,
    };

    setFormData((prev) => ({
      ...prev,
      pgDetails: {
        ...(prev.pgDetails || {}),
        rooms: updatedRooms,
      },
    }));

    const statusLabel =
      newStatus === "AVAILABLE"
        ? "Available / Open"
        : newStatus === "UNAVAILABLE"
        ? "Unavailable / Closed"
        : "Blocked / Maintenance";

    toast.success(`Room status updated to "${statusLabel}"`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Room Configurations & Availability
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage room counts, bed capacity, and toggle room availability status (Open / Unavailable / Blocked).
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-[#C89B1C] hover:bg-[#B58A16] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={18} />
          Add Room Type
        </button>
      </div>

      {errors?.rooms && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold">
          <AlertCircle size={20} className="shrink-0" />
          <span>{errors.rooms}</span>
        </div>
      )}

      {/* Room Configurations Display */}
      {rooms.length === 0 ? (
        <div className="p-10 border-2 border-dashed border-[#E6DCC2] rounded-2xl text-center bg-[#FAF9F5]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF9EC] border border-[#E6DCC2] flex items-center justify-center text-[#C89B1C] mb-3">
            <Bed size={28} />
          </div>
          <h3 className="font-bold text-base text-gray-800">No Room Configurations Added Yet</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
            Click the button below to add your first room option (Single, Double, Triple sharing) with room count and status.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="bg-[#C89B1C] hover:bg-[#B58A16] text-white px-5 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Room Option
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room, idx) => {
            const rCount = room.roomCount || 1;
            const totCapacity = rCount * room.totalBeds;
            const avail = room.availableBeds;
            const currentStatus = room.status || "AVAILABLE";

            let statusBg = "bg-green-100 text-green-800 border-green-200";
            let statusText = `Open (${avail} Beds Free)`;
            if (currentStatus === "UNAVAILABLE") {
              statusBg = "bg-red-100 text-red-800 border-red-200";
              statusText = "Unavailable / Closed";
            } else if (currentStatus === "BLOCKED") {
              statusBg = "bg-gray-100 text-gray-700 border-gray-200";
              statusText = "Blocked / Maintenance";
            } else if (currentStatus === "FULL" || avail === 0) {
              statusBg = "bg-red-100 text-red-800 border-red-200";
              statusText = "Full (0 Available)";
            } else {
              statusBg = "bg-green-100 text-green-800 border-green-200";
              statusText = `Open (${avail} Beds Free)`;
            }

            return (
              <div
                key={room.roomId || idx}
                className="bg-white border border-[#E6DCC2] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#C89B1C] bg-[#FFF9EC] px-2.5 py-0.5 rounded-md border border-[#F3E5C8]">
                          {room.roomType}
                        </span>

                        <span className="inline-block text-[10px] font-bold text-[#856108] bg-[#FAF4E8] px-2.5 py-0.5 rounded-md border border-[#E6DCC2]">
                          {rCount} {rCount > 1 ? "Rooms Available" : "Room"}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-xl text-gray-900">
                        ₹{room.pricePerPerson.toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-gray-500">/ person / mo</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(idx)}
                        className="p-2 rounded-lg text-gray-500 hover:text-[#C89B1C] hover:bg-[#FFF9EC] transition-all cursor-pointer"
                        title="Edit Room"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoom(idx)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Room"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-2 mb-4 items-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBg}`}>
                      {statusText}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {room.ac ? "AC Room" : "Non-AC"}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {room.bathroomType} Washroom
                    </span>
                  </div>

                  {/* Room Availability Status Quick Switch */}
                  <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E6DCC2] mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Power size={13} className="text-[#C89B1C]" /> Room Status:
                    </span>

                    <select
                      value={currentStatus}
                      onChange={(e) => handleToggleRoomStatus(idx, e.target.value)}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E6DCC2] bg-white focus:outline-none focus:border-[#C89B1C] cursor-pointer"
                    >
                      <option value="AVAILABLE">Available / Open</option>
                      <option value="UNAVAILABLE">Unavailable / Closed</option>
                      <option value="BLOCKED">Blocked / Maintenance</option>
                    </select>
                  </div>

                  {/* Bed & Room Breakdown Info */}
                  <div className="grid grid-cols-4 gap-1.5 p-3 bg-[#FAF9F5] rounded-xl border border-[#E6DCC2] text-center text-xs mb-3">
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Rooms</span>
                      <span className="font-extrabold text-gray-800 text-xs sm:text-sm">{rCount}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Total Beds</span>
                      <span className="font-extrabold text-gray-800 text-xs sm:text-sm">{totCapacity} Beds</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Occupied</span>
                      <span className="font-extrabold text-amber-700 text-xs sm:text-sm">{room.occupiedBeds} Beds</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Free</span>
                      <span className="font-extrabold text-green-700 text-xs sm:text-sm">{room.availableBeds} Beds</span>
                    </div>
                  </div>

                  {/* Quick Update Room Count */}
                  <div className="flex items-center justify-between text-xs py-2 px-1">
                    <span className="font-bold text-gray-700">Quick Update Room Count:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickRoomCountChange(idx, rCount - 1)}
                        disabled={rCount <= 1}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 font-bold text-gray-700 flex items-center justify-center cursor-pointer"
                        title="Decrease Room Count"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{rCount}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickRoomCountChange(idx, rCount + 1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center cursor-pointer"
                        title="Increase Room Count"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Room Modal Portaled directly to document.body */}
      {showModal && mounted && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E6DCC2] my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-bold text-lg text-gray-900">
                {editingIndex !== null ? "Edit Room Configuration" : "Add Room Configuration"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Room / Sharing Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Sharing Type / Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={roomForm.roomType}
                  onChange={(e) => {
                    const val = e.target.value;
                    let defaultBeds = 1;
                    if (val.includes("Double")) defaultBeds = 2;
                    else if (val.includes("Triple")) defaultBeds = 3;
                    else if (val.includes("Four")) defaultBeds = 4;

                    setRoomForm((prev) => ({
                      ...prev,
                      roomType: val,
                      sharingType: val,
                      totalBeds: defaultBeds,
                    }));
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
                >
                  <option value="Single Sharing">Single Sharing (1 Person)</option>
                  <option value="Double Sharing">Double Sharing (2 Persons)</option>
                  <option value="Triple Sharing">Triple Sharing (3 Persons)</option>
                  <option value="Four Sharing">Four Sharing (4 Persons)</option>
                  <option value="Other">Other / Dormitory</option>
                </select>
              </div>

              {/* Room Availability Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Room Availability Status
                </label>
                <select
                  value={roomForm.status || "AVAILABLE"}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white font-semibold text-gray-800"
                >
                  <option value="AVAILABLE">Available / Open (Accepting Occupants)</option>
                  <option value="UNAVAILABLE">Unavailable / Closed (Not Accepting)</option>
                  <option value="BLOCKED">Blocked / Under Maintenance</option>
                </select>
              </div>

              {/* Number of Rooms & Beds Per Room */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Number of Rooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 5 rooms"
                    value={roomForm.roomCount || 1}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 1;
                      setRoomForm((prev) => ({ ...prev, roomCount: count }));
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Identical rooms of this type</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Beds Per Room <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={roomForm.totalBeds || 1}
                    onChange={(e) => {
                      const beds = parseInt(e.target.value) || 1;
                      setRoomForm((prev) => ({ ...prev, totalBeds: beds }));
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Beds inside each single room</span>
                </div>
              </div>

              {/* Occupied Beds */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Currently Occupied Beds Across All These Rooms
                </label>
                <input
                  type="number"
                  min="0"
                  max={(roomForm.roomCount || 1) * (roomForm.totalBeds || 1)}
                  value={roomForm.occupiedBeds}
                  onChange={(e) => {
                    const occ = parseInt(e.target.value) || 0;
                    setRoomForm((prev) => ({ ...prev, occupiedBeds: occ }));
                  }}
                  className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none"
                />
              </div>

              {/* Bed Availability Live Badge */}
              <div className="p-3 bg-[#FFF9EC] border border-[#F3E5C8] rounded-xl flex items-center justify-between text-xs font-bold text-[#C89B1C]">
                <span>Total Capacity & Available Beds:</span>
                <span className="text-xs bg-white px-3 py-1 rounded-lg border border-[#E6DCC2]">
                  {Math.max(0, (roomForm.roomCount || 1) * (roomForm.totalBeds || 1) - (roomForm.occupiedBeds || 0))} / {(roomForm.roomCount || 1) * (roomForm.totalBeds || 1)} Free
                  ({roomForm.roomCount || 1} {(roomForm.roomCount || 1) > 1 ? "Rooms" : "Room"})
                </span>
              </div>

              {/* Price & Deposit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Price Per Person (₹/mo) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={roomForm.pricePerPerson || ""}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        pricePerPerson: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={roomForm.securityDeposit || ""}
                    onChange={(e) =>
                      setRoomForm((prev) => ({
                        ...prev,
                        securityDeposit: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-4 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* AC & Bathroom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    AC Status
                  </label>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: "AC" },
                      { val: false, label: "Non-AC" },
                    ].map((item) => (
                      <button
                        key={String(item.val)}
                        type="button"
                        onClick={() => setRoomForm((prev) => ({ ...prev, ac: item.val }))}
                        className={`flex-1 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          roomForm.ac === item.val
                            ? "border-[#C89B1C] bg-[#FFF9EC] text-[#C89B1C]"
                            : "border-[#E6DCC2] bg-white text-gray-700 hover:border-[#C89B1C]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Bathroom Type
                  </label>
                  <select
                    value={roomForm.bathroomType}
                    onChange={(e) => setRoomForm((prev) => ({ ...prev, bathroomType: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#E6DCC2] focus:border-[#C89B1C] text-xs font-bold bg-white"
                  >
                    <option value="Attached">Attached</option>
                    <option value="Common">Common</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Room Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Spacious garden facing room with private balcony..."
                  value={roomForm.description || ""}
                  onChange={(e) => setRoomForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-[#E6DCC2] focus:border-[#C89B1C] text-xs focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E6DCC2] text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRoom}
                  className="px-6 py-2.5 rounded-xl bg-[#C89B1C] text-white text-xs font-bold hover:bg-[#B58A16] shadow-sm transition-all cursor-pointer"
                >
                  {editingIndex !== null ? "Update Room Configuration" : "Save Room Configuration"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
