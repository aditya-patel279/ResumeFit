import type { AiProvider } from "../types";

interface ProviderSelectorProps {
  value: AiProvider;
  onChange: (provider: AiProvider) => void;
  disabled: boolean;
}

const PROVIDERS: { id: AiProvider; name: string; description: string }[] = [
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic Claude Sonnet",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google Gemini 2.5 Flash",
  },
];

export default function ProviderSelector({
  value,
  onChange,
  disabled,
}: ProviderSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        AI Provider
      </label>
      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            disabled={disabled}
            className={`flex flex-col items-start p-3 rounded-lg border-2 transition-all text-left
              ${
                value === provider.id
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span
              className={`text-sm font-semibold ${
                value === provider.id ? "text-primary-700" : "text-gray-900"
              }`}
            >
              {provider.name}
            </span>
            <span
              className={`text-xs mt-0.5 ${
                value === provider.id ? "text-primary-600" : "text-gray-500"
              }`}
            >
              {provider.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
