import { useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, FileCheck, X } from "lucide-react";

interface ResumeUploaderProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled: boolean;
}

export default function ResumeUploader({
  onFileSelected,
  selectedFile,
  onClear,
  disabled,
}: ResumeUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (
        file &&
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        onFileSelected(file);
      }
    },
    [onFileSelected, disabled]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
      }
      e.target.value = "";
    },
    [onFileSelected]
  );

  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
        <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 truncate">
            {selectedFile.name}
          </p>
          <p className="text-xs text-green-600">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
        ${
          isDragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-700">
        Drop your resume here or click to browse
      </p>
      <p className="text-xs text-gray-500 mt-1">Supports .docx files only</p>
    </div>
  );
}
