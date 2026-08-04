"use client";

import {
  Phone,
  MessageCircle,
  Pencil,
  Eye,
  Lock,
  UserPlus,
  LogIn,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import type { User } from "@/src/context/AuthContext";

import type { Property } from "@/src/types/property";

interface Props {
  property: Property;
  user?: User | null;

  onLogin: () => void;
  onRequestCallback: () => void;
  onCall: () => void;
  onWhatsapp: () => void;
  onEdit: () => void;
  onViewEnquiries: () => void;
  onToggleStatus: () => void;
}

export default function StickyContactCard({
  property,
  user,
  onLogin,
  onRequestCallback,
  onCall,
  onWhatsapp,
  onEdit,
  onViewEnquiries,
  onToggleStatus,
}: Props) {

  const isGuest = !user;

  const isOwner =
    user?._id === property.createdBy;

  const canManage =
    isOwner &&
    (user?.role === "seller"||
      user?.role === "agent");

  return (

    <div
      className="
        sticky
        top-24
        bg-white
        rounded-3xl
        border
        border-[#E8DCC1]
        overflow-hidden
        shadow-lg
      "
    >

      {/* Header */}

      <div
        className="
          bg-gradient-to-r
          from-[#B8860B]
          to-[#D4AF37]
          text-white
          p-8
        "
      >

        <h2 className="text-4xl font-bold">

          ₹ {property.price.toLocaleString("en-IN")}

        </h2>

        <p className="mt-2 opacity-90">

          {property.propertyType}

        </p>

      </div>

      <div className="p-7">

        {/* GUEST */}

        {isGuest && (

          <>

            <div
              className="
                bg-[#FFF9ED]
                rounded-2xl
                p-6
                text-center
              "
            >

              <Lock
                size={45}
                className="mx-auto text-[#C89B1C]"
              />

              <h3 className="text-2xl font-bold mt-5">

                Login Required

              </h3>

              <p className="text-gray-500 mt-3">

                Login to contact owner, save
                property and request callback.

              </p>

            </div>

            <button
              onClick={onLogin}
              className="
                w-full
                h-14
                mt-6
                rounded-2xl
                bg-[#C89B1C]
                text-white
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <LogIn size={20} />

              Login

            </button>

            <button
              onClick={onLogin}
              className="
                w-full
                h-14
                mt-4
                rounded-2xl
                border-2
                border-[#C89B1C]
                text-[#C89B1C]
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <UserPlus size={20} />

              Register

            </button>

          </>

        )}

        {/* OWNER / AGENT */}

        {!isGuest && canManage && (

          <div className="space-y-4">

            <div
              className="
                bg-[#F8F8F8]
                rounded-2xl
                p-5
              "
            >

              <h3 className="font-semibold">

                This is your property

              </h3>

              <p className="text-sm text-gray-500 mt-2">

                Manage your listing below.

              </p>

            </div>

            <button
              onClick={onEdit}
              className="
                w-full
                h-14
                rounded-2xl
                bg-[#C89B1C]
                text-white
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <Pencil size={18} />

              Edit Property

            </button>

            <button
              onClick={onViewEnquiries}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#E8DCC1]
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <Eye size={18} />

              View Enquiries

            </button>

            <button
              onClick={onToggleStatus}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#E8DCC1]
                flex
                items-center
                justify-center
                gap-3
              "
            >

              {property.status === "approved" ? (

                <>
                  <ToggleRight
                    className="text-green-600"
                  />
                  Deactivate Property
                </>

              ) : (

                <>
                  <ToggleLeft
                    className="text-red-600"
                  />
                  Activate Property
                </>

              )}

            </button>

          </div>

        )}

        {/* BUYER OR OTHER OWNER */}

        {!isGuest && !canManage && (

          <div className="space-y-4">

            <button
              onClick={onRequestCallback}
              className="
                w-full
                h-14
                rounded-2xl
                bg-[#C89B1C]
                text-white
                font-semibold
              "
            >

              Request Callback

            </button>

            <button
              onClick={onCall}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#E8DCC1]
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <Phone size={20} />

              Call Owner

            </button>

            <button
              onClick={onWhatsapp}
              className="
                w-full
                h-14
                rounded-2xl
                border
                border-[#25D366]
                text-[#25D366]
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <MessageCircle size={20} />

              WhatsApp

            </button>

          </div>

        )}

      </div>

    </div>

  );
}