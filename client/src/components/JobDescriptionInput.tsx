import { ClipboardPaste } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  disabled,
}: JobDescriptionInputProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <ClipboardPaste className="w-4 h-4 text-gray-500" />
        <label className="text-sm font-medium text-gray-700">
          Job Description
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the full job description here..."
        rows={10}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-y
          focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          placeholder:text-gray-400 transition-shadow"
      />
      <p className="text-xs text-gray-500 mt-1">
        {value.length > 0
          ? `${value.split(/\s+/).filter(Boolean).length} words`
          : "Include the full listing for best results"}
      </p>
    </div>
  );
}
