"use client";

import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  Flag,
  BadgeCheck,
  Hash,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;

  isLoggedIn: boolean;

  onLoginRequired: () => void;

  onShare: () => void;

  onFavourite: () => void;

  onReport: () => void;
}

export default function PropertyInfo({
  property,
  isLoggedIn,
  onLoginRequired,
  onShare,
  onFavourite,
  onReport,
}: Props) {

  const protectedAction = (
    callback: () => void
  ) => {

    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    callback();

  };

  return (

    <div
      className="
        bg-white
        border
        border-[#E8DCC1]
        rounded-[30px]
        p-8
        mt-8
      "
    >

      {/* Top */}

      <div className="flex justify-between items-start">

        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap">

            <span
              className="
                px-4
                py-2
                rounded-full
                bg-[#C89B1C]
                text-white
                text-sm
                font-semibold
              "
            >
              {property.purpose}
            </span>

            <span
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-green-100
                text-green-700
                text-sm
                font-semibold
              "
            >

              <BadgeCheck size={16} />

              Verified

            </span>

          </div>

          <h1
            className="
              text-5xl
              font-bold
              mt-5
              text-[#161616]
            "
          >

            {property.propertyType}

          </h1>

          <div
            className="
              flex
              items-center
              gap-3
              mt-5
              text-gray-500
            "
          >

            <MapPin size={20} />

            <span className="text-lg">

              {property.locality},{" "}
              {property.city}

            </span>

          </div>

          <div
            className="
              flex
              items-center
              gap-8
              mt-6
              flex-wrap
            "
          >

            <div className="flex items-center gap-2">

              <Hash
                size={18}
                className="text-[#C89B1C]"
              />

              <span>

                Property ID :
                {" "}
                {property._id.slice(-8)}

              </span>

            </div>

            <div className="flex items-center gap-2">

              <Calendar
                size={18}
                className="text-[#C89B1C]"
              />

              <span>

                Posted :

                {" "}

                {new Date(
                  property.createdAt
                ).toLocaleDateString()}

              </span>

            </div>

          </div>

        </div>

        {/* Price */}

        <div className="text-right">

          <p className="text-gray-500">

            Starting From

          </p>

          <h2
            className="
              text-5xl
              font-bold
              text-[#C89B1C]
              mt-2
            "
          >

            ₹

            {property.price.toLocaleString(
              "en-IN"
            )}

          </h2>

        </div>

      </div>

      {/* Bottom */}

      <div
        className="
          flex
          gap-4
          mt-10
          flex-wrap
        "
      >

        <button

          onClick={onShare}

          className="
            h-14
            px-7
            rounded-2xl
            border
            border-[#E8DCC1]
            flex
            items-center
            gap-3
            hover:bg-[#FAFAFA]
            transition
          "
        >

          <Share2 size={20} />

          Share

        </button>

        <button

          onClick={() =>
            protectedAction(
              onFavourite
            )
          }

          className="
            h-14
            px-7
            rounded-2xl
            border
            border-[#E8DCC1]
            flex
            items-center
            gap-3
            hover:bg-[#FFF8E8]
            transition
          "
        >

          <Heart size={20} />

          Save Property

        </button>

        <button

          onClick={() =>
            protectedAction(
              onReport
            )
          }

          className="
            h-14
            px-7
            rounded-2xl
            border
            border-red-300
            text-red-600
            flex
            items-center
            gap-3
            hover:bg-red-50
            transition
          "
        >

          <Flag size={20} />

          Report Property

        </button>

      </div>

    </div>

  );

}