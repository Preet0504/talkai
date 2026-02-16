import { AlertCircle } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const ErrorState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-y-6 bg-gradient-to-br from-card to-muted/50 rounded-lg p-10 shadow-lg backdrop-blur-sm border border-border/50">
        <div className="relative z-10">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md animate-pulse-ring" />
          <AlertCircle className="relative size-8 text-red-500" />
        </div>
        <div className="relative z-10 flex flex-col gap-y-2 text-center animate-fade-in-up">
          <h6 className="text-lg font-medium">{title}</h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
