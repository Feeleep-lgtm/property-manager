/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `landlordId` on the `Property` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankAccountName` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_landlordId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amount",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "bankAccountName" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "landlordId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
