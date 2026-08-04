"use client";

import { useState } from "react";

import {
  Calendar,
  Clock3,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Property } from "@/src/types/property";

interface Props {
  property: Property;
}

export default function PropertyDescription({
  property,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const description =
    property.description || "";

  const shouldShowButton =
    description.length > 350;

  const displayDescription =
    expanded
      ? description
      : description.slice(0, 350);

  return (
    <div
      className="
        mt-8
        bg-white
        border
        border-[#E8DCC1]
        rounded-[30px]
        p-8
      "
    >
      {/* Header */}

      <div className="flex items-center gap-4">

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-[#FFF5DA]
            text-[#C89B1C]
            flex
            items-center
            justify-center
          "
        >
          <FileText size={28} />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            About this Property
          </h2>

          <p className="text-gray-500 mt-1">
            Complete property description
          </p>

        </div>

      </div>

      {/* Description */}

      <div className="mt-8">

        <p
          className="
            text-[17px]
            leading-8
            text-gray-700
            whitespace-pre-line
          "
        >
          {displayDescription}

          {!expanded &&
            shouldShowButton &&
            "..."}
        </p>

        {shouldShowButton && (

          <button
            onClick={() =>
              setExpanded(
                !expanded
              )
            }
            className="
              mt-6
              text-[#C89B1C]
              font-semibold
              flex
              items-center
              gap-2
              hover:underline
            "
          >
            {expanded ? (
              <>
                Read Less

                <ChevronUp
                  size={18}
                />
              </>
            ) : (
              <>
                Read More

                <ChevronDown
                  size={18}
                />
              </>
            )}
          </button>

        )}

      </div>

      {/* Bottom Info */}

      <div
        className="
          mt-10
          grid
          md:grid-cols-2
          gap-6
        "
      >

        <div
          className="
            bg-[#FCFBF8]
            border
            border-[#E8DCC1]
            rounded-2xl
            p-5
            flex
            items-center
            gap-4
          "
        >

          <Calendar
            className="
              text-[#C89B1C]
            "
          />

          <div>

            <p className="text-gray-500 text-sm">
              Posted On
            </p>

            <h4 className="font-semibold">
              {new Date(
                property.createdAt
              ).toLocaleDateString(
                "en-IN"
              )}
            </h4>

          </div>

        </div>

        <div
          className="
            bg-[#FCFBF8]
            border
            border-[#E8DCC1]
            rounded-2xl
            p-5
            flex
            items-center
            gap-4
          "
        >

          <Clock3
            className="
              text-[#C89B1C]
            "
          />

          <div>

            <p className="text-gray-500 text-sm">
              Available From
            </p>

            <h4 className="font-semibold">
              {new Date(
                property.availableFrom
              ).toLocaleDateString(
                "en-IN"
              )}
            </h4>

          </div>

        </div>

      </div>
    </div>
  );
}