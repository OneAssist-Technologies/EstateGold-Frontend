"use client";

import { useState } from "react";
import {
  Calendar,
  IndianRupee,
  Upload,
  Film,
  Image as ImageIcon,
  X,
  Play,
  Sparkles,
  Loader2,
} from "lucide-react";

import { PropertyFormData } from "../../../types/property";
import api from "../../../lib/api";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
  errors?: Record<string, string>;
}

export default function PricePhotosStep({
  formData,
  setFormData,
  errors,
}: Props) {
  const [generating, setGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    try {
      setGenerating(true);
      const res = await api.post("/ai/generate-description", formData);
      if (res.data && res.data.description) {
        setFormData((prev) => ({
          ...prev,
          description: res.data.description,
        }));
      }
    } catch (err) {
      console.error("Failed to generate description:", err);
      alert("Failed to generate AI description. Please try again.");
    } finally {
      setGenerating(false);
    }
  };
  const hasLocality = formData.city && formData.locality && formData.propertyType;
  const isInsightAvailable = formData.marketInsight && formData.marketInsight.success;
  const estimatedPricePerSqft = isInsightAvailable ? formData.marketInsight?.estimatedPricePerSqft : null;
  const estimatedPropertyValue = isInsightAvailable ? formData.marketInsight?.estimatedPropertyValue : null;
  const supported = isInsightAvailable ? (formData.marketInsight?.supported ?? true) : false;
  const message = formData.marketInsight?.message || "";

  const highlights = isInsightAvailable ? formData.marketInsight?.marketData?.highlights || [] : [];
  const retrievedAt = isInsightAvailable ? formData.marketInsight?.retrievedAt : null;

  const getRelevantArea = () => {
    if (formData.propertyType === "Plot / Land" || formData.propertyType === "Residential Plot" || formData.propertyType === "Agricultural Land") {
      return formData.plotArea || 0;
    }
    return formData.area || 0;
  };
  const area = getRelevantArea();
  const propertyPricePerSqft = area > 0 && formData.price ? formData.price / area : 0;

  const percentageDifference = estimatedPricePerSqft && propertyPricePerSqft
    ? ((propertyPricePerSqft - estimatedPricePerSqft) / estimatedPricePerSqft) * 100
    : 0;

  const formatPrice = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...selected],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#161616]">
        Price & Media
      </h2>

      <p className="mt-1.5 sm:mt-2 text-xs sm:text-base md:text-lg text-[#6B7280]">
        Set the price and upload property photos or videos
      </p>

      <div className="space-y-6 sm:space-y-8 mt-6 sm:mt-10">

        {/* Pricing & Market Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Price Input Column */}
          <div className="flex flex-col justify-center">
            <label className="block mb-3 text-sm sm:text-lg font-medium text-[#161616]">
              Expected Price (Total Price)
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="number"
                placeholder="5000000"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      price: Number(
                        e.target.value
                      ),
                    })
                  )
                }
                className={`
                  w-full
                  h-12
                  sm:h-16
                  rounded-2xl
                  border
                  pl-10
                  sm:pl-12
                  pr-4
                  text-sm
                  sm:text-lg
                  outline-none
                  focus:border-[#C89B1C]
                  ${errors?.price ? "border-red-500 bg-red-50/10 focus:border-red-500" : "border-[#E5D8B3]"}
                `}
              />
              {errors?.price && (
                <p className="text-red-500 text-xs mt-1 font-semibold pl-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Market Insight Column */}
          <div className="flex flex-col justify-between">
            {!hasLocality ? (
              <div className="border border-dashed border-[#E5D8B3] rounded-3xl p-5 min-h-[120px] flex flex-col justify-center items-center text-center text-gray-400 bg-gray-50/20">
                <span className="text-xl mb-1">📍</span>
                <p className="text-xs font-semibold">
                  Enter locality, city and property type in previous steps to view local market insights.
                </p>
              </div>
            ) : !formData.marketInsight ? (
              <div className="border border-[#E5D8B3] rounded-3xl p-5 min-h-[120px] flex flex-col justify-center items-center text-center text-gray-500 bg-[#FAF8F5]">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-[#C89B1C] animate-spin mb-1.5" />
                <p className="text-xs font-semibold animate-pulse">
                  Loading locality insights...
                </p>
              </div>
            ) : (!isInsightAvailable || !supported) ? (
              <div className="border border-red-100 rounded-3xl p-5 min-h-[120px] flex flex-col justify-center items-center text-center text-red-800 bg-red-50/20">
                <span className="text-xl mb-1">⚠️</span>
                <p className="text-xs font-bold">
                  {message || "Market insight unavailable for this location."}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  You can still proceed to list your property.
                </p>
              </div>
            ) : (
              <div className="border border-[#E5D8B3] bg-[#FAF8F5] rounded-3xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    📊 Local Market Insight
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Locality benchmark comparison and highlights
                  </p>

                  <div className="mt-3.5 space-y-3">
                    {estimatedPricePerSqft === null ? (
                      <div className="text-xs text-amber-800 bg-amber-50/40 border border-amber-200 rounded-xl p-2.5 font-semibold">
                        {message || "AVnester market data unavailable for this locality."}
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-gray-400">Locality</span>
                            <span className="text-xs font-semibold text-gray-800 truncate block">
                              {formData.locality}, {formData.city}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-bold tracking-wider text-gray-400">Local Market Price</span>
                            <span className="text-xs font-bold text-gray-900 block">
                              ₹{Number(estimatedPricePerSqft).toLocaleString()} / sq.ft
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {estimatedPropertyValue !== null && estimatedPropertyValue !== undefined && (
                            <div>
                              <span className="block text-[9px] uppercase font-bold tracking-wider text-gray-400">Estimated Property Value</span>
                              <span className="text-xs font-bold text-[#9A720C] block">
                                {formatPrice(Number(estimatedPropertyValue))}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {estimatedPricePerSqft && propertyPricePerSqft > 0 && (
                      <div className={`p-2.5 rounded-xl border ${
                        percentageDifference < -10
                          ? "bg-green-50/40 border-green-200 text-green-800"
                          : percentageDifference > 10
                          ? "bg-amber-50/40 border-amber-200 text-amber-800"
                          : "bg-blue-50/40 border-blue-200 text-blue-800"
                      }`}>
                        <span className="block text-[8px] uppercase font-bold tracking-wider opacity-75">Market Benchmark comparison</span>
                        <span className="text-xs font-black block mt-0.5 leading-none">
                          {percentageDifference < -10 ? (
                            `Below market estimate (${Math.abs(percentageDifference).toFixed(1)}% below)`
                          ) : percentageDifference > 10 ? (
                            `Above market estimate (${percentageDifference.toFixed(1)}% above)`
                          ) : (
                            `Within typical range (${percentageDifference >= 0 ? "+" : ""}${percentageDifference.toFixed(1)}%)`
                          )}
                        </span>
                      </div>
                    )}

                    {highlights.length > 0 && (
                      <div>
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-gray-400 mb-1">Locality Highlights</span>
                        <ul className="space-y-0.5">
                          {highlights.slice(0, 2).map((hl: string, idx: number) => (
                            <li key={idx} className="text-[11px] text-gray-600 flex items-start gap-1 leading-tight">
                              <span className="text-amber-500 shrink-0">✦</span>
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200/60 pt-2.5 mt-3 flex justify-between items-center text-[9px] text-gray-400">
                  <span>Source: AVnester Market Intelligence</span>
                  <span>Retrieved: {retrievedAt ? new Date(retrievedAt).toLocaleDateString() : ""}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm sm:text-lg font-medium text-[#161616]">
              Property Description
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF9EC] hover:bg-[#FFF2D3] active:bg-[#FFEABF] text-[#9A720C] border border-[#E8DCC1] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  AI Writer
                </>
              )}
            </button>
          </div>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  description:
                    e.target.value,
                })
              )
            }
            placeholder="Describe the property — highlight key features, nearby landmarks, society benefits..."
            className="w-full min-h-[140px] rounded-2xl border border-[#E5D8B3] p-4 sm:p-5 outline-none resize-none focus:border-[#C89B1C] text-sm sm:text-base"
          />
        </div>

        {/* Available From */}
        <div>
          <label className="block mb-3 text-sm sm:text-lg font-medium text-[#161616]">
            Available From
          </label>

          <div className="relative">
            <input
              type="date"
              value={
                formData.availableFrom
              }
              onChange={(e) =>
                setFormData(
                  (prev) => ({
                    ...prev,
                    availableFrom:
                      e.target.value,
                  })
                )
              }
              className="w-full h-12 sm:h-16 rounded-2xl border border-[#E5D8B3] px-4 sm:px-5 outline-none focus:border-[#C89B1C] text-sm sm:text-base"
            />

            <Calendar
              size={16}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Upload Photos & Videos */}
        <div>
          <label className="block mb-3 text-sm sm:text-lg font-medium text-[#161616]">
            Upload Photos & Videos
          </label>

          <label
            className={`
              h-40
              sm:h-48
              border-2
              border-dashed
              rounded-2xl
              sm:rounded-3xl
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              hover:bg-[#FFFDF8]
              transition-colors
              group
              p-4
              sm:p-0
              ${errors?.photos ? "border-red-500 bg-red-50/5 hover:bg-red-50/10" : "border-[#E5D8B3]"}
            `}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9EA] flex items-center justify-center border border-[#F3E5C8] group-hover:scale-105 transition-transform">
              <Upload
                size={24}
                className="text-[#C89B1C]"
              />
            </div>

            <p className="mt-3 text-base sm:text-xl font-bold text-[#161616]">
              Click to upload photos or videos
            </p>

            <p className="mt-1 text-[10px] sm:text-xs text-gray-500 text-center">
              JPG, PNG, WEBP, MP4, WEBM, MOV up to 50MB each. Min. 3 files recommended.
            </p>

            <input
              hidden
              multiple
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </label>
          {errors?.photos && (
            <p className="text-red-500 text-xs mt-2 font-semibold pl-1">{errors.photos}</p>
          )}

          {/* Existing uploaded photos */}
          {formData.existingPhotos && formData.existingPhotos.length > 0 && (
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Existing Uploaded Media
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.existingPhotos.map((photo, idx) => {
                  const imageUrl = photo.startsWith("http")
                    ? photo
                    : `http://localhost:5000/uploads/properties/${photo}`;

                  return (
                    <div
                      key={photo}
                      className="relative h-24 rounded-2xl overflow-hidden border border-[#ECE7DB] bg-gray-900 group shadow-xs"
                    >
                      <img
                        src={imageUrl}
                        alt="Property Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <ImageIcon size={10} /> Photo
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            existingPhotos: (prev.existingPhotos || []).filter((_, i) => i !== idx),
                          }));
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Media Count Badge & Preview List */}
          {formData.photos && formData.photos.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8B630B] bg-[#FFFBF0] px-4 py-2.5 rounded-xl border border-[#F3E5C8]">
                <span className="flex items-center gap-1.5">
                  <Film size={15} />
                  <span>
                    {formData.photos.length} media file(s) selected
                  </span>
                </span>
                <span className="text-[11px] text-gray-500">
                  {formData.photos.filter((f) => f.type?.startsWith("video/")).length} Video(s),{" "}
                  {formData.photos.filter((f) => f.type?.startsWith("image/")).length} Image(s)
                </span>
              </div>

              {/* Grid Thumbnails Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.photos.map((file, idx) => {
                  const isVideo = file.type?.startsWith("video/");
                  const previewUrl = URL.createObjectURL(file);

                  return (
                    <div
                      key={idx}
                      className="relative h-24 rounded-2xl overflow-hidden border border-[#ECE7DB] bg-gray-900 group shadow-xs"
                    >
                      {isVideo ? (
                        <div className="relative w-full h-full">
                          <video
                            src={previewUrl}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                              <Play size={14} className="fill-white translate-x-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Film size={10} /> Video
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={previewUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ImageIcon size={10} /> Photo
                          </span>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}