import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.frame.createMany({
    data: [
      {
        name: "Classic Frame",
        slug: "classic-frame",
        modelUrl: "/models/frame.glb",
        price: 1200,
      },

      {
        name: "Premium Frame",
        slug: "premium-frame",
        modelUrl: "/models/frame2.glb",
        price: 1800,
      },
    ],
  });

  await prisma.lens.createMany({
    data: [
      {
        name: "2.5x Lens",
        slug: "2-5x-lens",
        magnification: "2.5x",
        price: 500,
      },

      {
        name: "3.5x Lens",
        slug: "3-5x-lens",
        magnification: "3.5x",
        price: 800,
      },
    ],
  });

  console.log("Seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });