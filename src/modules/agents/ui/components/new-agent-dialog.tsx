import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const NewAgentDialog = ({
    open,
    onOpenChange,
}: NewAgentDialogProps) => {
    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Create New Agent"
            description="Define your agent's name and instructions to get started."
        >
            New Agent Form
            <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
        </ResponsiveDialog>
    )
}