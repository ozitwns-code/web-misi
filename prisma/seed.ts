import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const misiSeed = [
  {
    judul: "Share link produk digital ke WA Story",
    deskripsi:
      "Share salah satu link produk/misi Rebahancuan ke Story WhatsApp kamu, biarkan tayang minimal beberapa jam.",
    nominal_reward: 5000,
    tipe: "share",
  },
  {
    judul: "Follow Instagram Secangkir Cerita",
    deskripsi:
      "Follow akun Instagram resmi Secangkir Cerita supaya nggak ketinggalan cerita & misi baru.",
    nominal_reward: 5000,
    tipe: "sosial",
  },
  {
    judul: "Checkin harian pertama",
    deskripsi:
      "Buka dashboard Rebahancuan hari ini dan tandai checkin pertamamu.",
    nominal_reward: 2000,
    tipe: "checkin",
  },
  {
    judul: "Baca & komentar artikel terbaru di blog",
    deskripsi:
      "Buka artikelnya, baca, tinggalkan komentar singkat, terus balik ke sini — misi otomatis selesai.",
    nominal_reward: 10000,
    tipe: "baca",
    target_url:
      "https://secangkircerita-id.blogspot.com/2026/08/kenapa-ngobrol-sambil-ngopi-itu.html",
  },
  {
    judul: "Follow channel WhatsApp Secangkir Cerita",
    deskripsi:
      "Isi survei singkat, lalu join channel WhatsApp resmi kami — misi otomatis selesai begitu kamu balik ke sini.",
    nominal_reward: 8000,
    tipe: "sosial",
    target_url: "https://whatsapp.com/channel/0029VbDjpiqEFeXscAvXTU2E",
    perlu_survei: true,
    survei_pertanyaan: JSON.stringify([
      {
        id: "q1",
        text: "Seberapa sering kamu mengecek misi baru di Rebahancuan?",
        options: ["Setiap hari", "Beberapa kali seminggu", "Jarang"],
      },
      {
        id: "q2",
        text: "Menurutmu, reward yang paling menarik itu apa?",
        options: ["Reward misi harian", "Reward referral", "Keduanya sama menarik"],
      },
      {
        id: "q3",
        text: "Dari mana kamu tahu tentang Rebahancuan?",
        options: ["Blog Secangkir Cerita", "Ajakan teman", "Media sosial"],
      },
    ]),
  },
];

async function main() {
  for (const misi of misiSeed) {
    const existing = await prisma.misi.findFirst({
      where: { judul: misi.judul },
    });
    if (existing) {
      console.log(`Lewati (sudah ada): ${misi.judul}`);
      continue;
    }
    await prisma.misi.create({ data: misi });
    console.log(`Ditambahkan: ${misi.judul}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
