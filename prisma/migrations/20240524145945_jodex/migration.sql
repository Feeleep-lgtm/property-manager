/*
  Warnings:

  - You are about to drop the column `landlordId` on the `LandlordProperty` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `LandlordProperty` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - Added the required column `garage` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wifi` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LandlordProperty" DROP CONSTRAINT "LandlordProperty_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "LandlordProperty" DROP CONSTRAINT "LandlordProperty_propertyId_fkey";

-- AlterTable
ALTER TABLE "LandlordProperty" DROP COLUMN "landlordId",
DROP COLUMN "propertyId";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "type",
ADD COLUMN     "garage" BOOLEAN NOT NULL,
ADD COLUMN     "houseType" TEXT NOT NULL,
ADD COLUMN     "wifi" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status";

-- DropEnum
DROP TYPE "Status";
