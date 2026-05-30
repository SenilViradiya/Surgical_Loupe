import type { Frame, Headlight, Lens } from "@/lib/generated/prisma";

export type ProductType = "FRAME" | "LENS" | "HEADLIGHT";

export type CompatibilityErrorCode =
  | "INCOMPATIBLE_PRODUCTS"
  | "FRAME_NOT_FOUND"
  | "LENS_NOT_FOUND"
  | "HEADLIGHT_NOT_FOUND";

export interface CompatibilityError {
  success: false;
  code: CompatibilityErrorCode;
  message: string;
  field?: "frameId" | "lensId" | "headlightId";
  details?: {
    frameId?: string;
    lensId?: string;
    headlightId?: string;
    reason?: string;
  };
}

export interface CompatibilitySuccess {
  success: true;
}

export type CompatibilityValidationResult =
  | CompatibilitySuccess
  | CompatibilityError;

export interface CompatibilityRelation {
  id: string;
  sourceId: string;
  targetId: string;
  reason?: string | null;
}

export interface CompatibilitySnapshot {
  frameLens: CompatibilityRelation[];
  frameHeadlight: CompatibilityRelation[];
  lensHeadlight: CompatibilityRelation[];
  generatedAt: string;
}

export interface CompatibilityOption {
  id: string;
  name: string;
  price: number;
  modelUrl: string | null;
  thumbnailUrl: string | null;
  compatible: boolean;
  reason?: string;
}

export interface CompatibilityCatalog {
  frames: Frame[];
  lenses: Lens[];
  headlights: Headlight[];
  snapshot: CompatibilitySnapshot;
}

export interface ConfigurationInput {
  frameId: string;
  lensId: string;
  headlightId?: string | null;
}
