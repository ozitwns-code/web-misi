/*
  Warnings:

  - Added the required column `metode_pencairan` to the `PencairanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_pemilik` to the `PencairanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_penyedia` to the `PencairanRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_tujuan` to the `PencairanRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PencairanRequest" ADD COLUMN     "metode_pencairan" TEXT NOT NULL,
ADD COLUMN     "nama_pemilik" TEXT NOT NULL,
ADD COLUMN     "nama_penyedia" TEXT NOT NULL,
ADD COLUMN     "nomor_tujuan" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metode_pencairan" TEXT,
ADD COLUMN     "nama_pemilik" TEXT,
ADD COLUMN     "nama_penyedia" TEXT,
ADD COLUMN     "nomor_tujuan" TEXT;
