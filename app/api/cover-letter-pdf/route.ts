import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LETTER_WIDTH_PX, LETTER_HEIGHT_PX } from "@/lib/pdf-constants";

function sanitizeFilename(filename: string): string {
  let sanitized = filename.replace(/[/\\]/g, "");
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.]/g, "");
  sanitized = sanitized.trim();
  if (sanitized.length > 100) sanitized = sanitized.substring(0, 100);
  if (!sanitized.toLowerCase().endsWith(".pdf")) {
    sanitized = sanitized.replace(/\.[^.]*$/, "") + ".pdf";
  }
  if (sanitized === ".pdf" || sanitized.length < 5) sanitized = "cover-letter.pdf";
  return sanitized;
}

export async function POST(request: NextRequest) {
  let browser;

  try {
    const authResult = await auth();
    const clerkId = authResult.userId;
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coverLetterId, filename = "cover-letter.pdf" } = await request.json();
    if (!coverLetterId) {
      return NextResponse.json({ error: "Cover letter ID is required" }, { status: 400 });
    }

    const safeFilename = sanitizeFilename(filename);
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");

    const client = new ConvexHttpClient(convexUrl);

    // Set Clerk auth token so Convex can authenticate the user
    const convexToken = await authResult.getToken({ template: "convex" });
    if (convexToken) {
      client.setAuth(convexToken);
    }

    let tokenResult;
    try {
      tokenResult = await client.mutation(api.printTokens.createCoverLetterPrintToken, {
        coverLetterId: coverLetterId as Id<"coverLetters">,
      });
    } catch (error) {
      console.error("Failed to create cover letter print token:", error);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { token } = tokenResult;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const printUrl = `${baseUrl}/print/cover-letter/${coverLetterId}?token=${encodeURIComponent(token)}`;

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: LETTER_WIDTH_PX, height: LETTER_HEIGHT_PX },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();
    page.on("console", (msg) => console.log("CL print page:", msg.type(), msg.text()));

    const response = await page.goto(printUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (!response || !response.ok()) {
      throw new Error(`Failed to load print page: ${response?.status()}`);
    }

    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

    try {
      await page.waitForFunction(
        () => (window as unknown as { __RESUME_READY__: boolean }).__RESUME_READY__ === true,
        { timeout: 10000 }
      );
    } catch {
      const hasContent = await page.evaluate(() => {
        const el = document.getElementById("cover-letter-content");
        return el !== null && el.innerHTML.length > 50;
      });
      if (!hasContent) throw new Error("Cover letter content not found on print page");
    }

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    browser = undefined;

    client.mutation(api.printTokens.consumePrintToken, { token }).catch(() => {});

    const pdfArray = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfArray, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": pdfArray.length.toString(),
      },
    });
  } catch (error) {
    console.error("Cover letter PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
