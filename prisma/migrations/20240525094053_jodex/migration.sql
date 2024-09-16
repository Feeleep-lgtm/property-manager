/*
  Warnings:

  - Added the required column `bath` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diningRoom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flat` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitchen` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictures` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bath" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "diningRoom" INTEGER NOT NULL,
ADD COLUMN     "flat" TEXT NOT NULL,
ADD COLUMN     "kitchen" INTEGER NOT NULL,
ADD COLUMN     "pictures" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "unit" INTEGER NOT NULL,
ADD COLUMN     "zipCode" INTEGER NOT NULL;
