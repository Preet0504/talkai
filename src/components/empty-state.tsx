import { BotIcon, PlusIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = "No Agents Found",
  message = "You haven't created any AI agents yet. Create one to start automating your meetings.",
  actionLabel = "Create Agent",
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
      {/* Branded Empty Icon Container */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Green Glow */}
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-green-100 blur-3xl opacity-60" />
        
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-slate-200 text-green-700 shadow-sm">
          <BotIcon size={40} strokeWidth={1.5} />
          {/* Small floating sparkles for the AI touch */}
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-2 max-w-[350px]">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Primary Action Button */}
      {onAction && (
        <Button 
          onClick={onAction}
          className="mt-8 gap-2 bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95 cursor-pointer px-6"
        >
          <PlusIcon size={18} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};