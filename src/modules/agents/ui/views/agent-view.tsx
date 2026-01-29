"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    return (
        <div>
            <h1>Agents</h1>
            <ul>
                {data?.map(agent => (
                    <li key={agent.id}>{agent.name}</li>
                ))}
            </ul>
        </div>
    );
}

export const AgentLoadingState = () => (
    <LoadingState 
        title="Loading Agents" 
        message="Fetching agents from the server." 
    />
);

export const AgentErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <ErrorState 
        title="Failed to Load Agents"
        message="There was an error fetching agents. Please try again."
        onRetry={onRetry}
    />
);