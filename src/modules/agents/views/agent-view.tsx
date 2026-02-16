"use client";
import { useTRPC } from "@/trpc/client";
import { columns } from "../ui/components/columns";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useAgentsFilters } from "../hooks/use-agent-filters";
import { DataPagination } from "@/components/data-pagination";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";

export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
        emptyStateComponent={
          <EmptyState
            title="Create your first agent"
            description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
          />
        }
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};

export const AgentsViewLoading = () => (
  <LoadingState
    title="Loading Agents"
    description="This may take a few seconds"
  />
);

export const AgentsViewErrorState = () => (
  <ErrorState
    title="Error Loading Agents"
    description="Please try again later"
  />
);
