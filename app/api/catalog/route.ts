import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/server/store";

/** Public, read-only catalogue (themes + motif/glyph merchandising). */
export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json(
    { catalog },
    { headers: { "Cache-Control": "no-store" } }
  );
}
