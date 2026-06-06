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

  console.log("Configurator seed completed with active frame, lens, and headlight records");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });