import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_LOGO_SVG } from "@/lib/default-logo";

export async function GET() {
  const asset = await prisma.siteAsset.findUnique({ where: { key: "logo" } });

  if (asset) {
    return new NextResponse(new Uint8Array(asset.data), {
      headers: {
        "Content-Type": asset.mime_type,
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  return new NextResponse(DEFAULT_LOGO_SVG, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
