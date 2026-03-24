import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  LETTER_WIDTH_PX,
  LETTER_HEIGHT_PX,
} from "@/lib/pdf-constants";

/**
 * Sanitize filename to prevent header injection and ensure valid PDF filename
 */
function sanitizeFilename(filename: string): string {
  // Remove any path separators
  let sanitized = filename.replace(/[/\\]/g, "");

  // Only allow safe characters: letters, numbers, spaces, dash, underscore, period
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length (leaving room for .pdf extension)
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // Ensure it ends with .pdf
  if (!sanitized.toLowerCase().endsWith(".pdf")) {
    // Remove any existing extension
    sanitized = sanitized.replace(/\.[^.]*$/, "");
    sanitized += ".pdf";
  }

  // Fallback if empty
  if (sanitized === ".pdf" || sanitized.length < 5) {
    sanitized = "resume.pdf";
  }

  return sanitized;
}

export async function POST(request: NextRequest) {
  let browser;

  try {
    // Require authentication
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to generate PDFs" },
        { status: 401 }
      );
    }

    const { resumeId, filename = "resume.pdf" } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Sanitize the filename
    const safeFilename = sanitizeFilename(filename);

    // Create a print token via Convex (this validates ownership)
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
    }

    const client = new ConvexHttpClient(convexUrl);

    let tokenResult;
    try {
      tokenResult = await client.mutation(api.printTokens.createPrintToken, {
        resumeId: resumeId as Id<"resumes">,
        clerkId,
      });
    } catch (error) {
      console.error("Failed to create print token:", error);
      return NextResponse.json(
        { error: "Access denied: You do not have permission to export this resume" },
        { status: 403 }
      );
    }

    const { token } = tokenResult;

    // Get the base URL from the request or environment
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    const printUrl = `${baseUrl}/print/${resumeId}?token=${encodeURIComponent(token)}`;

    console.log("PDF generation started for resume:", resumeId);

    // Launch browser
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: LETTER_WIDTH_PX, height: LETTER_HEIGHT_PX },
      deviceScaleFactor: 2, // Higher quality rendering
    });

    const page = await context.newPage();

    // Listen for console messages for debugging
    page.on("console", (msg) => {
      console.log("Print page console:", msg.type(), msg.text());
    });

    // Listen for page errors
    page.on("pageerror", (error) => {
      console.error("Print page error:", error.message);
    });

    // Navigate to the print page
    console.log("Navigating to print page...");
    const response = await page.goto(printUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    if (!response || !response.ok()) {
      throw new Error(
        `Failed to load print page: ${response?.status()} ${response?.statusText()}`
      );
    }

    // Wait for network to be mostly idle
    await page
      .waitForLoadState("networkidle", { timeout: 15000 })
      .catch(() => {
        console.log("Network idle timeout - continuing anyway");
      });

    // Try to wait for the ready signal, but fall back to a simple timeout
    console.log("Waiting for resume to be ready...");
    try {
      await page.waitForFunction(
        () =>
          (window as unknown as { __RESUME_READY__: boolean }).__RESUME_READY__ ===
          true,
        { timeout: 10000 }
      );
      console.log("Resume ready signal received");
    } catch {
      console.log("Ready signal timeout - checking if content exists...");

      // Check if resume content is present
      const hasContent = await page.evaluate(() => {
        const content = document.getElementById("resume-content");
        return content !== null && content.innerHTML.length > 100;
      });

      if (!hasContent) {
        // Try to get any error message from the page
        const pageContent = await page.content();
        console.error("Page content preview:", pageContent.substring(0, 500));
        throw new Error(
          "Resume content not found on print page - the page may have failed to load data"
        );
      }

      console.log("Content found, proceeding without ready signal");
    }

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Small additional wait for layout stability
    await page.waitForTimeout(300);

    console.log("Generating PDF...");

    // Generate PDF using Letter size (US standard)
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: true, // Respect @page CSS rules for size and margins
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    browser = undefined;

    // Mark the token as consumed (optional - for one-time use)
    // We don't await this to avoid delaying the response
    client.mutation(api.printTokens.consumePrintToken, { token }).catch((err) => {
      console.error("Failed to consume print token:", err);
    });

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const pdfArray = new Uint8Array(pdfBuffer);

    console.log("PDF generated successfully, size:", pdfArray.length);

    // Return the PDF as a downloadable file
    return new NextResponse(pdfArray, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": pdfArray.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
