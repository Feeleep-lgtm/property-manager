-- CreateTable
CREATE TABLE "LandlordProperty" (
    "id" TEXT NOT NULL,

    CONSTRAINT "LandlordProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandlordProperty_id_key" ON "LandlordProperty"("id");
