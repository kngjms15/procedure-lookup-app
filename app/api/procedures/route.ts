import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const procedures = await prisma.procedure.findMany();

  return NextResponse.json(
    procedures.map((p) => ({
      name: p.name,
      modality: p.modality,
      clinics: p.clinics.split(","),
      bookingCategories: p.bookingCategories.split(","),
      notes: p.notes,
    })),
  );
}
