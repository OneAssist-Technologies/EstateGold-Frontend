import { QualityCheckResult, QualityStatus } from "../types/imageProcessing";
import { QUALITY_THRESHOLDS, RESOLUTION_LIMITS } from "../constants/imageConfig";

/**
 * Analyzes an image file for technical image quality parameters:
 * - Resolution and dimensions
 * - Blur and sharpness (Laplacian variance)
 * - Brightness (very dark vs overexposed)
 * - Suitability for property listings
 *
 * Returns status ("good" | "warning" | "low"), numeric score (0-100), and detailed reasons.
 */
export async function checkImageQuality(file: File): Promise<QualityCheckResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const result = analyzeImage(img);
        resolve(result);
      } catch (err) {
        console.warn("Quality check analysis error, falling back to basic checks:", err);
        // Fallback basic check if canvas fails
        resolve(performBasicCheck(img.width, img.height));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        status: "low",
        score: 20,
        reasons: ["Unable to analyze image format or image is corrupted"],
      });
    };

    img.src = url;
  });
}

function analyzeImage(img: HTMLImageElement): QualityCheckResult {
  const width = img.width;
  const height = img.height;
  const reasons: string[] = [];
  let score = 100;

  // 1. Resolution & Dimension Checks
  if (width < RESOLUTION_LIMITS.MIN_WIDTH || height < RESOLUTION_LIMITS.MIN_HEIGHT) {
    score -= 35;
    reasons.push(
      `Image dimensions (${width}x${height}px) are extremely small. Recommended minimum is ${RESOLUTION_LIMITS.RECOMMENDED_WIDTH}x${RESOLUTION_LIMITS.RECOMMENDED_HEIGHT}px.`
    );
  } else if (width < RESOLUTION_LIMITS.RECOMMENDED_WIDTH || height < RESOLUTION_LIMITS.RECOMMENDED_HEIGHT) {
    score -= 15;
    reasons.push(
      `Image resolution (${width}x${height}px) is lower than ideal for property listings.`
    );
  }

  // Aspect ratio check
  const aspectRatio = width / height;
  if (aspectRatio > 3.2 || aspectRatio < 0.35) {
    score -= 10;
    reasons.push("Image aspect ratio is unusual or extremely cropped.");
  }

  // 2. Pixel Analysis via Canvas (Luminance & Sharpness)
  const maxSampleDim = 600;
  let sampleW = width;
  let sampleH = height;
  if (sampleW > maxSampleDim || sampleH > maxSampleDim) {
    const scale = maxSampleDim / Math.max(sampleW, sampleH);
    sampleW = Math.round(sampleW * scale);
    sampleH = Math.round(sampleH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (ctx) {
    ctx.drawImage(img, 0, 0, sampleW, sampleH);
    const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imageData.data;

    // Brightness / Luminance Calculation
    let totalLuminance = 0;
    let darkPixels = 0;
    let brightPixels = 0;
    const pixelCount = sampleW * sampleH;

    // Create grayscale buffer for Laplacian sharpness calculation
    const grayBuffer = new Float32Array(pixelCount);

    for (let i = 0; i < pixelCount; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      grayBuffer[i] = lum;
      totalLuminance += lum;

      if (lum < 25) darkPixels++;
      if (lum > 235) brightPixels++;
    }

    const meanLuminance = totalLuminance / pixelCount;
    const darkRatio = darkPixels / pixelCount;
    const brightRatio = brightPixels / pixelCount;

    // Darkness & Brightness Warnings
    if (meanLuminance < 35 || darkRatio > 0.65) {
      score -= 25;
      reasons.push("Image is very dark and detail may be hidden in shadows.");
    } else if (meanLuminance < 55) {
      score -= 10;
      reasons.push("Image lighting is relatively dim.");
    }

    if (meanLuminance > 220 || brightRatio > 0.55) {
      score -= 25;
      reasons.push("Image is overexposed or extremely bright.");
    }

    // Sharpness / Blur Detection via Laplacian Variance
    const laplacianVar = calculateLaplacianVariance(grayBuffer, sampleW, sampleH);

    if (laplacianVar < 25) {
      score -= 35;
      reasons.push("Image appears significantly blurry or out of focus.");
    } else if (laplacianVar < 65) {
      score -= 15;
      reasons.push("Image sharpness is somewhat low.");
    }
  }

  // Ensure score stays bounded 0 - 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: QualityStatus = "good";
  if (score < QUALITY_THRESHOLDS.WARNING_MIN_SCORE) {
    status = "low";
  } else if (score < QUALITY_THRESHOLDS.GOOD_MIN_SCORE) {
    status = "warning";
  }

  if (status === "good" && reasons.length === 0) {
    reasons.push("High resolution, balanced lighting, and clear sharpness.");
  }

  return {
    status,
    score,
    reasons,
  };
}

/**
 * Calculates the variance of the Laplacian of a grayscale image buffer.
 * Higher variance indicates sharper edges and clearer detail.
 */
function calculateLaplacianVariance(
  gray: Float32Array,
  width: number,
  height: number
): number {
  let laplacianSum = 0;
  let laplacianSqSum = 0;
  let count = 0;

  // 3x3 Laplacian Kernel:
  // [ 0  1  0 ]
  // [ 1 -4  1 ]
  // [ 0  1  0 ]
  for (let y = 1; y < height - 1; y += 2) { // Step 2 for speed optimization
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      const center = gray[idx];
      const top = gray[(y - 1) * width + x];
      const bottom = gray[(y + 1) * width + x];
      const left = gray[y * width + (x - 1)];
      const right = gray[y * width + (x + 1)];

      const lap = top + bottom + left + right - 4 * center;
      laplacianSum += lap;
      laplacianSqSum += lap * lap;
      count++;
    }
  }

  if (count === 0) return 100;

  const mean = laplacianSum / count;
  const variance = laplacianSqSum / count - mean * mean;
  return variance;
}

function performBasicCheck(width: number, height: number): QualityCheckResult {
  if (width < 400 || height < 300) {
    return {
      status: "low",
      score: 40,
      reasons: ["Image resolution is very low"],
    };
  }
  if (width < 800 || height < 600) {
    return {
      status: "warning",
      score: 65,
      reasons: ["Image resolution is lower than recommended"],
    };
  }
  return {
    status: "good",
    score: 90,
    reasons: ["Image dimensions meet recommended property standards"],
  };
}
