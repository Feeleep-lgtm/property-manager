/*
  Warnings:

  - You are about to drop the column `passwordConfirm` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `passwordConfirm` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Landlord" DROP CONSTRAINT "Landlord_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- DropIndex
DROP INDEX "Landlord_userId_key";

-- DropIndex
DROP INDEX "Tenant_userId_key";

-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "passwordConfirm",
DROP COLUMN "userId",
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "passwordConfirm",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserToken";
