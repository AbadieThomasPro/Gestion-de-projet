-- AlterTable
ALTER TABLE "users" ADD COLUMN     "zone_id" INTEGER;

-- CreateTable
CREATE TABLE "zones" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zones_name_city_key" ON "zones"("name", "city");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
