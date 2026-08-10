-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "no_wa" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "kode_referral_sendiri" TEXT NOT NULL,
    "direferensikan_oleh" TEXT,
    "saldo_reward" INTEGER NOT NULL DEFAULT 0,
    "tanggal_daftar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_daftar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Misi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "nominal_reward" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "target_url" TEXT,
    "perlu_survei" BOOLEAN NOT NULL DEFAULT false,
    "survei_pertanyaan" TEXT,

    CONSTRAINT "Misi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressMisi" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "misi_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'belum',
    "jawaban_survei" TEXT,
    "tanggal_mulai" TIMESTAMP(3),
    "tanggal_selesai" TIMESTAMP(3),

    CONSTRAINT "ProgressMisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralLog" (
    "id" TEXT NOT NULL,
    "user_id_pengundang" TEXT NOT NULL,
    "user_id_baru" TEXT NOT NULL,
    "nominal_didapat" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'approved',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PencairanRequest" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'diminta',
    "tanggal_diminta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggal_diproses" TIMESTAMP(3),
    "tanggal_selesai" TIMESTAMP(3),

    CONSTRAINT "PencairanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_no_wa_key" ON "User"("no_wa");

-- CreateIndex
CREATE UNIQUE INDEX "User_kode_referral_sendiri_key" ON "User"("kode_referral_sendiri");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressMisi_user_id_misi_id_key" ON "ProgressMisi"("user_id", "misi_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralLog_user_id_baru_key" ON "ReferralLog"("user_id_baru");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_direferensikan_oleh_fkey" FOREIGN KEY ("direferensikan_oleh") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMisi" ADD CONSTRAINT "ProgressMisi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressMisi" ADD CONSTRAINT "ProgressMisi_misi_id_fkey" FOREIGN KEY ("misi_id") REFERENCES "Misi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_user_id_pengundang_fkey" FOREIGN KEY ("user_id_pengundang") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLog" ADD CONSTRAINT "ReferralLog_user_id_baru_fkey" FOREIGN KEY ("user_id_baru") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PencairanRequest" ADD CONSTRAINT "PencairanRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
