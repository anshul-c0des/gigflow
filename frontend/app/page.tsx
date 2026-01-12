import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container relative z-10 px-4 md:px-6 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-6 bg-muted/50 text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Zap className="w-3 h-3 mr-2 fill-primary text-primary" />
          <span>Start Hiring or Get Hired</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Gig<span className="text-primary">Flow</span>
        </h1>

        <p className="max-w-[700px] mx-auto text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
          Where elite talent meets high-impact projects. 
          Experience a <strong>race-condition-safe</strong> marketplace built for speed and reliability.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-12 px-8 text-md font-semibold">
            <Link href="/register">
              Get Started
            </Link>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          
          <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold">
            <Link href="/login">
              Login to Account
            </Link>
          </Button>
        </div>

        {/* Feature Tags */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground/80">
          <div className="flex items-center gap-2">✓ Real-time Notifications</div>
          <div className="flex items-center gap-2">✓ Atomic Hiring Logic</div>
          <div className="flex items-center gap-2">✓ TypeScript Powered</div>
        </div>
      </div>
    </div>
  );
}