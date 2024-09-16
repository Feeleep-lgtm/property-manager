/*
  Warnings:

  - You are about to drop the column `landlordPropertyId` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_landlordPropertyId_fkey";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "landlordPropertyId",
ADD COLUMN     "propertyId" TEXT;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
