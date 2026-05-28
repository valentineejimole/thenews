import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email ?? "";
    const result = await subscribeToNewsletter(email);

    if (result.status === "invalid") {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (result.status === "duplicate") {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Newsletter subscription failed", error);

    return NextResponse.json(
      { error: "Unable to subscribe right now. Please try again later." },
      { status: 500 },
    );
  }
}
