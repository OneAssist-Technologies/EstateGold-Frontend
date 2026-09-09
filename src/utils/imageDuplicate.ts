import { ProcessedImageMeta } from "../types/imageProcessing";

/**
 * Computes a 64-bit Difference Hash (dHash) fingerprint for an image File.
 * dHash evaluates visual gradients and is resilient to renaming, small resizes, and compression.
 */
export async function computeImageHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const hash = generateDHash(img);
        resolve(hash);
      } catch (err) {
        console.warn("Failed to generate dHash fingerprint:", err);
        resolve("");
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };

    img.src = url;
  });
}

/**
 * Generates 64-bit dHash string by drawing image onto a 9x8 canvas and comparing adjacent pixel brightness.
 */
function generateDHash(img: HTMLImageElement): string {
  const width = 9;
  const height = 8;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "";

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Calculate luminance for 9x8 = 72 pixels
  const luminanceGrid: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Grayscale luminance formula
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      row.push(lum);
    }
    luminanceGrid.push(row);
  }

  // Compare adjacent pixels horizontally to create 64-bit binary string
  let hashBits = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const currentPixel = luminanceGrid[y][x];
      const nextPixel = luminanceGrid[y][x + 1];
      hashBits += currentPixel < nextPixel ? "1" : "0";
    }
  }

  return hashBits;
}

/**
 * Calculates the Hamming distance (number of differing bits) between two binary hash strings.
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) {
    return Infinity;
  }

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }

  return distance;
}

/**
 * Scans an array of File objects and ProcessedImageMeta objects to identify duplicates.
 * Checks for exact file matches (name + size) AND perceptual visual hash matches (dHash distance <= 8).
 */
export function detectDuplicates(
  photos: File[],
  metaList?: (ProcessedImageMeta | undefined)[],
  maxHammingDistance = 8
): (ProcessedImageMeta | undefined)[] {
  if (!photos || photos.length === 0) return metaList || [];

  const result: (ProcessedImageMeta | undefined)[] = photos.map((_, idx) => {
    const existing = metaList?.[idx];
    return existing ? { ...existing } : undefined;
  });

  for (let i = 0; i < photos.length; i++) {
    const currentFile = photos[i];
    const currentMeta = result[i];
    let foundDuplicate = false;

    for (let j = 0; j < i; j++) {
      const prevFile = photos[j];
      const prevMeta = result[j];

      // Check 1: File Name and File Size Match
      if (
        currentFile &&
        prevFile &&
        currentFile.name === prevFile.name &&
        currentFile.size === prevFile.size
      ) {
        foundDuplicate = true;
        if (currentMeta) {
          currentMeta.isDuplicate = true;
          currentMeta.duplicateOfIndex = j;
        } else {
          result[i] = {
            originalSize: currentFile.size,
            finalSize: currentFile.size,
            compressed: false,
            quality: { status: "good", score: 80, reasons: [] },
            dimensions: { width: 0, height: 0 },
            objectUrl: "",
            isDuplicate: true,
            duplicateOfIndex: j,
          };
        }
        break;
      }

      // Check 2: Processed Metadata Size & Name Match
      if (
        currentMeta?.originalSize &&
        prevMeta?.originalSize &&
        currentMeta.originalSize === prevMeta.originalSize &&
        currentMeta.finalSize === prevMeta.finalSize &&
        currentFile?.name === prevFile?.name
      ) {
        foundDuplicate = true;
        currentMeta.isDuplicate = true;
        currentMeta.duplicateOfIndex = j;
        break;
      }

      // Check 3: Perceptual dHash Fingerprint Match (Hamming distance <= 8)
      if (
        currentMeta?.hash &&
        prevMeta?.hash &&
        currentMeta.hash.length > 0 &&
        prevMeta.hash.length > 0
      ) {
        const distance = calculateHammingDistance(currentMeta.hash, prevMeta.hash);
        if (distance <= maxHammingDistance) {
          foundDuplicate = true;
          currentMeta.isDuplicate = true;
          currentMeta.duplicateOfIndex = j;
          break;
        }
      }
    }

    if (!foundDuplicate && result[i]) {
      result[i]!.isDuplicate = false;
      result[i]!.duplicateOfIndex = undefined;
    }
  }

  return result;
}
