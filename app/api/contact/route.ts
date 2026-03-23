import { NextResponse } from "next/server";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const RECIPIENT_EMAIL = "faraaz.codes@gmail.com";

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("BREVO_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ContactRequest;

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.length > 200 || subject.length > 500 || message.length > 5000) {
      return NextResponse.json(
        { error: "Input exceeds maximum allowed length" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const safeName = sanitize(name);
    const safeSubject = sanitize(subject);
    const safeMessage = sanitize(message);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "resumeclone Contact Form",
          email: RECIPIENT_EMAIL,
        },
        to: [
          {
            email: RECIPIENT_EMAIL,
            name: "resumeclone",
          },
        ],
        replyTo: {
          email,
          name: safeName,
        },
        subject: `[Contact Form] ${safeSubject}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${sanitize(email)}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
