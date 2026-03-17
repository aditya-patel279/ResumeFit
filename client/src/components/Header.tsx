import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Resume Tailor</h1>
            <p className="text-sm text-gray-500">
              AI-powered resume optimization for your dream job
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
