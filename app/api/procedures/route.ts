import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const procedures = await prisma.procedure.findMany({
    include: {
      procedureClinics: {
        include: {
          clinic: true,
        },
      },
      procedureBookingCategories: {
        include: {
          bookingCategory: true,
          clinic: true,
        },
      },
      procedureRadiologists: {
        include: {
          radiologist: true,
        },
      },
    },
  });

  const result = procedures.map((p) => ({
    id: p.id,
    name: p.name,
    displayName: p.displayName,

    clinics: p.procedureClinics.map((pc) => ({
      clinic: pc.clinic.name,
      city: pc.clinic.city,
      modality: pc.modalityId,
      notes: pc.notes,
    })),

    bookingCategories: p.procedureBookingCategories.map((pbc) => ({
      name: pbc.bookingCategory.name,
      clinic: pbc.clinic?.name || null,
      isPrimary: pbc.isPrimary,
    })),

    radiologists: p.procedureRadiologists.map((pr) => ({
      name: pr.radiologist.name,
      status: pr.status,
    })),
  }));

  return NextResponse.json(result);
}
