// Shared image configuration constants for EstateGold

export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // 10,485,760 bytes

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const QUALITY_THRESHOLDS = {
  GOOD_MIN_SCORE: 75,
  WARNING_MIN_SCORE: 50,
};

export const RESOLUTION_LIMITS = {
  MIN_WIDTH: 400,
  MIN_HEIGHT: 300,
  RECOMMENDED_WIDTH: 800,
  RECOMMENDED_HEIGHT: 600,
  SAFE_MAX_DIMENSION: 3840,
};
