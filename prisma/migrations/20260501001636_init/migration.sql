-- CreateTable
CREATE TABLE "Procedure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "clinics" TEXT NOT NULL,
    "bookingCategories" TEXT NOT NULL,
    "notes" TEXT NOT NULL
);
