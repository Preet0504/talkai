import { GridLoader } from "react-spinners";

interface Props {
  title: string;
  description: string;
}


export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="relative flex flex-col items-center justify-center gap-y-6 bg-gradient-to-br from-card to-muted/50 rounded-lg p-10 shadow-lg backdrop-blur-sm border border-border/50">
        <div className="relative z-10">
          <GridLoader
            color="#10b981"
            loading={true}
            size={8}
            margin={2}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        <div className="relative z-10 flex flex-col gap-y-2 text-center animate-fade-in-up">
          <h6 className="text-lg font-medium text-foreground">{title}</h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
