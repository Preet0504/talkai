"use client";

import { authClient } from "@/lib/auth-client";
import { PricingView } from "./pricing-view";

export const PricingViewWithAuth = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return <PricingView isAuthenticated={!!session?.user} />;
};