/*
  Warnings:

  - You are about to drop the column `endTime` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `doctor_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedule_startTime_endTime_idx";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripeEventId" TEXT,
ALTER COLUMN "paymentGetwayData" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doctor_schedule" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "endTime",
DROP COLUMN "startTime";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
