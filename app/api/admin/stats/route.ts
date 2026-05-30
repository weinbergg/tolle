import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/server/auth";
import { getStats } from "@/lib/server/store";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json({ stats });
}
