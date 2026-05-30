import { NextResponse } from "next/server";
import { addRequest } from "@/lib/server/store";

interface ContactPayload {
  name: string;
  contact: string;
  product: string;
  comment: string;
  configuration?: unknown;
  sketchSvg?: string;
  schematic?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    if (!body.name?.trim() || !body.contact?.trim()) {
      return NextResponse.json(
        { error: "Имя и контакт обязательны" },
        { status: 400 }
      );
    }

    const record = await addRequest({
      name: body.name.trim(),
      contact: body.contact.trim(),
      product: body.product ?? "",
      comment: body.comment ?? "",
      configuration: body.configuration,
      sketchSvg: typeof body.sketchSvg === "string" ? body.sketchSvg : undefined,
      schematic: typeof body.schematic === "string" ? body.schematic : undefined,
    });

    // Mock notification hook. Replace with Telegram Bot API or email service.
    console.log("[Contact Form Submission]", {
      id: record.id,
      name: record.name,
      contact: record.contact,
      product: record.product,
      timestamp: record.createdAt,
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch {
    return NextResponse.json(
      { error: "Ошибка обработки заявки" },
      { status: 500 }
    );
  }
}
