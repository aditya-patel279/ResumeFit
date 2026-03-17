declare module "html-to-docx" {
  interface DocxOptions {
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    title?: string;
    table?: { row?: { cantSplit?: boolean } };
    footer?: boolean;
    header?: boolean;
    pageNumber?: boolean;
    font?: string;
    fontSize?: number;
  }

  export default function HTMLtoDOCX(
    htmlString: string,
    headerHTMLString?: string | null,
    options?: DocxOptions,
    footerHTMLString?: string | null
  ): Promise<Buffer>;
}
