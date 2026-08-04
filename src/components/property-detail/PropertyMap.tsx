"use client";

import {
  MapPin,
  Navigation,
  Copy,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";

interface Props {
  address: string;
  locality: string;
  city: string;
}

export default function PropertyMap({
  address,
  locality,
  city,
}: Props) {
  const [copied, setCopied] =
    useState(false);

  const fullAddress = `${address}, ${locality}, ${city}`;

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const googleMap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress
  )}`;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(
      fullAddress
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className="
        mt-8
        bg-white
        border
        border-[#E8DCC1]
        rounded-[30px]
        overflow-hidden
      "
    >
      {/* Header */}

      <div className="p-8">

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
            <MapPin size={30} />
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Property Location
            </h2>

            <p className="text-gray-500 mt-1">
              View the exact location of
              this property.
            </p>

          </div>

        </div>

        {/* Address */}

        <div
          className="
            mt-8
            p-6
            rounded-2xl
            border
            border-[#E8DCC1]
            bg-[#FCFBF8]
          "
        >

          <div className="flex justify-between items-start gap-6">

            <div className="flex gap-4">

              <MapPin
                className="text-[#C89B1C] mt-1"
                size={22}
              />

              <div>

                <h3 className="font-semibold text-lg">
                  Property Address
                </h3>

                <p className="text-gray-600 mt-2 leading-7">
                  {fullAddress}
                </p>

              </div>

            </div>

            <button
              onClick={copyAddress}
              className="
                h-12
                px-5
                rounded-xl
                border
                border-[#E8DCC1]
                flex
                items-center
                gap-3
                hover:bg-[#FFF9EC]
                transition
              "
            >
              {copied ? (
                <>
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />

                  Copied
                </>
              ) : (
                <>
                  <Copy size={18} />

                  Copy
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Google Map */}

      <div className="px-8 pb-8">

        <div
          className="
            rounded-3xl
            overflow-hidden
            border
            border-[#E8DCC1]
            h-[520px]
          "
        >

          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            loading="lazy"
            style={{
              border: 0,
            }}
          />

        </div>

        {/* Button */}

        <div className="mt-6">

          <a
            href={googleMap}
            target="_blank"
            rel="noopener noreferrer"
            className="
              h-14
              w-fit
              px-8
              rounded-2xl
              bg-[#C89B1C]
              hover:bg-[#B8860B]
              text-white
              font-semibold
              flex
              items-center
              gap-3
              transition
            "
          >

            <Navigation size={20} />

            Open in Google Maps

          </a>

        </div>

      </div>

    </div>
  );
}