"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { PricingGrid } from "@/components/pricing";

interface PricingViewProps {
  isAuthenticated?: boolean;
}

export const PricingView = ({ isAuthenticated = false }: PricingViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );

  const handleSelectPlan = () => {
    if (isAuthenticated) {
      // User is logged in, redirect to upgrade page
      router.push("/upgrade");
    } else {
      // User is not logged in, redirect to signup page
      router.push("/sign-up");
    }
  };

  const getButtonText = () => {
    return isAuthenticated ? "Upgrade" : "Get Started";
  };

  return (
    <div className="flex justify-center">
      <PricingGrid
        products={products}
        onSelectPlan={handleSelectPlan}
        getButtonText={getButtonText}
      />
    </div>
  );
};