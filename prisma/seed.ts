import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.procedure.deleteMany();

  await prisma.procedure.createMany({
    data: [
      {
        name: "Hip Injection",
        modality: "PMI",
        clinics: "BW,MB,CH",
        bookingCategories: "BasInj,Bas/AdvInj",
        notes: "Book based on clinic/radiologist availability.",
      },
      {
        name: "Shoulder Injection",
        modality: "PMI",
        clinics: "BW,MB,CH",
        bookingCategories: "BasInj",
        notes: "Can be ultrasound or fluoro guided depending on protocol.",
      },
      {
        name: "Wrist Arthrogram",
        modality: "Fluoro",
        clinics: "MB",
        bookingCategories: "MR Arthro",
        notes: "Confirm protocol before booking.",
      },
    ],
  });

  console.log("🌱 Seed complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
