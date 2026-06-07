import { prisma } from "@/lib/prisma";

import { getCachedValue, invalidateCompatibilityCache, setCachedValue } from "./compatibility-cache";
import {
  incompatibleProductsError,
  notFoundError,
} from "./compatibility-validators";
import type {
  CompatibilityCatalog,
  CompatibilityOption,
  CompatibilityRelation,
  CompatibilitySnapshot,
  CompatibilityValidationResult,
} from "./compatibility-types";

const SNAPSHOT_CACHE_KEY = "compatibility:snapshot:v1";

function buildLookup(relations: CompatibilityRelation[]) {
  const lookup = new Map<string, { reason?: string | null }>();

  for (const relation of relations) {
    lookup.set(relation.targetId, {
      reason: relation.reason ?? undefined,
    });
  }

  return lookup;
}

async function loadSnapshot(): Promise<CompatibilitySnapshot> {
  const cached = getCachedValue<CompatibilitySnapshot>(SNAPSHOT_CACHE_KEY);

  if (cached) return cached;

  const [frameLens, frameHeadlight, lensHeadlight] = await Promise.all([
    prisma.frameLensCompatibility.findMany({
      select: {
        id: true,
        frameId: true,
        lensId: true,
        reason: true,
      },
      orderBy: [{ frameId: "asc" }, { lensId: "asc" }],
    }),
    prisma.frameHeadlightCompatibility.findMany({
      select: {
        id: true,
        frameId: true,
        headlightId: true,
        reason: true,
      },
      orderBy: [{ frameId: "asc" }, { headlightId: "asc" }],
    }),
    prisma.lensHeadlightCompatibility.findMany({
      select: {
        id: true,
        lensId: true,
        headlightId: true,
        reason: true,
      },
      orderBy: [{ lensId: "asc" }, { headlightId: "asc" }],
    }),
  ]);

  const snapshot: CompatibilitySnapshot = {
    frameLens: frameLens.map((item) => ({
      id: item.id,
      sourceId: item.frameId,
      targetId: item.lensId,
      reason: item.reason,
    })),
    frameHeadlight: frameHeadlight.map((item) => ({
      id: item.id,
      sourceId: item.frameId,
      targetId: item.headlightId,
      reason: item.reason,
    })),
    lensHeadlight: lensHeadlight.map((item) => ({
      id: item.id,
      sourceId: item.lensId,
      targetId: item.headlightId,
      reason: item.reason,
    })),
    generatedAt: new Date().toISOString(),
  };

  setCachedValue(SNAPSHOT_CACHE_KEY, snapshot);

  return snapshot;
}

async function getFrameCompatibilityContext(frameId: string) {
  const snapshot = await loadSnapshot();
  const relations = snapshot.frameLens.filter((item) => item.sourceId === frameId);

  return {
    hasRules: relations.length > 0,
    lookup: buildLookup(relations),
  };
}

async function getFrameHeadlightCompatibilityContext(frameId: string) {
  const snapshot = await loadSnapshot();
  const relations = snapshot.frameHeadlight.filter((item) => item.sourceId === frameId);

  return {
    hasRules: relations.length > 0,
    lookup: buildLookup(relations),
  };
}

async function getLensHeadlightCompatibilityContext(lensId: string) {
  const snapshot = await loadSnapshot();
  const relations = snapshot.lensHeadlight.filter((item) => item.sourceId === lensId);

  return {
    hasRules: relations.length > 0,
    lookup: buildLookup(relations),
  };
}

async function listAllCatalog(): Promise<CompatibilityCatalog> {
  const [frames, lenses, headlights, snapshot] = await Promise.all([
    prisma.frame.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lens.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.headlight.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
    loadSnapshot(),
  ]);

  return {
    frames,
    lenses,
    headlights,
    snapshot,
  };
}

function mapOptions<T extends { id: string; name: string; price: number; modelUrl: string | null; thumbnailUrl: string | null }>(
  items: T[],
  allowLookup: Map<string, { reason?: string | null }>,
  hasRules: boolean
): CompatibilityOption[] {
  return items.map((item) => {
    const compatible = !hasRules || allowLookup.has(item.id);
    const reason = compatible
      ? allowLookup.get(item.id)?.reason ?? undefined
      : "Not compatible with the selected product";

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      modelUrl: item.modelUrl,
      thumbnailUrl: item.thumbnailUrl,
      compatible,
      reason,
    };
  });
}

export async function getConfiguratorCompatibilityCatalog() {
  const catalog = await listAllCatalog();

  // include inventory snapshot for configurator UX
  let inventorySnapshot = null;
  try {
    const { getInventorySnapshot } = await import("@/lib/inventory/inventory-service");
    inventorySnapshot = await getInventorySnapshot();
  } catch (error: unknown) {
    // inventory module may not be available during early deploys — fail gracefully
    inventorySnapshot = null;
  }

  return {
    ...catalog,
    inventory: inventorySnapshot,
  };
}

export async function getCompatibleLenses(frameId: string) {
  const catalog = await listAllCatalog();
  const context = await getFrameCompatibilityContext(frameId);

  return mapOptions(catalog.lenses, context.lookup, context.hasRules).filter(
    (item) => item.compatible
  );
}

export async function getCompatibleHeadlights(frameId: string) {
  const catalog = await listAllCatalog();
  const context = await getFrameHeadlightCompatibilityContext(frameId);

  return mapOptions(catalog.headlights, context.lookup, context.hasRules).filter(
    (item) => item.compatible
  );
}

export async function getCompatibleHeadlightsForLens(lensId: string) {
  const catalog = await listAllCatalog();
  const context = await getLensHeadlightCompatibilityContext(lensId);

  return mapOptions(catalog.headlights, context.lookup, context.hasRules).filter(
    (item) => item.compatible
  );
}

