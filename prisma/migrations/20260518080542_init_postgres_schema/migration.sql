-- CreateTable
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "service" TEXT,
    "procedureType" TEXT,
    "bodyPart" TEXT,
    "defaultModality" TEXT,
    "isBookable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT,
    "internalNotes" TEXT,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "city" TEXT,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Radiologist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "notes" TEXT,
    "genderColor" TEXT,

    CONSTRAINT "Radiologist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Modality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modalityId" TEXT,
    "notes" TEXT,
    "bookingCategoryColor" TEXT,

    CONSTRAINT "BookingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureClinic" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "modalityId" TEXT,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "ProcedureClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureRadiologist" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "radiologistId" TEXT NOT NULL,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "ProcedureRadiologist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureBookingCategory" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "bookingCategoryId" TEXT NOT NULL,
    "clinicId" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "ProcedureBookingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadiologistClinic" (
    "id" TEXT NOT NULL,
    "radiologistId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "RadiologistClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureRule" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "ruleType" TEXT,
    "ruleText" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ProcedureRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureAlias" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "aliasName" TEXT NOT NULL,
    "aliasType" TEXT,

    CONSTRAINT "ProcedureAlias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProcedureAlias_aliasName_idx" ON "ProcedureAlias"("aliasName");

-- AddForeignKey
ALTER TABLE "BookingCategory" ADD CONSTRAINT "BookingCategory_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureClinic" ADD CONSTRAINT "ProcedureClinic_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureClinic" ADD CONSTRAINT "ProcedureClinic_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureClinic" ADD CONSTRAINT "ProcedureClinic_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureRadiologist" ADD CONSTRAINT "ProcedureRadiologist_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureRadiologist" ADD CONSTRAINT "ProcedureRadiologist_radiologistId_fkey" FOREIGN KEY ("radiologistId") REFERENCES "Radiologist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureBookingCategory" ADD CONSTRAINT "ProcedureBookingCategory_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureBookingCategory" ADD CONSTRAINT "ProcedureBookingCategory_bookingCategoryId_fkey" FOREIGN KEY ("bookingCategoryId") REFERENCES "BookingCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureBookingCategory" ADD CONSTRAINT "ProcedureBookingCategory_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadiologistClinic" ADD CONSTRAINT "RadiologistClinic_radiologistId_fkey" FOREIGN KEY ("radiologistId") REFERENCES "Radiologist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadiologistClinic" ADD CONSTRAINT "RadiologistClinic_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureRule" ADD CONSTRAINT "ProcedureRule_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureAlias" ADD CONSTRAINT "ProcedureAlias_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
