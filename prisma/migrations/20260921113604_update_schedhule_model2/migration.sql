/*
  Warnings:

  - Added the required column `interval` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule" ADD COLUMN     "interval" INTEGER NOT NULL;
