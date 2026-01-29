import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "Our agents encountered an error while fetching your data.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
      {/* Branded Error Icon Container */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Red/Amber Glow */}
        <div className="absolute h-20 w-20 animate-pulse rounded-full bg-rose-100 blur-2xl" />
        
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-xl shadow-rose-100 border border-rose-100 animate-shake">
          <AlertCircle size={32} />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mx-auto max-w-[320px] text-sm text-slate-500">
          {message}
        </p>
      </div>

      {/* Action Button */}
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-8 gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
        >
          <RefreshCcw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};