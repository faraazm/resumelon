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
    <div
      id="print-root"
      style={{
        margin: 0,
        padding: 0,
        background: "white",
        fontSize: "10pt",
        lineHeight: 1.2,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Override root layout styles for print pages */
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              overflow: hidden !important;
            }

            /* Hide root layout extras (toaster, overlays, etc.) */
            body > *:not(#print-root):not(script):not(style):not(link) {
              display: none !important;
            }
            /* In case print-root is deeply nested, target via ID */
            #print-root ~ * {
              display: none !important;
            }

            /* Default to Letter size (US) */
            @page {
              size: letter;
              margin: 0;
            }

            /* Tighter list styling for print */
            #print-root ul {
              margin-top: 4px;
              margin-bottom: 0;
              padding-left: 1.25em;
            }
            #print-root li {
              margin-bottom: 1px;
              line-height: 1.25;
            }
            #print-root p {
              margin: 0;
              line-height: 1.3;
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
