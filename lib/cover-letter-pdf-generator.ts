export interface CoverLetterPDFOptions {
  filename?: string;
}

export async function generateCoverLetterPDF(
  coverLetterId: string,
  options: CoverLetterPDFOptions = {}
): Promise<void> {
  const { filename = "cover-letter.pdf" } = options;

  try {
    const response = await fetch("/api/cover-letter-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetterId, filename }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Cover letter PDF generation error:", error);
    throw error;
  }
}
