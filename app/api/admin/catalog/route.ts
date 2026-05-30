import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/server/auth";
import { getCatalog, saveCatalog } from "@/lib/server/store";
import type { Catalog } from "@/types/catalog";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const catalog = await getCatalog();
  return NextResponse.json({ catalog });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { catalog } = (await request.json()) as { catalog: Catalog };
  if (!catalog || !Array.isArray(catalog.items) || !Array.isArray(catalog.themes)) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  const saved = await saveCatalog(catalog);
  return NextResponse.json({ catalog: saved });
}
