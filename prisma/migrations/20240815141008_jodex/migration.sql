-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_paymentId_fkey";

-- AlterTable
ALTER TABLE "Rental" ALTER COLUMN "paymentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
