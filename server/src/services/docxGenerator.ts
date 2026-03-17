import HTMLtoDOCX from "html-to-docx";

const wrapInDocument = (html: string): string => {
  return `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; }
  h1 { font-size: 18pt; margin-bottom: 4pt; color: #1a1a1a; }
  h2 { font-size: 14pt; margin-top: 12pt; margin-bottom: 4pt; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 2pt; }
  h3 { font-size: 12pt; margin-top: 8pt; margin-bottom: 2pt; }
  ul { margin-top: 2pt; margin-bottom: 2pt; }
  li { margin-bottom: 2pt; }
  p { margin-top: 2pt; margin-bottom: 2pt; }
  strong, b { font-weight: bold; }
  em, i { font-style: italic; }
</style>
</head>
<body>${html}</body>
</html>`;
};

export async function generateDocx(html: string): Promise<Buffer> {
  const fullHtml = wrapInDocument(html);

  const buffer = await HTMLtoDOCX(fullHtml, null, {
    margin: {
      top: 720,
      right: 720,
      bottom: 720,
      left: 720,
    },
    font: "Calibri",
    fontSize: 22,
    title: "Resume",
  });

  return Buffer.from(buffer);
}
