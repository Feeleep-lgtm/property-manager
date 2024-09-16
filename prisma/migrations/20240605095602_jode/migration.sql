/*
  Warnings:

  - Changed the type of `flat` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_landlordId_fkey";

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "landlordId" DROP NOT NULL,
DROP COLUMN "flat",
ADD COLUMN     "flat" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user",
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LandlordProperty" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,

    CONSTRAINT "LandlordProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantProperty" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "TenantProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandlordProperty_id_key" ON "LandlordProperty"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProperty_id_key" ON "TenantProperty"("id");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Landlord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordProperty" ADD CONSTRAINT "LandlordProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandlordProperty" ADD CONSTRAINT "LandlordProperty_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Landlord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantProperty" ADD CONSTRAINT "TenantProperty_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantProperty" ADD CONSTRAINT "TenantProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
