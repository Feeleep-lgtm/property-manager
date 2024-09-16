/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Property` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_tenantId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "tenantId";
