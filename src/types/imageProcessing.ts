export type QualityStatus = "good" | "warning" | "low";

export interface QualityCheckResult {
  status: QualityStatus;
  score: number;
  reasons: string[];
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImageMeta {
  originalSize: number;
  finalSize: number;
  compressed: boolean;
  quality: QualityCheckResult;
  dimensions: ImageDimensions;
  objectUrl: string;
  hash?: string;
  isDuplicate?: boolean;
  duplicateOfIndex?: number;
}

export interface ProcessedImageResult {
  file: File;
  meta: ProcessedImageMeta;
}

export interface PhotoItemWithMeta {
  file: File;
  meta?: ProcessedImageMeta;
  isProcessing?: boolean;
  processingStage?: "compressing" | "analyzing" | "complete" | "error";
  error?: string;
}
