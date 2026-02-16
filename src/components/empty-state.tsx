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
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      {useImage ? (
        <Image src={image} alt="Empty" width={240} height={240} />
      ) : Icon ? (
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      ) : null}

      <div className="flex flex-col gap-y-6 mx-auto text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
    </div>
  );
}
