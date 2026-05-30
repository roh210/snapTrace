/*
  Warnings:

  - You are about to drop the column `ipAdress` on the `Clicks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clicks" DROP COLUMN "ipAdress",
ADD COLUMN     "ipAddress" TEXT;
