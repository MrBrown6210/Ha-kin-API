-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tag" TEXT[],
    "averageCost" INTEGER NOT NULL,
    "coverImageURL" TEXT NOT NULL,
    "images" TEXT[],
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "facilities" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant.slug_unique" ON "Restaurant"("slug");
