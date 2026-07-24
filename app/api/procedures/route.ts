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
          clinic: {
            include: {
              radiologistClinics: {
                include: {
                  radiologist: true,
                },
              },
            },
          },
        },
      },
      procedureBookingCategories: {
        include: {
          bookingCategory: {
            include: {
              modality: true,
            },
          },
          clinic: true,
        },
      },
      procedureBillingCodes: {
        include: {
          billingCode: {
            include: {
              modality: true,
            },
          },
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
      abbreviation: pc.clinic.abbreviation,
      city: pc.clinic.city,
      modality: pc.modalityId,
      notes: pc.notes,

      radiologists: pc.clinic.radiologistClinics.map((rc) => ({
        name: rc.radiologist.name,
        status: rc.status,
        genderColor: rc.radiologist.genderColor || null,
      })),
    })),

    bookingCategories: p.procedureBookingCategories.map((pbc) => ({
      name: pbc.bookingCategory.name,
      modalityName: pbc.bookingCategory.modality?.name || null,
      clinic: pbc.clinic?.name || null,
      isPrimary: pbc.isPrimary,
      bookingCategoryColor: pbc.bookingCategory.bookingCategoryColor || null,
    })),

    billingCodes: p.procedureBillingCodes.map((pbc) => ({
      billingCodeId: pbc.billingCode?.id ?? null,
      internalFeeCode: pbc.billingCode?.internalFeeCode ?? null,
      serviceName: pbc.billingCode?.serviceName ?? null,
      modalityName: pbc.billingCode?.modality?.name ?? null,
      status: pbc.status,
      notes: pbc.notes,
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
