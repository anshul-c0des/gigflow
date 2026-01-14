"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import useAuthCheck from "@/hooks/useAuthCheck";

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  owner: { name: string; avatar?: string };
};

export default function HomePage() {
  useAuthCheck();

  const [gigs, setGigs] = useState<Gig[]>([]); 
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/gigs");
      setGigs(data.gigs);
    };
    load();
  }, []);

  useEffect(() => {   // get gigs and debounced search
    const controller = new AbortController();

    const run = async () => {
      if (!query.trim()) {
        try {
          setLoading(true);
          const { data } = await api.get("/gigs", {
            signal: controller.signal,
          });
          setGigs(data.gigs);
        } catch {
        } finally {
          setLoading(false);
        }
        return;
      }

      const timeout = setTimeout(async () => {   // search bu title/description
        try {
          setLoading(true);
          const { data } = await api.get("/gigs/search", {
            params: { q: query },
            signal: controller.signal,
          });
          setGigs(data.results);
        } catch {
        } finally {
          setLoading(false);
        }
      }, 800);

      return () => clearTimeout(timeout);
    };

    run();

    return () => controller.abort();
  }, [query]);

  return (
    <main className="min-h-screen-[68px] bg-slate-50/50">
      <div className="container max-w-6xl mx-auto px-6 lg:px-12 py-8 md:py-10 space-y-8">
        <header className="space-y-6">
          <div className="space-y-2 pb-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Find your next{" "}
              <span className="text-brand underline decoration-teal-500/20 underline-offset-8">
                gig
              </span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or description... (min 3 letters)"
                className="pl-10 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-teal-500"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex h-screen items-center justify-center bg-slate-50">
              <Zap className="h-8 w-8 animate-pulse text-brand" /> Searching
              gigs…
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">
                No gigs found. Check back later!
              </p>
            </div>
          ) : (
            gigs.map((gig) => (
              <Link href={`/gigs/${gig._id}`} key={gig._id} className="group">
                <Card className="border-none shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-50 overflow-hidden bg-white">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-8 py-3 gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {gig.status || "OPEN"}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDistanceToNow(new Date(gig.createdAt))} ago
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h2 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                            Title: {gig.title}
                          </h2>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed max-w-2xl">
                            Description: {gig.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600">
                              {gig.owner.name.charAt(0)}
                            </div>
                            Posted by{" "}
                            <span className="text-brand">{gig.owner.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Budget
                          </p>
                          <p className="text-2xl font-black text-slate-900">
                            ₹{gig.budget?.toLocaleString() || "Negotiable"}
                          </p>
                        </div>
                        <div className="bg-brand text-white p-2 rounded-full group-hover:bg-teal-600 transition-colors duration-300">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

// Simple internal Button component for the example
function Button({ className, variant, children, ...props }: any) {
  const variants = {
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${
        variants[variant as keyof typeof variants]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
