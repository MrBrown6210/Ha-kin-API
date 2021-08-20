/*
  Warnings:

  - You are about to drop the column `facilities` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "facilities",
DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FacilityToRestaurant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RestaurantToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag.title_unique" ON "Tag"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Facility.title_unique" ON "Facility"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_FacilityToRestaurant_AB_unique" ON "_FacilityToRestaurant"("A", "B");

-- CreateIndex
CREATE INDEX "_FacilityToRestaurant_B_index" ON "_FacilityToRestaurant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RestaurantToTag_AB_unique" ON "_RestaurantToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_RestaurantToTag_B_index" ON "_RestaurantToTag"("B");

-- AddForeignKey
ALTER TABLE "_FacilityToRestaurant" ADD FOREIGN KEY ("A") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FacilityToRestaurant" ADD FOREIGN KEY ("B") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RestaurantToTag" ADD FOREIGN KEY ("A") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RestaurantToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
