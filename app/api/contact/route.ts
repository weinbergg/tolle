import { NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  contact: string;
  product: string;
  comment: string;
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

    // Mock: log submission. Replace with Telegram Bot API or email service.
    console.log("[Contact Form Submission]", {
      name: body.name,
      contact: body.contact,
      product: body.product,
      comment: body.comment,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ошибка обработки заявки" },
      { status: 500 }
    );
  }
}
