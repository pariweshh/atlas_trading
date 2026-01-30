/*
  Warnings:

  - You are about to drop the column `type` on the `alerts` table. All the data in the column will be lost.
  - Added the required column `alert_type` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alerts" DROP COLUMN "type",
ADD COLUMN     "alert_type" TEXT NOT NULL;
