/*
  Warnings:

  - You are about to drop the column `resetCode` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `resetCodeExpires` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "resetCode",
DROP COLUMN "resetCodeExpires",
ADD COLUMN     "additionalCharges" JSONB,
ADD COLUMN     "totalRent" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Complain" (
    "id" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "contactCaretaker" BOOLEAN NOT NULL,
    "complain" TEXT NOT NULL,

    CONSTRAINT "Complain_pkey" PRIMARY KEY ("id")
);
