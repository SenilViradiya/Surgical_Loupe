import type { CompatibilityError } from "./compatibility-types";

export function incompatibleProductsError({
  message,
  frameId,
  lensId,
  headlightId,
  reason,
}: {
  message: string;
  frameId?: string;
  lensId?: string;
  headlightId?: string;
  reason?: string;
}): CompatibilityError {
  return {
    success: false,
    code: "INCOMPATIBLE_PRODUCTS",
    message,
    field: headlightId ? "headlightId" : lensId ? "lensId" : "frameId",
    details: {
      frameId,
      lensId,
      headlightId,
      reason,
    },
  };
}

export function notFoundError(
  code: "FRAME_NOT_FOUND" | "LENS_NOT_FOUND" | "HEADLIGHT_NOT_FOUND",
  message: string,
  field: "frameId" | "lensId" | "headlightId",
  id: string
): CompatibilityError {
  return {
    success: false,
    code,
    message,
    field,
    details: {
      [field]: id,
    },
  };
}
