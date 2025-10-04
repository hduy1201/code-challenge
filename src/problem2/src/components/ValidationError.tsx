import { AlertTriangle } from "lucide-react";

interface ValidationErrorProps {
  message: string;
}

export function ValidationError({ message }: ValidationErrorProps) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-red-900 dark:text-red-100">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
