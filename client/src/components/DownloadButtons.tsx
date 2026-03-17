import { FileDown, FileText, Loader2 } from "lucide-react";

interface DownloadButtonsProps {
  onDownloadDocx: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
  downloadType: "docx" | "pdf" | null;
}

export default function DownloadButtons({
  onDownloadDocx,
  onDownloadPdf,
  isDownloading,
  downloadType,
}: DownloadButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onDownloadDocx}
        disabled={isDownloading}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg
          hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isDownloading && downloadType === "docx" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        Download DOCX
      </button>
      <button
        onClick={onDownloadPdf}
        disabled={isDownloading}
        className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg
          hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-sm
          disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isDownloading && downloadType === "pdf" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Download PDF
      </button>
    </div>
  );
}
