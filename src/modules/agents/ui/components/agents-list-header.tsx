"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { AgentForm } from "./agent-form";

export const AgentsListHeader: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };
    
    return (
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Agents</h2>
                    {/* <CreateAgentButton /> */}
                    <Button onClick={handleOpenDialog}>
                        <PlusIcon />
                        Create Agent
                    </Button>
                </div>
                <p className="text-muted-foreground">
                    Manage your agents, view activity, and configure settings.
                </p>
            </div>
        </>
    )
}