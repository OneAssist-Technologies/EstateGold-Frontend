"use client";

import { useState, useRef, useEffect } from "react";
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
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";

import { PropertyFormData } from "../../../types/property";
import { ProcessedImageMeta } from "../../../types/imageProcessing";
import { processPropertyImage, formatFileSize } from "../../../utils/imageProcessor";
import { detectDuplicates } from "../../../utils/imageDuplicate";
import api from "../../../lib/api";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
  errors?: Record<string, string>;
}

interface ProcessingState {
  isProcessing: boolean;
  stage: string;
  error?: string;
}

export default function PricePhotosStep({
  formData,
  setFormData,
  errors,
}: Props) {
  const [generating, setGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processingMap, setProcessingMap] = useState<Record<number, ProcessingState>>({});
  const [expandedReasons, setExpandedReasons] = useState<Record<number, boolean>>({});
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  // Automatically evaluate duplicate status whenever photos/photoMeta are updated
  useEffect(() => {
    if (!formData.photos || formData.photos.length === 0) return;

    const evaluated = detectDuplicates(formData.photos, formData.photoMeta);
    let hasChanged = false;

    if (!formData.photoMeta || evaluated.length !== formData.photoMeta.length) {
      hasChanged = true;
    } else {
      for (let i = 0; i < evaluated.length; i++) {
        if (
          evaluated[i]?.isDuplicate !== formData.photoMeta[i]?.isDuplicate ||
          evaluated[i]?.duplicateOfIndex !== formData.photoMeta[i]?.duplicateOfIndex
        ) {
          hasChanged = true;
          break;
        }
      }
    }

    if (hasChanged) {
      setFormData((prev) => ({
        ...prev,
        photoMeta: evaluated as ProcessedImageMeta[],
      }));
    }
  }, [formData.photos, formData.photoMeta, setFormData]);

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

  const processFilesBatch = async (files: File[], startIdx: number) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetIdx = startIdx + i;

      // Skip non-image files (e.g. videos) for quality processing
      if (!file.type?.startsWith("image/")) {
        continue;
      }

      setProcessingMap((prev) => ({
        ...prev,
        [targetIdx]: { isProcessing: true, stage: "Initializing..." },
      }));

      try {
        const result = await processPropertyImage(file, (stage, msg) => {
          setProcessingMap((prev) => ({
            ...prev,
            [targetIdx]: {
              isProcessing: true,
              stage: msg || (stage === "compressing" ? "Compressing image..." : "Checking image quality..."),
            },
          }));
        });

        // Update formData with compressed file & quality metadata
        setFormData((prev) => {
          const currentPhotos = [...(prev.photos || [])];
          const currentMeta = [...(prev.photoMeta || [])];
          currentPhotos[targetIdx] = result.file;
          currentMeta[targetIdx] = result.meta;

          const evaluatedMeta = detectDuplicates(currentPhotos, currentMeta);
          return {
            ...prev,
            photos: currentPhotos,
            photoMeta: evaluatedMeta as ProcessedImageMeta[],
          };
        });

        setProcessingMap((prev) => {
          const next = { ...prev };
          delete next[targetIdx];
          return next;
        });
      } catch (err: unknown) {
        console.error("Error processing photo:", err);
        const errMsg = err instanceof Error ? err.message : "Unable to process this image. Please upload another image.";
        setProcessingMap((prev) => ({
          ...prev,
          [targetIdx]: {
            isProcessing: false,
            stage: "error",
            error: errMsg,
          },
        }));
      }
    }
  };

  const handleFileSelection = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const startIdx = (formData.photos || []).length;
    const combinedPhotos = [...(formData.photos || []), ...selectedFiles];
    const evaluatedMeta = detectDuplicates(combinedPhotos, formData.photoMeta);

    setFormData((prev) => ({
      ...prev,
      photos: combinedPhotos,
      photoMeta: evaluatedMeta as ProcessedImageMeta[],
    }));

    processFilesBatch(selectedFiles, startIdx);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    handleFileSelection(selected);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = Array.from(e.dataTransfer.files);
      handleFileSelection(selected);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => {
      const updatedPhotos = (prev.photos || []).filter((_, i) => i !== index);
      const updatedMeta = (prev.photoMeta || []).filter((_, i) => i !== index);
      return {
        ...prev,
        photos: updatedPhotos,
        photoMeta: updatedMeta,
      };
    });

    setProcessingMap((prev) => {
      const next: Record<number, ProcessingState> = {};
      Object.keys(prev).forEach((k) => {
        const keyNum = Number(k);
        if (keyNum < index) {
          next[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          next[keyNum - 1] = prev[keyNum];
        }
      });
      return next;
    });

    setExpandedReasons((prev) => {
      const next: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => {
        const keyNum = Number(k);
        if (keyNum < index) {
          next[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          next[keyNum - 1] = prev[keyNum];
        }
      });
      return next;
    });
  };

  const triggerReplaceFile = (index: number) => {
    setReplacingIndex(index);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;

    const targetIdx = replacingIndex;
    setReplacingIndex(null);
    e.target.value = "";

    // Temporarily set photo at targetIdx
    setFormData((prev) => {
      const updatedPhotos = [...(prev.photos || [])];
      updatedPhotos[targetIdx] = file;
      return { ...prev, photos: updatedPhotos };
    });

    if (!file.type?.startsWith("image/")) {
      return;
    }

    setProcessingMap((prev) => ({
      ...prev,
      [targetIdx]: { isProcessing: true, stage: "Initializing..." },
    }));

    try {
      const result = await processPropertyImage(file, (stage, msg) => {
        setProcessingMap((prev) => ({
          ...prev,
          [targetIdx]: {
            isProcessing: true,
            stage: msg || (stage === "compressing" ? "Compressing image..." : "Checking image quality..."),
          },
        }));
      });

      setFormData((prev) => {
        const currentPhotos = [...(prev.photos || [])];
        const currentMeta = [...(prev.photoMeta || [])];
        currentPhotos[targetIdx] = result.file;
        currentMeta[targetIdx] = result.meta;
        return {
          ...prev,
          photos: currentPhotos,
          photoMeta: currentMeta,
        };
      });

      setProcessingMap((prev) => {
        const next = { ...prev };
        delete next[targetIdx];
        return next;
      });
    } catch (err: unknown) {
      console.error("Replace file error:", err);
      const errMsg = err instanceof Error ? err.message : "Unable to process this image. Please upload another image.";
      setProcessingMap((prev) => ({
        ...prev,
        [targetIdx]: {
          isProcessing: false,
          stage: "error",
          error: errMsg,
        },
      }));
    }
  };

  const isAnyProcessing = Object.values(processingMap).some((p) => p.isProcessing);

  return (
    <div>
      {/* Hidden file input for single image replacement */}
      <input
        type="file"
        ref={replaceInputRef}
        hidden
        accept="image/*"
        onChange={handleReplaceFileChange}
      />

      {/* Header */}
      <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#161616]">
        Price & Media
      </h2>

      <p className="mt-1.5 sm:mt-2 text-xs sm:text-base md:text-lg text-[#6B7280]">
        Set the price and upload property photos or videos
      </p>

      <div className="space-y-6 sm:space-y-8 mt-6 sm:mt-10">
        {/* Price Input */}
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
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
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
                ${
                  errors?.price
                    ? "border-red-500 bg-red-50/10 focus:border-red-500"
                    : "border-[#E5D8B3]"
                }
              `}
            />
            {errors?.price && (
              <p className="text-red-500 text-xs mt-1 font-semibold pl-1">
                {errors.price}
              </p>
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
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
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
              value={formData.availableFrom || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availableFrom: e.target.value,
                }))
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
              transition-all
              group
              p-4
              sm:p-0
              ${
                isDragging
                  ? "border-[#9A720C] bg-[#FFF9EC] scale-[1.01] shadow-md"
                  : errors?.photos
                  ? "border-red-500 bg-red-50/5 hover:bg-red-50/10"
                  : "border-[#E5D8B3] hover:bg-[#FFFDF8] hover:border-[#C89B1C]"
              }
            `}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF9EA] flex items-center justify-center border border-[#F3E5C8] transition-transform ${
                isDragging ? "scale-125" : "group-hover:scale-105"
              }`}
            >
              <Upload size={24} className="text-[#C89B1C]" />
            </div>

            <p className="mt-3 text-base sm:text-xl font-bold text-[#161616]">
              {isDragging
                ? "Drop Media Files Here"
                : "Drag & drop or Click to upload photos or videos"}
            </p>

            <p className="mt-1 text-[10px] sm:text-xs text-gray-500 text-center">
              JPG, PNG, WEBP, MP4, WEBM up to 50MB each. Automatic quality check & &gt;10MB compression applied.
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
            <p className="text-red-500 text-xs mt-2 font-semibold pl-1">
              {errors.photos}
            </p>
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
                      className="relative h-28 rounded-2xl overflow-hidden border border-[#ECE7DB] bg-gray-900 group shadow-xs"
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
                            existingPhotos: (
                              prev.existingPhotos || []
                            ).filter((_, i) => i !== idx),
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

          {/* Selected Media Count Badge & Preview Grid */}
          {formData.photos && formData.photos.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8B630B] bg-[#FFFBF0] px-4 py-2.5 rounded-xl border border-[#F3E5C8]">
                <span className="flex items-center gap-1.5">
                  <Film size={15} />
                  <span>{formData.photos.length} media file(s) selected</span>
                </span>
                <span className="text-[11px] text-gray-500">
                  {formData.photos.filter((f) => f.type?.startsWith("video/")).length} Video(s),{" "}
                  {formData.photos.filter((f) => f.type?.startsWith("image/")).length} Image(s)
                </span>
              </div>

              {/* Global Processing State Banner */}
              {isAnyProcessing && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#9A720C] bg-[#FFF9EA] px-4 py-3 rounded-xl border border-[#F3E5C8] animate-pulse">
                  <Loader2 size={16} className="animate-spin text-[#C89B1C]" />
                  <span>Processing & quality checking selected images...</span>
                </div>
              )}

              {/* Grid Thumbnails Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((file, idx) => {
                  const isVideo = file.type?.startsWith("video/");
                  const meta = formData.photoMeta?.[idx];
                  const procState = processingMap[idx];
                  const previewUrl = meta?.objectUrl || URL.createObjectURL(file);
                  const isLowQuality = meta?.quality?.status === "low";
                  const isWarningQuality = meta?.quality?.status === "warning";
                  const isGoodQuality = meta?.quality?.status === "good";
                  const isDuplicate = meta?.isDuplicate;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden border transition-all shadow-xs bg-white flex flex-col ${
                        procState?.error
                          ? "border-red-500 bg-red-50/20"
                          : isDuplicate
                          ? "border-amber-500 ring-2 ring-amber-500/40 bg-amber-50/20"
                          : isLowQuality
                          ? "border-red-400 ring-2 ring-red-400/30 bg-red-50/10"
                          : isWarningQuality
                          ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-50/10"
                          : "border-[#ECE7DB] hover:border-[#C89B1C]"
                      }`}
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-36 w-full bg-gray-900 group overflow-hidden">
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

                        {/* Processing Loading Overlay */}
                        {procState?.isProcessing && (
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white z-10">
                            <Loader2 size={22} className="animate-spin text-[#C89B1C] mb-1.5" />
                            <span className="text-xs font-bold">{procState.stage}</span>
                          </div>
                        )}

                        {/* Error Overlay */}
                        {procState?.error && (
                          <div className="absolute inset-0 bg-red-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white z-10">
                            <AlertTriangle size={22} className="text-red-400 mb-1" />
                            <span className="text-xs font-bold text-red-200">
                              {procState.error}
                            </span>
                          </div>
                        )}

                        {/* Top Action Buttons (Replace & Remove) */}
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5 z-20">
                          {!isVideo && (
                            <button
                              type="button"
                              onClick={() => triggerReplaceFile(idx)}
                              className="px-2 py-1 rounded-lg bg-black/75 hover:bg-[#C89B1C] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              title="Replace image"
                            >
                              <RefreshCw size={10} /> Replace
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="w-6 h-6 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            title="Remove file"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Photo Metadata & Quality Result Footer */}
                      {!isVideo && (
                        <div className="p-3 text-xs space-y-2">
                          {/* File Size & Compression Info */}
                          <div className="flex items-center justify-between text-gray-600 font-medium">
                            <span className="text-[11px] font-bold text-gray-800 truncate max-w-[140px]">
                              {file.name}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                              {formatFileSize(file.size)}
                              {meta?.compressed && (
                                <span className="text-[10px] text-amber-700 font-bold ml-1">
                                  (Compressed)
                                </span>
                              )}
                            </span>
                          </div>

                          {/* Quality Result Badge */}
                          {meta?.quality && (
                            <div>
                              {isGoodQuality && (
                                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl font-bold text-[11px]">
                                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                  <span>✓ Good quality image</span>
                                </div>
                              )}

                              {isWarningQuality && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl font-bold text-[11px]">
                                    <span className="flex items-center gap-1.5">
                                      <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                                      <span>⚠ Image quality may be low</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedReasons((prev) => ({
                                          ...prev,
                                          [idx]: !prev[idx],
                                        }))
                                      }
                                      className="text-amber-800 hover:text-amber-900 underline text-[10px] cursor-pointer"
                                    >
                                      {expandedReasons[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                  </div>
                                  <p className="text-[10px] font-semibold text-amber-800 px-1 leading-snug">
                                    Low-quality photos decrease search ranking & buyer inquiries. Replace for higher priority.
                                  </p>
                                </div>
                              )}

                              {isLowQuality && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-red-800 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-xl font-bold text-[11px]">
                                    <span className="flex items-center gap-1.5">
                                      <AlertTriangle size={13} className="text-red-600 shrink-0" />
                                      <span>⚠ Low quality image</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedReasons((prev) => ({
                                          ...prev,
                                          [idx]: !prev[idx],
                                        }))
                                      }
                                      className="text-red-800 hover:text-red-900 underline text-[10px] cursor-pointer"
                                    >
                                      {expandedReasons[idx] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    </button>
                                  </div>
                                  <p className="text-[10px] font-semibold text-red-700 px-1 leading-snug">
                                    Low-quality image detected. This places your property in lower search priority. Please replace it to boost leads.
                                  </p>
                                </div>
                              )}

                              {/* Duplicate Image Warning Badge */}
                              {isDuplicate && (
                                <div className="mt-1.5 space-y-1">
                                  <div className="flex items-center gap-1.5 text-amber-950 bg-amber-100/90 border border-amber-300 px-2.5 py-1.5 rounded-xl font-bold text-[11px]">
                                    <Copy size={13} className="text-amber-800 shrink-0" />
                                    <span>⚠ Duplicate Image</span>
                                  </div>
                                  <p className="text-[10px] font-semibold text-amber-900 px-1 leading-snug">
                                    This image is already selected in your upload list. Please replace or remove it.
                                  </p>
                                </div>
                              )}

                              {/* Quality Reasons Dropdown */}
                              {(isLowQuality || isWarningQuality) && expandedReasons[idx] && meta.quality.reasons.length > 0 && (
                                <div className="mt-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[10px] text-gray-700">
                                  <span className="font-bold text-gray-800 block">Quality Findings:</span>
                                  <ul className="list-disc pl-3.5 space-y-0.5">
                                    {meta.quality.reasons.map((r, rIdx) => (
                                      <li key={rIdx}>{r}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Priority Notice Banner for Low Quality / Warning Images */}
              {formData.photoMeta?.some((m) => m?.quality?.status === "low" || m?.quality?.status === "warning") && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 flex items-start gap-3 shadow-xs">
                  <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 shrink-0 mt-0.5">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Priority Impact Notice: Low Quality Images Detected</span>
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                      Listings with low-quality or unclear images are assigned <strong>lower search priority</strong> and receive up to <strong>5x fewer buyer inquiries</strong>. To maximize your property&apos;s search ranking, buyer reach, and response rate, we strongly recommend replacing flagged images with clear, high-resolution photos.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}