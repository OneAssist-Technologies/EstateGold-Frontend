"use client";

import React from "react";
import { Property, PgDetails, PgRoom } from "@/src/types/property";
import {
  Bed,
  Users,
  Utensils,
  Check,
  ShieldAlert,
  Clock,
  Ban,
  Wifi,
  Wind,
  WashingMachine,
  Shirt,
  Sparkles,
  Zap,
  Car,
  ChevronUp,
  Flame,
  Tv,
  BookOpen,
  Dumbbell,
  Briefcase,
  Refrigerator,
  Home,
  IndianRupee,
} from "lucide-react";

interface Props {
  property: Property;
  onEnquireRoom?: (room: PgRoom) => void;
}

export default function PgDetailsSection({ property, onEnquireRoom }: Props) {
  const pgDetails: PgDetails | undefined = property.pgDetails;
  const rooms: PgRoom[] = pgDetails?.rooms || [];

  if (!pgDetails && (property.purpose || "").toLowerCase() !== "pg / co-living" && (property.purpose || "").toLowerCase() !== "pg_co_living") {
    return null;
  }

  const facilities = pgDetails?.facilities || property.amenities || [];
  const rules = pgDetails?.rules;
  const charges = pgDetails?.charges;

  return (
    <div className="space-y-8 mt-6">
      {/* PG Overview Banner */}
      <div className="bg-[#FFF9EC] border border-[#F3E5C8] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-block bg-[#C89B1C] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {pgDetails?.accommodationType || "PG / Co-Living"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {pgDetails?.pgName || property.society || property.propertyType}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Located in {property.locality ? `${property.locality}, ` : ""}{property.city}
            </p>
          </div>

          {pgDetails?.suitableFor && (
            <div className="bg-white border border-[#E6DCC2] px-4 py-2.5 rounded-2xl text-center shadow-2xs">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suitable For</span>
              <span className="text-sm font-extrabold text-[#C89B1C]">For {pgDetails.suitableFor}</span>
            </div>
          )}
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#F4E3B5]">
          {pgDetails?.occupantType && (
            <span className="bg-white text-gray-700 border border-[#E6DCC2] text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Users size={14} className="text-[#C89B1C]" />
              Target: {pgDetails.occupantType}
            </span>
          )}

          {pgDetails?.foodAvailability && (
            <span className="bg-white text-gray-700 border border-[#E6DCC2] text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Utensils size={14} className="text-[#C89B1C]" />
              Food: {pgDetails.foodAvailability}
              {pgDetails.mealsIncluded && pgDetails.mealsIncluded.length > 0 && ` (${pgDetails.mealsIncluded.join(", ")})`}
            </span>
          )}

          {pgDetails?.furnishing && (
            <span className="bg-white text-gray-700 border border-[#E6DCC2] text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Home size={14} className="text-[#C89B1C]" />
              Furnishing: {pgDetails.furnishing}
            </span>
          )}

          {pgDetails?.moveInAvailability && (
            <span className="bg-white text-gray-700 border border-[#E6DCC2] text-xs font-semibold px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Clock size={14} className="text-[#C89B1C]" />
              Move-in: {pgDetails.moveInAvailability}
            </span>
          )}
        </div>
      </div>

      {/* Room Availability Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bed size={22} className="text-[#C89B1C]" />
            Room Availability & Pricing
          </h3>
          <span className="text-xs text-gray-500 font-medium">Per person / per month</span>
        </div>

        {rooms.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
            No specific room configurations listed for this PG. Please contact the publisher for current availability.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room, idx) => {
              const rCount = room.roomCount || 1;
              const totCapacity = rCount * room.totalBeds;
              const avail = room.availableBeds;
              let statusBg = "bg-green-100 text-green-800 border-green-200";
              let statusText = `Open (${avail} Beds Free)`;
              if (room.status === "UNAVAILABLE") {
                statusBg = "bg-red-100 text-red-800 border-red-200";
                statusText = "Unavailable / Closed";
              } else if (room.status === "BLOCKED") {
                statusBg = "bg-gray-100 text-gray-700 border-gray-200";
                statusText = "Blocked / Maintenance";
              } else if (room.status === "FULL" || avail === 0) {
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
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#C89B1C] bg-[#FFF9EC] px-2.5 py-0.5 rounded-md border border-[#F3E5C8]">
                            {room.roomType}
                          </span>
                          <span className="inline-block text-[10px] font-bold text-[#856108] bg-[#FAF4E8] px-2.5 py-0.5 rounded-md border border-[#E6DCC2]">
                            {rCount} {rCount > 1 ? "Rooms Available" : "Room"}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xl text-gray-900">
                          ₹{room.pricePerPerson.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-normal text-gray-500">/ person / month</span>
                        </h4>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusBg}`}>
                        {statusText}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 my-3 text-gray-600">
                      <div>
                        <span className="text-gray-400">Total Capacity:</span>{" "}
                        <span className="font-bold text-gray-800">{rCount} {rCount > 1 ? "Rooms" : "Room"} ({totCapacity} Beds)</span>
                      </div>
                      <div>
                        <span className="text-gray-400">AC Status:</span>{" "}
                        <span className="font-bold text-gray-800">{room.ac ? "AC Room" : "Non-AC"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Bathroom:</span>{" "}
                        <span className="font-bold text-gray-800">{room.bathroomType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Security Deposit:</span>{" "}
                        <span className="font-bold text-gray-800">
                          ₹{(room.securityDeposit || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {room.description && (
                      <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">
                        "{room.description}"
                      </p>
                    )}
                  </div>

                  {onEnquireRoom && (
                    <button
                      type="button"
                      onClick={() => onEnquireRoom(room)}
                      className="w-full py-2.5 rounded-xl bg-[#C89B1C] hover:bg-[#B58A16] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer text-center"
                    >
                      Enquire For This Room
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Facilities Grid */}
      {facilities.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            PG Facilities & Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF9F5] border border-[#E6DCC2] rounded-xl flex items-center gap-2 text-xs font-bold text-gray-800"
              >
                <div className="w-6 h-6 rounded-md bg-[#FFF9EC] text-[#C89B1C] flex items-center justify-center shrink-0">
                  <Check size={14} />
                </div>
                <span>{fac}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules & Restrictions */}
      {rules && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert size={20} className="text-[#C89B1C]" />
            House Rules & Terms
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E6DCC2] rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-gray-900 text-sm mb-2">Policies & Timings</div>
              {rules.visitorPolicy && (
                <div><span className="text-gray-400">Visitor Policy:</span> <span className="font-bold text-gray-800">{rules.visitorPolicy}</span></div>
              )}
              {rules.curfew && (
                <div><span className="text-gray-400">Curfew Timing:</span> <span className="font-bold text-gray-800">{rules.curfew}</span></div>
              )}
              {rules.noticePeriod && (
                <div><span className="text-gray-400">Notice Period:</span> <span className="font-bold text-gray-800">{rules.noticePeriod}</span></div>
              )}
              {rules.lockInPeriod && (
                <div><span className="text-gray-400">Lock-in Period:</span> <span className="font-bold text-gray-800">{rules.lockInPeriod}</span></div>
              )}
            </div>

            <div className="p-4 bg-white border border-[#E6DCC2] rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-gray-900 text-sm mb-2">Restrictions</div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-gray-400">Smoking:</span> <span className="font-bold text-gray-800">{rules.smokingAllowed ? "Allowed" : "Not Allowed"}</span></div>
                <div><span className="text-gray-400">Alcohol:</span> <span className="font-bold text-gray-800">{rules.alcoholAllowed ? "Allowed" : "Not Allowed"}</span></div>
                <div><span className="text-gray-400">Pets:</span> <span className="font-bold text-gray-800">{rules.petsAllowed ? "Allowed" : "Not Allowed"}</span></div>
                <div><span className="text-gray-400">Cooking:</span> <span className="font-bold text-gray-800">{rules.cookingAllowed ? "Allowed" : "Not Allowed"}</span></div>
              </div>
              {rules.otherRules && (
                <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                  {rules.otherRules}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
