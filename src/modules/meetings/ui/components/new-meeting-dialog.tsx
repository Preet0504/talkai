import { useRouter } from "next/navigation";

import { MeetingForm } from "./meeting-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";

interface NewMeetingDilaogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDilaog = ({
  open,
  onOpenChange,
}: NewMeetingDilaogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
