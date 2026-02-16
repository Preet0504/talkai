import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/ui/world-map";

export const HomeGlobe = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            AI agents serving customers
            <span className="text-primary"> worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Join thousands of businesses already using Meet AI to deliver exceptional customer experiences
            across every timezone, in every language, 24/7.
          </p>

          <div className="mb-12">
            <WorldMap
              dots={[
                {
                  start: { lat: 40.7128, lng: -74.0060 }, // New York
                  end: { lat: 51.5074, lng: -0.1278 },   // London
                },
                {
                  start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
                  end: { lat: 35.6762, lng: 139.6503 },   // Tokyo
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 },   // London
                  end: { lat: -33.8688, lng: 151.2093 },  // Sydney
                },
                {
                  start: { lat: 19.0760, lng: 72.8777 },   // Mumbai
                  end: { lat: 1.3521, lng: 103.8198 },    // Singapore
                },
              ]}
              lineColor="oklch(0.63 0.1699 149.21)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">AI agents never sleep</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Languages supported</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-muted-foreground">Uptime guarantee</p>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-xl border border-border p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Ready to scale your customer conversations?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your first AI agent in minutes. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-10 py-4 rounded-xl shadow-lg" asChild>
                <Link href="/sign-up">
                  Start building now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-10 py-4 rounded-xl" asChild>
                <Link href="/sign-in">
                  See live demo
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>2 AI agents included</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Setup in 60 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};