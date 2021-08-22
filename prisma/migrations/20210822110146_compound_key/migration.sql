/*
  Warnings:

  - A unique constraint covering the columns `[userId,restaurantId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorite.userId_restaurantId_unique" ON "Favorite"("userId", "restaurantId");
