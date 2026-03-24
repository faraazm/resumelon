import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Create a server-side Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

/**
 * Get resume for printing using a secure print token
 * This does not require authentication - the token IS the authorization
 */
export async function getResumeForPrint(token: string) {
  const client = new ConvexHttpClient(convexUrl);

  try {
    const result = await client.query(api.printTokens.getResumeForPrint, {
      token,
    });
    return result;
  } catch (error) {
    console.error("Failed to fetch resume for print:", error);
    return { error: "Failed to fetch resume", resume: null };
  }
}

/**
 * Get cover letter for printing using a secure print token
 */
export async function getCoverLetterForPrint(token: string) {
  const client = new ConvexHttpClient(convexUrl);

  try {
    const result = await client.query(api.printTokens.getCoverLetterForPrint, {
      token,
    });
    return result;
  } catch (error) {
    console.error("Failed to fetch cover letter for print:", error);
    return { error: "Failed to fetch cover letter", coverLetter: null };
  }
}

/**
 * Mark a print token as consumed
 */
export async function consumePrintToken(token: string) {
  const client = new ConvexHttpClient(convexUrl);

  try {
    return await client.mutation(api.printTokens.consumePrintToken, { token });
  } catch (error) {
    console.error("Failed to consume print token:", error);
    return { success: false, error: "Failed to consume token" };
  }
}
