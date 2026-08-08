"use client";

import {
  Calendar,
  IndianRupee,
  Upload,
  Film,
  Image as ImageIcon,
  X,
  Play,
} from "lucide-react";

import { PropertyFormData } from "../../types/property";

interface Props {
  formData: PropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<PropertyFormData>
  >;
}

export default function PricePhotosStep({
  formData,
  setFormData,
}: Props) {
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
      <h2 className="text-4xl font-bold text-[#161616]">
        Price & Media
      </h2>

      <p className="mt-2 text-lg text-[#6B7280]">
        Set the price and upload property photos or videos
      </p>

      <div className="space-y-8 mt-10">

        {/* Price */}
        <div>
          <label className="block mb-3 text-lg font-medium text-[#161616]">
            Expected Price (Total Price)
          </label>

          <div className="relative">
            <IndianRupee
              size={18}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-500
              "
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
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-[#E5D8B3]
                pl-12
                pr-4
                text-lg
                outline-none
                focus:border-[#C89B1C]
              "
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-3 text-lg font-medium text-[#161616]">
            Property Description
          </label>

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
            className="
              w-full
              min-h-[140px]
              rounded-2xl
              border
              border-[#E5D8B3]
              p-5
              outline-none
              resize-none
              focus:border-[#C89B1C]
            "
          />
        </div>

        {/* Available From */}
        <div>
          <label className="block mb-3 text-lg font-medium text-[#161616]">
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
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-[#E5D8B3]
                px-5
                outline-none
                focus:border-[#C89B1C]
              "
            />

            <Calendar
              size={18}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                text-gray-500
                pointer-events-none
              "
            />
          </div>
        </div>

        {/* Upload Photos & Videos */}
        <div>
          <label className="block mb-3 text-lg font-medium text-[#161616]">
            Upload Photos & Videos
          </label>

          <label
            className="
              h-48
              border-2
              border-dashed
              border-[#E5D8B3]
              rounded-3xl
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              hover:bg-[#FFFDF8]
              transition-colors
              group
            "
          >
            <div className="w-14 h-14 rounded-full bg-[#FFF9EA] flex items-center justify-center border border-[#F3E5C8] group-hover:scale-105 transition-transform">
              <Upload
                size={28}
                className="text-[#C89B1C]"
              />
            </div>

            <p className="mt-3 text-xl font-bold text-[#161616]">
              Click to upload photos or videos
            </p>

            <p className="mt-1 text-xs text-gray-500">
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