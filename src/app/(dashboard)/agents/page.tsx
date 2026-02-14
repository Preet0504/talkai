import { AgentsView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AgentsViewLoading } from "@/modules/agents/ui/views/agent-view";
import { Suspense } from "react";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from "@/constants";

const Page = async () => {

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    search: null,
  }));
  
  return (
    <>
    <AgentsListHeader />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsView />
      </Suspense>
    </HydrationBoundary>
    </>
  );
}

export default Page;