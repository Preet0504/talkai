import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  useImage?: boolean;
  image?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  useImage = true,
  image = "/empty.svg",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 rounded-lg border border-border/60 bg-card/60 px-6 py-12 text-center shadow-elevated ${className}`}
    >
      {useImage ? (
        <Image src={image} alt="Empty" width={220} height={220} />
      ) : Icon ? (
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      ) : null}

      <div className="flex flex-col gap-y-4 mx-auto text-center max-w-md">
        <h6 className="text-lg font-medium font-display">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
    </div>
  );
}
