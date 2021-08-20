/*
  Warnings:

  - You are about to drop the column `tag` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "tag",
ADD COLUMN     "tags" TEXT[];
