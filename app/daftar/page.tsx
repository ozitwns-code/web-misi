import { Suspense } from "react";
import DaftarForm from "@/components/DaftarForm";

export const metadata = {
  title: "Daftar — Rebahancuan",
};

export default function DaftarPage() {
  return (
    <Suspense>
      <DaftarForm />
    </Suspense>
  );
}
