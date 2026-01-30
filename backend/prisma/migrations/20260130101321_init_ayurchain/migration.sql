-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('HARVESTED', 'PROCESSED', 'LAB_TESTED');

-- CreateEnum
CREATE TYPE "LabResult" AS ENUM ('PASS', 'FAIL');

-- CreateTable
CREATE TABLE "Herb" (
    "id" SERIAL NOT NULL,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT,
    "specialty" TEXT,
    "region" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Herb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Processor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNo" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Processor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "accreditationNo" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HerbBatch" (
    "id" TEXT NOT NULL,
    "herbId" INTEGER NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "geoLocation" TEXT,
    "harvestDate" TIMESTAMP(3),
    "quantity" TEXT,
    "status" "BatchStatus" NOT NULL DEFAULT 'HARVESTED',
    "blockchainTxId" TEXT,
    "qrCodeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HerbBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingRecord" (
    "id" SERIAL NOT NULL,
    "batchId" TEXT NOT NULL,
    "processorId" INTEGER NOT NULL,
    "method" TEXT,
    "processDate" TIMESTAMP(3),
    "blockchainTxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabReport" (
    "id" SERIAL NOT NULL,
    "batchId" TEXT NOT NULL,
    "labId" INTEGER NOT NULL,
    "testDate" TIMESTAMP(3),
    "result" "LabResult" NOT NULL,
    "reportHash" TEXT,
    "blockchainTxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HerbBatch" ADD CONSTRAINT "HerbBatch_herbId_fkey" FOREIGN KEY ("herbId") REFERENCES "Herb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HerbBatch" ADD CONSTRAINT "HerbBatch_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingRecord" ADD CONSTRAINT "ProcessingRecord_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "HerbBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingRecord" ADD CONSTRAINT "ProcessingRecord_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "Processor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "HerbBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
