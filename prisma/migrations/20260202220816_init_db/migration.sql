/*
  Warnings:

  - You are about to drop the column `rideSessionId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `rideSessionId` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the `RideSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentMethod` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'NEQUI', 'DAVIPLATA', 'BANCOLOMBIA', 'OTHER');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "IncomeSource" ADD VALUE 'PICAP';

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_rideSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_rideSessionId_fkey";

-- DropForeignKey
ALTER TABLE "RideSession" DROP CONSTRAINT "RideSession_userId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "rideSessionId",
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "workShiftId" TEXT,
ALTER COLUMN "occurredAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "rideSessionId",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "workShiftId" TEXT,
ALTER COLUMN "occurredAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "RideSession";

-- DropEnum
DROP TYPE "RideStatus";

-- CreateTable
CREATE TABLE "WorkShift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ShiftStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "initialOdometer" INTEGER,
    "finalOdometer" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkShift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkShift" ADD CONSTRAINT "WorkShift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_workShiftId_fkey" FOREIGN KEY ("workShiftId") REFERENCES "WorkShift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_workShiftId_fkey" FOREIGN KEY ("workShiftId") REFERENCES "WorkShift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
