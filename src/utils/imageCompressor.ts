import { MAX_IMAGE_SIZE_BYTES, RESOLUTION_LIMITS } from "../constants/imageConfig";

export interface CompressionOptions {
  maxSizeBytes?: number;
  initialQuality?: number;
  minQuality?: number;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
  width: number;
  height: number;
}

/**
 * Compresses an image file client-side using HTML5 Canvas API while preserving visual quality.
 * Does not downscale dimensions unless resolution exceeds maximum safe limits.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const maxSizeBytes = options.maxSizeBytes || MAX_IMAGE_SIZE_BYTES;
  const initialQuality = options.initialQuality || 0.90;
  const minQuality = options.minQuality || 0.65;

  const originalSize = file.size;

  // If file is already below max size and is supported, we can load it to get dimensions
  const imageBitmap = await loadImage(file);
  const { width: origWidth, height: origHeight } = imageBitmap;

  let width = origWidth;
  let height = origHeight;

  // Scale down dimensions ONLY if image is extremely large (> 3840px in any dimension)
  if (width > RESOLUTION_LIMITS.SAFE_MAX_DIMENSION || height > RESOLUTION_LIMITS.SAFE_MAX_DIMENSION) {
    const scale = RESOLUTION_LIMITS.SAFE_MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // If file is already <= max size and dimensions were not scaled down, return original
  if (originalSize <= maxSizeBytes && width === origWidth && height === origHeight) {
    return {
      compressedFile: file,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
      width,
      height,
    };
  }

  // Draw image on canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  // Iteratively determine quality parameter to bring file size <= maxSizeBytes
  let quality = initialQuality;
  let blob: Blob | null = null;
  const mimeType = file.type === "image/png" ? "image/jpeg" : file.type; // PNG compressed to JPEG/WEBP for effective size reduction if needed

  // Try higher quality first
  blob = await canvasToBlob(canvas, mimeType, quality);

  // If still above max size, step down quality iteratively
  while (blob && blob.size > maxSizeBytes && quality > minQuality) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  // If still above max size after quality reduction, scale dimensions moderately (e.g. 85%) and retry
  let scaleStep = 0.85;
  while (blob && blob.size > maxSizeBytes && scaleStep >= 0.5) {
    const scaledWidth = Math.round(width * scaleStep);
    const scaledHeight = Math.round(height * scaleStep);

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const scaledCtx = canvas.getContext("2d");
    if (scaledCtx) {
      scaledCtx.imageSmoothingEnabled = true;
      scaledCtx.imageSmoothingQuality = "high";
      scaledCtx.drawImage(imageBitmap, 0, 0, scaledWidth, scaledHeight);
      blob = await canvasToBlob(canvas, mimeType, quality);
      width = scaledWidth;
      height = scaledHeight;
    }
    scaleStep -= 0.15;
  }

  if (!blob) {
    throw new Error("Failed to convert compressed canvas to blob");
  }

  // Preserve original filename extension or update if converted
  let newFileName = file.name;
  if (file.type === "image/png" && mimeType === "image/jpeg") {
    newFileName = file.name.replace(/\.png$/i, ".jpg");
  }

  const compressedFile = new File([blob], newFileName, {
    type: blob.type || mimeType,
    lastModified: Date.now(),
  });

  return {
    compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    wasCompressed: true,
    width,
    height,
  };
}

/**
 * Loads an HTMLImageElement from a File safely.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to process this image. Please upload another image."));
    };

    img.src = url;
  });
}

/**
 * Converts a HTMLCanvasElement to Blob safely.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      type,
      quality
    );
  });
}
