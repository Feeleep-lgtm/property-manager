/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `JodexAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralCode` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JodexAdmin" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Jodex Admin',
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "referralCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Property_referralCode_key" ON "Property"("referralCode");
