/*
  Warnings:

  - Added the required column `updatedAt` to the `Specialty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Specialty" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "icon" DROP NOT NULL;
