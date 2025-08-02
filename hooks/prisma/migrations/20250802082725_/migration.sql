/*
  Warnings:

  - You are about to drop the column `sortingOrder` on the `Trigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Action" ADD COLUMN     "sortingOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Trigger" DROP COLUMN "sortingOrder";
