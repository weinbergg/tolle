import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/server/auth";
import { getRequests, updateRequest, deleteRequest } from "@/lib/server/store";
import type { RequestStatus } from "@/types/admin";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const requests = await getRequests();
  return NextResponse.json({ requests });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id, status } = (await request.json()) as {
    id: string;
    status: RequestStatus;
  };
  const updated = await updateRequest(id, { status });
  if (!updated) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
  return NextResponse.json({ request: updated });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }
  const { id } = (await request.json()) as { id: string };
  const ok = await deleteRequest(id);
  return NextResponse.json({ ok });
}
