/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Payment` table. All the data in the column will be lost.
  - Made the column `notes` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_propertyId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "propertyId",
ALTER COLUMN "notes" SET NOT NULL;
