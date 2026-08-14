import "dotenv/config";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
const FILE_PATH = "./procedure_lookup_project.xlsx";

function readSheet(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<any>(sheet);
}

function val(value: any) {
  return value === undefined || value === null || value === ""
    ? null
    : String(value);
}

function boolVal(value: any) {
  return (
    value === true ||
    String(value).toLowerCase() === "true" ||
    String(value).toLowerCase() === "yes"
  );
}

async function main() {
  console.log("📖 Reading Excel...");
  const workbook = XLSX.readFile(FILE_PATH);

  const modalities = readSheet(workbook, "Modalities");
  const clinics = readSheet(workbook, "Clinics");
  const radiologists = readSheet(workbook, "Radiologists");
  const bookingCategories = readSheet(workbook, "BookingCategories");
  const procedures = readSheet(workbook, "Procedures");
  const procedureAliases = readSheet(workbook, "ProcedureAliases");
  const procedureClinics = readSheet(workbook, "ProcedureClinics");
  const procedureRadiologists = readSheet(workbook, "ProcedureRadiologists");
  const procedureBookingCategories = readSheet(
    workbook,
    "ProcedureBookingCategories",
  );
  const radiologistClinics = readSheet(workbook, "RadiologistClinics");
  const billingCodes = readSheet(workbook, "BillingCodes");
  const procedureBillingCodes = readSheet(workbook, "ProcedureBillingCodes");

  console.log("🧹 Clearing DB...");
  await prisma.procedureBillingCode.deleteMany();
  await prisma.billingCode.deleteMany();
  await prisma.procedureBookingCategory.deleteMany();
  await prisma.procedureRadiologist.deleteMany();
  await prisma.procedureClinic.deleteMany();
  await prisma.radiologistClinic.deleteMany();
  await prisma.procedureAlias.deleteMany();
  await prisma.bookingCategory.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.radiologist.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.modality.deleteMany();

  console.log("🧪 Importing Modalities...");
  for (const m of modalities) {
    await prisma.modality.create({
      data: {
        id: String(m.ModalityID),
        name: m.ModalityName,
      },
    });
  }

  console.log("💳 Importing Billing Codes...");

  for (const b of billingCodes) {
    await prisma.billingCode.create({
      data: {
        id: String(b.BillingCodeID),
        modalityAbbrev: val(b.ModalityAbbrev),
        mspCode: val(b.MSPCode),
        internalFeeCode: val(b.InternalFeeCode),
        serviceAbbrev: val(b.ServiceAbbrev),
        serviceName: val(b.ServiceName),
        modalityId: val(b.ModalityID),
        status: val(b.Status),
        notes: val(b.Notes),
      },
    });
  }

  console.log("🏥 Importing Clinics...");
  for (const c of clinics) {
    await prisma.clinic.create({
      data: {
        id: String(c.ClinicID),
        name: c.ClinicName,
        abbreviation: val(c.ClinicCode),
        city: val(c.City),
      },
    });
  }

  console.log("🧠 Importing Radiologists...");
  for (const r of radiologists) {
    await prisma.radiologist.upsert({
      where: { id: String(r.RadiologistID) },
      update: {
        name: r.RadiologistName,
        status: val(r.Status),
        notes: val(r.HomeClinicCode),
        genderColor: r.GenderColor || null,
        city: val(r.City),
      },
      create: {
        id: String(r.RadiologistID),
        name: r.RadiologistName,
        status: val(r.Status),
        notes: val(r.HomeClinicCode),
        genderColor: r.GenderColor || null,
        city: val(r.City),
      },
    });
  }

  console.log("📦 Importing Booking Categories...");
  for (const b of bookingCategories) {
    await prisma.bookingCategory.upsert({
      where: { id: String(b.BookingCategoryID) },
      update: {
        name: b.BookingCategoryName,
        modalityId: val(b.ModalityID)?.toString() || null,
        bookingCategoryColor: b.BookingCategoryColor || null,
      },
      create: {
        id: String(b.BookingCategoryID),
        name: b.BookingCategoryName,
        modalityId: val(b.ModalityID)?.toString() || null,
        bookingCategoryColor: b.BookingCategoryColor || null,
      },
    });
  }

  console.log("🩺 Importing Procedures...");
  for (const p of procedures) {
    await prisma.procedure.create({
      data: {
        id: String(p.ProcedureID),
        name: p.ProcedureName,
        displayName: val(p.SourceLabel),
        procedureType: val(p.ProcedureType),
        bodyPart: val(p.BodyPart),
        internalNotes: val(p.BookedBy),
      },
    });
  }

  console.log("🏷️ Importing Procedure Aliases...");
  for (const a of procedureAliases) {
    await prisma.procedureAlias.create({
      data: {
        id: String(a.ProcedureAliasID),
        procedureId: String(a.ProcedureID),
        aliasName: String(a.AliasName),
        aliasType: val(a.AliasType),
      },
    });
  }

  console.log("🔗 Importing ProcedureClinics...");
  for (const pc of procedureClinics) {
    await prisma.procedureClinic.create({
      data: {
        id: String(pc.ProcedureClinicID),
        procedureId: String(pc.ProcedureID),
        clinicId: String(pc.ClinicID),
        modalityId: val(pc.ModalityID),
        notes: val(pc.Notes),
        status: val(pc.Status),
      },
    });
  }

  console.log("🔗 Importing ProcedureRadiologists...");
  for (const pr of procedureRadiologists) {
    await prisma.procedureRadiologist.create({
      data: {
        id: String(pr.ProcedureRadiologistID),
        procedureId: String(pr.ProcedureID),
        radiologistId: String(pr.RadiologistID),
        status: val(pr.CanPerform),
        notes: val(pr.Conditions),
      },
    });
  }

  console.log("🔗 Importing ProcedureBookingCategories...");
  for (const pbc of procedureBookingCategories) {
    await prisma.procedureBookingCategory.create({
      data: {
        id: String(pbc.ProcedureBookingCategoryID),
        procedureId: String(pbc.ProcedureID),
        bookingCategoryId: String(pbc.BookingCategoryID),
        clinicId: val(pbc.ClinicID),
        isPrimary: boolVal(pbc.IsPrimary),
        notes: val(pbc.Notes),
      },
    });
  }

  console.log("🔗 Importing ProcedureBillingCodes...");

  for (const pbc of procedureBillingCodes) {
    await prisma.procedureBillingCode.create({
      data: {
        id: String(pbc.ProcedureBillingCodeID),
        procedureId: String(pbc.ProcedureID),
        billingCodeId: val(pbc.BillingCodeID),
        status: val(pbc.Status),
        notes: val(pbc.Notes),
      },
    });
  }

  console.log("🔗 Importing RadiologistClinics...");
  for (const rc of radiologistClinics) {
    await prisma.radiologistClinic.create({
      data: {
        id: String(rc.RadiologistClinicID),
        radiologistId: String(rc.RadiologistID),
        clinicId: String(rc.ClinicID),
        notes: val(rc.Notes),
        status: val(rc.Status),
      },
    });
  }

  console.log("✅ Full Excel import complete");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
