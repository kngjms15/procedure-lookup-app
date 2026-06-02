import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET() {
  const procedures = await prisma.procedure.findMany({
    include: {
      aliases: true,

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
    bodyPart: p.bodyPart,
    procedureType: p.procedureType,
    internalNotes: p.internalNotes,

    aliases: p.aliases.map((alias) => ({
      aliasName: alias.aliasName,
      aliasType: alias.aliasType,
    })),

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
      bookingCategoryColor: pbc.bookingCategory.bookingCategoryColor || null,
    })),

    radiologists: p.procedureRadiologists.map((pr) => ({
      name: pr.radiologist.name,
      status: pr.status,
      notes: pr.notes,
      genderColor: pr.radiologist.genderColor || null,
    })),
  }));

  return NextResponse.json(result);
}
