"use client";

import { PricingCard } from "./pricing-card";

interface Product {
  id: string;
  name: string;
  description: string | null;
  prices: Array<{
    [key: string]: any;
  }>;
  benefits: Array<{
    [key: string]: any;
  }>;
  metadata: {
    [key: string]: any;
  };
}

interface PricingGridProps {
  products: Product[];
  onSelectPlan: () => void;
  getButtonText?: () => string;
}

export const PricingGrid = ({
  products,
  onSelectPlan,
  getButtonText = () => "Get Started"
}: PricingGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <PricingCard
          key={product.id}
          buttonText={getButtonText()}
          onClick={onSelectPlan}
          variant={
            product.metadata.variant === "highlighted"
              ? "highlighted"
              : "default"
          }
          title={product.name}
          price={
            product.prices[0]?.priceAmount
              ? product.prices[0].priceAmount / 100
              : 0
          }
          description={product.description}
          priceSuffix={`/${product.prices[0]?.recurringInterval || "month"}`}
          features={product.benefits.map(
            (benefit) => benefit.description
          )}
          badge={product.metadata.badge as string | null}
        />
      ))}
    </div>
  );
};