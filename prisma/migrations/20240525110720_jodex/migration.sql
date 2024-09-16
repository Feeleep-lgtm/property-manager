/*
  Warnings:

  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isEmailVerified` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileCompleted` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LandlordStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL,
ADD COLUMN     "status" "LandlordStatus" NOT NULL DEFAULT 'BLOCKED';
