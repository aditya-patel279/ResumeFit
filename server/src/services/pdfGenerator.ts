import puppeteer from "puppeteer";

const PDF_STYLES = `
  body {
    font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #2d2d2d;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 20pt;
    margin: 0 0 4pt 0;
    color: #1a1a1a;
    font-weight: 700;
  }
  h2 {
    font-size: 13pt;
    margin: 14pt 0 4pt 0;
    color: #1a1a1a;
    font-weight: 600;
    border-bottom: 1.5px solid #3b82f6;
    padding-bottom: 3pt;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
  }
  h3 {
    font-size: 11.5pt;
    margin: 8pt 0 2pt 0;
    font-weight: 600;
    color: #333;
  }
  p {
    margin: 2pt 0;
  }
  ul {
    margin: 2pt 0;
    padding-left: 18pt;
  }
  li {
    margin-bottom: 2pt;
  }
  strong, b {
    font-weight: 600;
  }
  a {
    color: #2563eb;
    text-decoration: none;
  }
`;

const wrapInDocument = (html: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
<style>${PDF_STYLES}</style>
</head>
<body>${html}</body>
</html>`;
};

export async function generatePdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const fullHtml = wrapInDocument(html);
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
