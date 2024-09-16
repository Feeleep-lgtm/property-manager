/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `LandlordProperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LandlordTenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantProperty` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `landlordId` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "LandlordProperty" DROP CONSTRAINT "LandlordProperty_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordProperty" DROP CONSTRAINT "LandlordProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordTenant" DROP CONSTRAINT "LandlordTenant_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordTenant" DROP CONSTRAINT "LandlordTenant_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "TenantProperty" DROP CONSTRAINT "TenantProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "TenantProperty" DROP CONSTRAINT "TenantProperty_tenantId_fkey";

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "landlordId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "propertyId";

-- DropTable
DROP TABLE "LandlordProperty";

-- DropTable
DROP TABLE "LandlordTenant";

-- DropTable
DROP TABLE "TenantProperty";

-- DropEnum
DROP TYPE "LandlordStatus";

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_id_fkey" FOREIGN KEY ("id") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Landlord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
