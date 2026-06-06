import { prisma } from "../lib/prisma";

async function main() {
  await prisma.frame.upsert({
    where: { slug: "classic-frame" },
    update: {
      name: "Classic Frame",
      modelUrl: "/models/frame.glb",
      price: 1200,
      status: "ACTIVE",
    },
    create: {
      name: "Classic Frame",
      slug: "classic-frame",
      modelUrl: "/models/frame.glb",
      price: 1200,
      status: "ACTIVE",
    },
  });

  await prisma.frame.upsert({
    where: { slug: "premium-frame" },
    update: {
      name: "Premium Frame",
      modelUrl: "/models/frame2.glb",
      price: 1800,
      status: "ACTIVE",
    },
    create: {
      name: "Premium Frame",
      slug: "premium-frame",
      modelUrl: "/models/frame2.glb",
      price: 1800,
      status: "ACTIVE",
    },
  });

  await prisma.lens.upsert({
    where: { slug: "2-5x-lens" },
    update: {
      name: "2.5x Lens",
      magnification: "2.5x",
      price: 500,
      status: "ACTIVE",
    },
    create: {
      name: "2.5x Lens",
      slug: "2-5x-lens",
      magnification: "2.5x",
      price: 500,
      status: "ACTIVE",
    },
  });

  await prisma.lens.upsert({
    where: { slug: "3-5x-lens" },
    update: {
      name: "3.5x Lens",
      magnification: "3.5x",
      price: 800,
      status: "ACTIVE",
    },
    create: {
      name: "3.5x Lens",
      slug: "3-5x-lens",
      magnification: "3.5x",
      price: 800,
      status: "ACTIVE",
    },
  });

  await prisma.headlight.upsert({
    where: { slug: "beam-headlight" },
    update: {
      name: "Beam Headlight",
      modelUrl: "/models/headlight.glb",
      price: 900,
      status: "ACTIVE",
    },
    create: {
      name: "Beam Headlight",
      slug: "beam-headlight",
      modelUrl: "/models/headlight.glb",
      price: 900,
      status: "ACTIVE",
    },
  });

  const [classicFrame, premiumFrame, precisionLens, advancedLens, beamHeadlight] =
    await Promise.all([
      prisma.frame.findUnique({ where: { slug: "classic-frame" } }),
      prisma.frame.findUnique({ where: { slug: "premium-frame" } }),
      prisma.lens.findUnique({ where: { slug: "2-5x-lens" } }),
      prisma.lens.findUnique({ where: { slug: "3-5x-lens" } }),
      prisma.headlight.findUnique({ where: { slug: "beam-headlight" } }),
    ]);

  if (classicFrame && premiumFrame && precisionLens && advancedLens && beamHeadlight) {
    await prisma.frameLensCompatibility.createMany({
      data: [
        {
          frameId: classicFrame.id,
          lensId: precisionLens.id,
          reason: "Designed for the standard 2.5x magnification package.",
        },
        {
          frameId: premiumFrame.id,
          lensId: precisionLens.id,
          reason: "Premium frame supports the standard 2.5x package.",
        },
        {
          frameId: premiumFrame.id,
          lensId: advancedLens.id,
          reason: "Premium frame supports the 3.5x magnification package.",
        },
      ],
      skipDuplicates: true,
    });

    await prisma.frameHeadlightCompatibility.createMany({
      data: [
        {
          frameId: classicFrame.id,
          headlightId: beamHeadlight.id,
          reason: "Standard frame uses the beam headlight mount.",
        },
        {
          frameId: premiumFrame.id,
          headlightId: beamHeadlight.id,
          reason: "Premium frame uses the beam headlight mount.",
        },
      ],
      skipDuplicates: true,
    });

    await prisma.lensHeadlightCompatibility.createMany({
      data: [
        {
          lensId: precisionLens.id,
          headlightId: beamHeadlight.id,
          reason: "2.5x lens is optimized for the beam light path.",
        },
      ],
      skipDuplicates: true,
    });
  }


}

main()
  .catch(() => {})
  .finally(async () => {
    await prisma.$disconnect();
  });
