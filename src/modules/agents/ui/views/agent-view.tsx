"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    
    if (!data || data.length === 0) {
        return <AgentEmptyState />;
    }

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns}/>
        </div>
    );
}

export const AgentLoadingState = () => (
    <LoadingState 
        title="Loading Agents" 
        message="Fetching agents from the server." 
    />
);

export const AgentEmptyState = () => (
    EmptyState({
        title: "No Agents Found",
        message: "You haven't created any AI agents yet. Create one to start automating your meetings.",
        actionLabel: "Create Agent",
        onAction: () => {
            // This should trigger the new agent creation flow, e.g., open a modal
            console.log("Create Agent button clicked");
        }
    })
);

export const AgentErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <ErrorState 
        title="Failed to Load Agents"
        message="There was an error fetching agents. Please try again."
        onRetry={onRetry}
    />
);