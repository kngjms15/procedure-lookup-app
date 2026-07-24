-- CreateTable
CREATE TABLE "BillingCode" (
    "id" TEXT NOT NULL,
    "modalityAbbrev" TEXT,
    "mspCode" TEXT,
    "internalFeeCode" TEXT,
    "serviceAbbrev" TEXT,
    "serviceName" TEXT,
    "modalityId" TEXT,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "BillingCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcedureBillingCode" (
    "id" TEXT NOT NULL,
    "procedureId" TEXT NOT NULL,
    "billingCodeId" TEXT,
    "status" TEXT,
    "notes" TEXT,

    CONSTRAINT "ProcedureBillingCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProcedureBillingCode_procedureId_idx" ON "ProcedureBillingCode"("procedureId");

-- CreateIndex
CREATE INDEX "ProcedureBillingCode_billingCodeId_idx" ON "ProcedureBillingCode"("billingCodeId");

-- AddForeignKey
ALTER TABLE "BillingCode" ADD CONSTRAINT "BillingCode_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureBillingCode" ADD CONSTRAINT "ProcedureBillingCode_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureBillingCode" ADD CONSTRAINT "ProcedureBillingCode_billingCodeId_fkey" FOREIGN KEY ("billingCodeId") REFERENCES "BillingCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
