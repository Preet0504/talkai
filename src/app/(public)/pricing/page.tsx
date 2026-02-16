import { PricingViewWithAuth } from "@/modules/pricing/ui/views/pricing-view-with-auth";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your AI agent needs. All plans include our core features with different usage limits.
        </p>
      </div>

      <PricingViewWithAuth />
    </div>
  );
}