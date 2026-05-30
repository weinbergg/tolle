import { NextResponse } from "next/server";
import { bumpStat, bumpProductView } from "@/lib/server/store";

interface TrackPayload {
  event: "pageview" | "constructor" | "product";
  productId?: string;
}

export async function POST(request: Request) {
  try {
    const body: TrackPayload = await request.json();
    if (body.event === "pageview") {
      await bumpStat("pageViews");
    } else if (body.event === "constructor") {
      await bumpStat("constructorViews");
    } else if (body.event === "product" && body.productId) {
      await bumpProductView(body.productId);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