export async function getCompatibilityOptionsForFrame(frameId: string) {
  const catalog = await listAllCatalog();
  const lensContext = await getFrameCompatibilityContext(frameId);
  const headlightContext = await getFrameHeadlightCompatibilityContext(frameId);

  return {
    lenses: mapOptions(catalog.lenses, lensContext.lookup, lensContext.hasRules),
    headlights: mapOptions(catalog.headlights, headlightContext.lookup, headlightContext.hasRules),
  };
}

export async function getCompatibilityOptionsForLens(frameId: string, lensId: string) {
  const catalog = await listAllCatalog();
  const frameHeadlightContext = await getFrameHeadlightCompatibilityContext(frameId);
  const lensHeadlightContext = await getLensHeadlightCompatibilityContext(lensId);

  const frameOptions = mapOptions(catalog.headlights, frameHeadlightContext.lookup, frameHeadlightContext.hasRules);
  const lensOptions = mapOptions(catalog.headlights, lensHeadlightContext.lookup, lensHeadlightContext.hasRules);

  const lensAllowed = new Map(lensOptions.map((option) => [option.id, option]));

  return frameOptions.map((option) => {
    const lensOption = lensAllowed.get(option.id);
    const compatible = option.compatible && (lensOption?.compatible ?? true);

    if (compatible) {
      return option;
    }

    return {
      ...option,
      compatible: false,
      reason:
        frameHeadlightContext.hasRules && !frameHeadlightContext.lookup.has(option.id)
          ? "Not compatible with the selected frame"
          : lensHeadlightContext.hasRules && !lensHeadlightContext.lookup.has(option.id)
            ? "Not compatible with the selected lens"
            : option.reason,
    };
  });
}


export async function validateConfiguration({
  frameId, lensId, headlightId,
}: {
  frameId: string;
  lensId: string;
  headlightId?: string | null;
}, requestId: string): Promise<CompatibilityValidationResult> {
  const [frame, lens, headlight, rules] = await Promise.all([
    prisma.frame.findUnique({
      where: { id: frameId },
      select: { id: true, status: true },
    }),
    prisma.lens.findUnique({
      where: { id: lensId },
      select: { id: true, status: true },
    }),
    headlightId
      ? prisma.headlight.findUnique({
          where: { id: headlightId },
          select: { id: true, status: true },
        })
      : Promise.resolve(null),
    // Target only current frame/lens rules
    Promise.all([
      prisma.frameLensCompatibility.findMany({
        where: { frameId },
        select: { id: true, frameId: true, lensId: true, reason: true },
      }),
      prisma.frameHeadlightCompatibility.findMany({
        where: { frameId },
        select: { id: true, frameId: true, headlightId: true, reason: true },
      }),
      headlightId
        ? prisma.lensHeadlightCompatibility.findMany({
            where: { lensId },
            select: { id: true, lensId: true, headlightId: true, reason: true },
          })
        : Promise.resolve([]),
    ]).then(([fl, fh, lh]) => ({
      frameLens: fl.map(i => ({ id: i.id, sourceId: i.frameId, targetId: i.lensId, reason: i.reason })),
      frameHeadlight: fh.map(i => ({ id: i.id, sourceId: i.frameId, targetId: i.headlightId, reason: i.reason })),
      lensHeadlight: lh.map(i => ({ id: i.id, sourceId: i.lensId, targetId: i.headlightId, reason: i.reason })),
    })),
  ]);

  if (!frame || frame.status !== "ACTIVE") {
    return notFoundError("FRAME_NOT_FOUND", "Selected frame could not be found or is inactive.", "frameId", frameId);
  }

  if (!lens || lens.status !== "ACTIVE") {
    return notFoundError("LENS_NOT_FOUND", "Selected lens could not be found or is inactive.", "lensId", lensId);
  }

  if (headlightId && (!headlight || headlight.status !== "ACTIVE")) {
    return notFoundError("HEADLIGHT_NOT_FOUND", "Selected headlight could not be found or is inactive.", "headlightId", headlightId);
  }

  const frameLensRules = rules.frameLens;
  const frameHeadlightRules = rules.frameHeadlight;
  const lensHeadlightRules = rules.lensHeadlight;

  const frameLensLocked = frameLensRules.length > 0;
  const frameHeadlightLocked = frameHeadlightRules.length > 0;
  const lensHeadlightLocked = lensHeadlightRules.length > 0;

  if (frameLensLocked && !frameLensRules.some((item) => item.targetId === lensId)) {
    return incompatibleProductsError({
      message: "Selected lens is not compatible with selected frame.",
      frameId,
      lensId,
      reason: frameLensRules.find((item) => item.targetId === lensId)?.reason ?? undefined,
    });
  }

  if (headlightId) {
    if (frameHeadlightLocked && !frameHeadlightRules.some((item) => item.targetId === headlightId)) {
      return incompatibleProductsError({
        message: "Selected headlight is not compatible with selected frame.",
        frameId,
        lensId,
        headlightId,
        reason: frameHeadlightRules.find((item) => item.targetId === headlightId)?.reason ?? undefined,
      });
    }

    if (lensHeadlightLocked && !lensHeadlightRules.some((item) => item.targetId === headlightId)) {
      return incompatibleProductsError({
        message: "Selected headlight is not compatible with selected lens.",
        frameId,
        lensId,
        headlightId,
        reason: lensHeadlightRules.find((item) => item.targetId === headlightId)?.reason ?? undefined,
      });
    }
  }

  return { success: true };
}

export async function refreshCompatibilityCache() {
  invalidateCompatibilityCache();
}
