/*
  Warnings:

  - You are about to drop the `DoctorProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorProfile" DROP CONSTRAINT "DoctorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpecialty" DROP CONSTRAINT "DoctorSpecialty_doctorId_fkey";

-- DropTable
DROP TABLE "DoctorProfile";

-- CreateTable
CREATE TABLE "doctorprofile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePicture" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "registerNumber" TEXT,
    "age" INTEGER,
    "appointmentFee" DOUBLE PRECISION,
    "qualification" TEXT,
    "workingHospital" TEXT,
    "designation" TEXT,
    "isNeedPasswordChanged" BOOLEAN NOT NULL DEFAULT false,
    "isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctorprofile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctorprofile_userId_key" ON "doctorprofile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctorprofile_email_key" ON "doctorprofile"("email");

-- AddForeignKey
ALTER TABLE "doctorprofile" ADD CONSTRAINT "doctorprofile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctorprofile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
