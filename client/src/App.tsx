import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import {
  Sparkles,
  Loader2,
  ArrowLeft,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import Header from "./components/Header";
import ResumeUploader from "./components/ResumeUploader";
import JobDescriptionInput from "./components/JobDescriptionInput";
import ResumeEditor from "./components/ResumeEditor";
import DownloadButtons from "./components/DownloadButtons";
import ProviderSelector from "./components/ProviderSelector";
import type { AppStep, ParseResponse, TailorResponse, AiProvider } from "./types";

const API_BASE = "/api";

export default function App() {
  const [step, setStep] = useState<AppStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [provider, setProvider] = useState<AiProvider>("claude");
  const [originalHtml, setOriginalHtml] = useState("");
  const [tailoredHtml, setTailoredHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"docx" | "pdf" | null>(
    null
  );

  const handleFileSelected = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setOriginalHtml("");
    setError(null);
  }, []);

  const handleTailor = useCallback(async () => {
    if (!file || !jobDescription.trim()) return;

    setError(null);
    setIsTailoring(true);
    setStep("tailoring");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const parseResponse = await axios.post<ParseResponse>(
        `${API_BASE}/parse`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOriginalHtml(parseResponse.data.html);

      const tailorResponse = await axios.post<TailorResponse>(
        `${API_BASE}/tailor`,
        {
          resumeHtml: parseResponse.data.html,
          jobDescription: jobDescription.trim(),
          provider,
        }
      );

      setTailoredHtml(tailorResponse.data.tailoredHtml);
      setStep("editing");
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Something went wrong. Please try again.";
      setError(message);
      setStep("upload");
    } finally {
      setIsTailoring(false);
    }
  }, [file, jobDescription, provider]);

  const handleDownload = useCallback(
    async (type: "docx" | "pdf") => {
      if (!tailoredHtml) return;

      setIsDownloading(true);
      setDownloadType(type);
      setError(null);

      try {
        const response = await axios.post(
          `${API_BASE}/download/${type}`,
          {
            html: tailoredHtml,
            filename: "tailored-resume",
          },
          { responseType: "blob" }
        );

        const blob = new Blob([response.data as BlobPart]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `tailored-resume.${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        const axiosError = err as AxiosError<{ error: string }>;
        setError(
          axiosError.response?.data?.error || `Failed to download ${type.toUpperCase()}`
        );
      } finally {
        setIsDownloading(false);
        setDownloadType(null);
      }
    },
    [tailoredHtml]
  );

  const handleStartOver = useCallback(() => {
    setStep("upload");
    setFile(null);
    setJobDescription("");
    setOriginalHtml("");
    setTailoredHtml("");
    setError(null);
    setProvider("claude");
  }, []);

  const canTailor = file !== null && jobDescription.trim().length > 50;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {step === "tailoring" && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tailoring your resume...
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              AI is analyzing the job description and optimizing your resume
            </p>
          </div>
        )}

        {step === "upload" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Tailor Your Resume
              </h2>
              <p className="text-gray-500 mt-2">
                Upload your resume and paste the job description to get an
                AI-optimized version
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Resume
                </label>
                <ResumeUploader
                  onFileSelected={handleFileSelected}
                  selectedFile={file}
                  onClear={handleClearFile}
                  disabled={isTailoring}
                />
              </div>

              <div className="border-t border-gray-100" />

              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
                disabled={isTailoring}
              />

              <div className="border-t border-gray-100" />

              <ProviderSelector
                value={provider}
                onChange={setProvider}
                disabled={isTailoring}
              />

              <button
                onClick={handleTailor}
                disabled={!canTailor || isTailoring}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg
                  hover:bg-primary-700 active:bg-primary-800 transition-colors font-semibold text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Tailor My Resume
              </button>

              {!canTailor && file && jobDescription.length > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  Please paste a more detailed job description (at least 50
                  characters)
                </p>
              )}
            </div>
          </div>
        )}

        {step === "editing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStartOver}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Start Over
                </button>
                <div className="h-5 w-px bg-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Your Tailored Resume
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTailor}
                  disabled={isTailoring}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-700 bg-primary-50 border border-primary-200 rounded-lg
                    hover:bg-primary-100 transition-colors font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Re-tailor
                </button>
                <DownloadButtons
                  onDownloadDocx={() => handleDownload("docx")}
                  onDownloadPdf={() => handleDownload("pdf")}
                  isDownloading={isDownloading}
                  downloadType={downloadType}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">
                    Original Resume
                  </h3>
                </div>
                <div
                  className="p-6 prose prose-sm max-w-none overflow-auto max-h-[700px]"
                  dangerouslySetInnerHTML={{ __html: originalHtml }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
                  <h3 className="text-sm font-medium text-primary-700">
                    Tailored Resume (Editable)
                  </h3>
                </div>
                <div className="p-2">
                  <ResumeEditor
                    value={tailoredHtml}
                    onChange={setTailoredHtml}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-400 text-center">
            Resume Tailor uses AI to optimize your resume. Always review the
            output for accuracy before submitting.
          </p>
        </div>
      </footer>
    </div>
  );
}
