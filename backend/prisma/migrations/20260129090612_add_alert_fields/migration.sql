/*
  Warnings:

  - You are about to drop the column `action_required` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `alert_type` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `asset_id` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `dismissed_at` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `alerts` table. All the data in the column will be lost.
  - The `status` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `symbol` to the `alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_asset_id_fkey";

-- DropIndex
DROP INDEX "alerts_triggered_at_idx";

-- DropIndex
DROP INDEX "alerts_user_id_status_idx";

-- AlterTable
ALTER TABLE "alerts" DROP COLUMN "action_required",
DROP COLUMN "alert_type",
DROP COLUMN "asset_id",
DROP COLUMN "details",
DROP COLUMN "dismissed_at",
DROP COLUMN "headline",
DROP COLUMN "priority",
DROP COLUMN "read_at",
DROP COLUMN "recommendation",
ADD COLUMN     "assetId" TEXT,
ADD COLUMN     "min_signal_strength" INTEGER,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "repeat_alert" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rsi_threshold" DOUBLE PRECISION,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "target_price" DOUBLE PRECISION,
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "triggered_price" DOUBLE PRECISION,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "triggered_at" DROP NOT NULL,
ALTER COLUMN "triggered_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "alerts_user_id_idx" ON "alerts"("user_id");

-- CreateIndex
CREATE INDEX "alerts_symbol_idx" ON "alerts"("symbol");

-- CreateIndex
CREATE INDEX "alerts_status_idx" ON "alerts"("status");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
