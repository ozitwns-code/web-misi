-- AlterTable
ALTER TABLE "Misi" ADD COLUMN     "kuota_harian" INTEGER;

-- AlterTable
ALTER TABLE "ProgressMisi" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
