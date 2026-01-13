"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-68px)] flex items-center justify-center bg-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50/80 backdrop-blur-md border border-slate-200/50 mb-8 shadow-sm">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Next-Gen Freelance Protocol
          </span>
        </div>

        <h1 className="text-7xl md:text-[7rem] font-bold tracking-tighter text-slate-900 mb-6 leading-none">
          Gig<span className="text-emerald-950">Flow.</span>
        </h1>

        <p className="max-w-[540px] text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
          The high-fidelity terminal where <span className="text-slate-900">elite talent</span> meets <span className="text-slate-900">high-impact</span> projects. Scalable, secure, and atomic.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full">         
          <Button 
            asChild
            variant="outline" 
            className="h-14 px-10 text-lg text-slate-700 bg-white/40 backdrop-blur-md border-slate-200 font-bold hover:bg-emerald-100/60 rounded-2xl shadow-sm transition-all active:scale-95"
          >
            <Link href="/gigs">Login</Link>
          </Button>

          <Button 
            asChild
            className="h-14 px-10 text-lg bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-950/20 active:scale-95 group"
          >
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="w-full max-w-3xl flex flex-wrap justify-center items-center gap-x-10 gap-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">hire or get hired</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-teal-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Atomic Logic</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Real-time Notifications</span>
          </div>
        </div>
      </div>
    </section>
  );
}