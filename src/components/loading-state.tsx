import { Loader2Icon, BotIcon } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  message?: string;
}

export const LoadingState = ({
  title = "Analyzing with Talk.AI",
  message = "Our agents are preparing your workspace...",
}: LoadingStateProps) => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center">
      {/* Branded Icon Container */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* The Glow effect using standard pulse */}
        <div className="absolute h-20 w-20 animate-pulse rounded-full bg-green-200/50 blur-2xl" />
        
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-white shadow-xl shadow-green-200/50">
          <BotIcon size={32} className="animate-bounce" />
          
          {/* Spinner positioned slightly off-center for a "docked" look */}
          <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-sm">
            <Loader2Icon 
              className="h-5 w-5 animate-spin text-green-700" 
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mx-auto max-w-[280px] text-sm text-slate-500">
          {message}
        </p>
      </div>

      {/* Branded Progress Bar */}
      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-full bg-green-700 animate-progress" />
      </div>
    </div>
  );
};