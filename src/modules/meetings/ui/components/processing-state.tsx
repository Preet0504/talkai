import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
  return (
    <div className="bg-card rounded-lg border border-border/60 px-4 py-5 flex flex-col gap-y-8 items-center justify-center shadow-elevated">
      <EmptyState
        image="/processing.svg"
        title="Meeting completed"
        description="The meeting has been completed and is being processed. The summary will be available shortly."
      />
    </div>
  );
};
