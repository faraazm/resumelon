import "@/app/globals.css";
import "../fonts.css";

export const metadata = {
  title: "Print Resume",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Default to Letter size (US) */
              @page {
                size: letter;
                margin: 0;
              }

              /* Print-specific styles */
              @media print {
                html, body {
                  width: 8.5in;
                  height: 11in;
                  margin: 0;
                  padding: 0;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }

                /* Prevent page breaks inside job/education blocks */
                .job-block, .education-block, section {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }

                /* Prevent orphan headers */
                h2, h3, .section-header {
                  break-after: avoid;
                  page-break-after: avoid;
                }
              }

              /* Base styles */
              html, body {
                margin: 0;
                padding: 0;
                background: white;
                font-size: 10pt;
                line-height: 1.2;
              }

              * {
                box-sizing: border-box;
              }

              /* Tighter list styling */
              ul {
                margin-top: 4px;
                margin-bottom: 0;
                padding-left: 1.25em;
              }

              li {
                margin-bottom: 1px;
                line-height: 1.25;
              }

              /* Tighter section spacing */
              section {
                margin-bottom: 12px;
              }

              /* Tighter header spacing */
              h1 {
                margin: 0 0 4px 0;
                line-height: 1.1;
              }

              h2 {
                margin: 0 0 6px 0;
                line-height: 1.2;
              }

              p {
                margin: 0;
                line-height: 1.3;
              }
            `,
          }}
        />
      </head>
      <body className="bg-white m-0 p-0">
        {children}
      </body>
    </html>
  );
}
