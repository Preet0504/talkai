import { GridLoader } from "react-spinners";

interface Props {
  title: string;
  description: string;
}


export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
      <div className="relative flex flex-col items-center justify-center gap-y-6 bg-gradient-to-br from-card to-muted/50 rounded-lg p-10 shadow-elevated backdrop-blur-sm border border-border/60">
        <div className="relative z-10">
          <GridLoader
            color="var(--primary)"
            loading={true}
            size={8}
            margin={2}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <div className="relative z-10 flex flex-col gap-y-2 text-center animate-fade-in-up">
          <h6 className="text-lg font-medium font-display text-foreground">
            {title}
          </h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
