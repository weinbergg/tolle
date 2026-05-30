import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/server/auth";
import { getProducts, saveProducts } from "@/lib/server/store";
import type { AdminProduct } from "@/types/admin";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { products } = (await request.json()) as { products: AdminProduct[] };
  if (!Array.isArray(products)) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }
  const saved = await saveProducts(products);
  return NextResponse.json({ products: saved });
}
