import { SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "../constants/imageConfig";
import { ProcessedImageResult, ProcessedImageMeta } from "../types/imageProcessing";
import { compressImage } from "./imageCompressor";
import { checkImageQuality } from "./imageQuality";
import { computeImageHash } from "./imageDuplicate";

export interface ProcessImageProgressCallback {
  (stage: "validating" | "compressing" | "analyzing" | "complete" | "error", message?: string): void;
}

/**
 * Executes the complete property image processing workflow:
 * 1. Validates file format.
 * 2. Checks file size against 10 MB threshold.
 * 3. Compresses if > 10 MB, maintaining best possible visual quality.
 * 4. Runs quality analysis on the final processed image.
 * 5. Returns the processed File and metadata.
 */
export async function processPropertyImage(
  file: File,
  onProgress?: ProcessImageProgressCallback
): Promise<ProcessedImageResult> {
  // 1. Validate file type
  onProgress?.("validating", "Validating image file...");

  if (!file.type || !isSupportedFileType(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type || "unknown"}". Please upload JPG, JPEG, PNG, or WEBP images.`
    );
  }

  const originalSize = file.size;
  let fileToAnalyze = file;
  let compressed = false;
  let dimensions = { width: 0, height: 0 };

  // 2. Check file size
  if (originalSize > MAX_IMAGE_SIZE_BYTES) {
    onProgress?.("compressing", "Compressing image (>10 MB)...");
    try {
      const compressionResult = await compressImage(file);
      fileToAnalyze = compressionResult.compressedFile;
      compressed = compressionResult.wasCompressed;
      dimensions = {
        width: compressionResult.width,
        height: compressionResult.height,
      };

      // Verify that compression succeeded and reduced size below 10MB or significantly
      if (fileToAnalyze.size > MAX_IMAGE_SIZE_BYTES) {
        console.warn(
          `Compressed image is still ${(fileToAnalyze.size / 1024 / 1024).toFixed(2)} MB`
        );
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Compression failed";
      onProgress?.("error", errMsg);
      throw new Error(
        errMsg || "Unable to process this image. Please upload another image."
      );
    }
  }

  // 3. Run Quality Check on processed image
  onProgress?.("analyzing", "Checking image quality...");
  let qualityResult;
  try {
    qualityResult = await checkImageQuality(fileToAnalyze);
  } catch (err) {
    console.warn("Quality check error:", err);
    qualityResult = {
      status: "warning" as const,
      score: 60,
      reasons: ["Quality evaluation could not complete fully"],
    };
  }

  // 4. Compute Image Fingerprint for Duplicate Detection
  let hash = "";
  try {
    hash = await computeImageHash(fileToAnalyze);
  } catch (err) {
    console.warn("Image hash computation warning:", err);
  }

  // Generate object URL for preview
  const objectUrl = URL.createObjectURL(fileToAnalyze);

  const meta: ProcessedImageMeta = {
    originalSize,
    finalSize: fileToAnalyze.size,
    compressed,
    quality: qualityResult,
    dimensions,
    objectUrl,
    hash,
  };

  onProgress?.("complete", "Processing complete");

  return {
    file: fileToAnalyze,
    meta,
  };
}

/**
 * Checks if file type is among supported image types.
 */
export function isSupportedFileType(mimeType: string): boolean {
  const normalized = mimeType.toLowerCase();
  return (
    SUPPORTED_IMAGE_TYPES.includes(normalized) ||
    normalized.startsWith("image/jpeg") ||
    normalized.startsWith("image/jpg") ||
    normalized.startsWith("image/png") ||
    normalized.startsWith("image/webp")
  );
}

/**
 * Format bytes to readable size string (e.g., 4.8 MB, 850 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
