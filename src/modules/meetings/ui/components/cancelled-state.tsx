import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-5 flex flex-col gap-y-8 items-center justify-center shadow-elevated">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting cancelled"
        description="This meeting has been cancelled and will not take place"
      />
    </div>
  );
};

