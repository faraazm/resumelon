"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

interface ParsedResumeData {
  personalDetails: {
    firstName: string;
    lastName: string;
    jobTitle: string;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

// Parse a document and extract text (then AI will structure it)
export const parseDocument = action({
  args: {
    storageId: v.id("_storage"),
    fileType: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args): Promise<ParsedResumeData> => {
    // Get the file URL
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new Error("File not found in storage");
    }

    // Download the file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to download file from storage");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    // Parse based on file type
    if (args.fileType === "application/pdf" || args.fileName.endsWith(".pdf")) {
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      try {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error("Failed to parse PDF. The file may be corrupted or password-protected.");
      }
    } else if (
      args.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      args.fileName.endsWith(".docx")
    ) {
      const mammoth = require("mammoth");
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (error) {
        console.error("DOCX parsing error:", error);
        throw new Error("Failed to parse Word document. The file may be corrupted.");
      }
    } else if (
      args.fileType === "application/msword" ||
      args.fileName.endsWith(".doc")
    ) {
      throw new Error("Legacy .doc files are not supported. Please convert to PDF or DOCX and try again.");
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Could not extract text from the document. It may be image-based or empty.");
    }

    // Delete the file from storage after extracting text
    await ctx.runMutation(api.storage.deleteFile, { storageId: args.storageId });

    // Use AI to parse the extracted text into structured data
    const parsedData = await ctx.runAction(api.ai.parseResumeWithAI, {
      extractedText: text,
    });

    return parsedData;
  },
});

// Export extracted text only (for debugging or alternative parsing)
export const extractText = action({
  args: {
    storageId: v.id("_storage"),
    fileType: v.string(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) {
      throw new Error("File not found in storage");
    }

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to download file from storage");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (args.fileType === "application/pdf" || args.fileName.endsWith(".pdf")) {
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else if (
      args.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      args.fileName.endsWith(".docx")
    ) {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    return { text };
  },
});
