"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Briefcase, ArrowUpRight, Loader2, MoreHorizontal, Layers, Zap } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

interface OwnerGig {
  _id: string;
  title: string;
  status: "open" | "assigned";
  bidCount: number;
}

export default function OwnerDashboard() {
  const [gigs, setGigs] = useState<OwnerGig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/gigs/my-gigs");
        setGigs(data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const activeCount = gigs.filter((g) => g.status === "open").length;
  const totalBidsReceived = gigs.reduce((acc, curr) => acc + curr.bidCount, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 animate-pulse text-brand" />
    </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Listings</CardTitle>
            <div className="p-2 bg-client/5 rounded-lg">
              <Layers className="h-4 w-4 text-client" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeCount}</div>
            <p className="text-xs text-slate-400 mt-1">Gigs currently accepting bids</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Bids</CardTitle>
            <div className="p-2 bg-client/5 rounded-lg">
              <Users className="h-4 w-4 text-client" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalBidsReceived}</div>
            <p className="text-xs text-slate-400 mt-1">Cumulative freelancer interest</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-600 text-white relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-80">Management</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-lg font-bold mb-4">Need more talent?</div>
            <Button asChild size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white border-none shadow-lg transition-all active:scale-[0.98]">
              <Link href="/gigs/create" className="flex items-center justify-center gap-2">
                Post a New Gig <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500" />
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Posted Gigs
            <Badge variant="outline" className="ml-2 font-medium bg-white">
              {gigs.length}
            </Badge>
          </h2>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            {gigs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium tracking-tight">Your project shelf is empty.</p>
                <Link href="/gigs/create" className="text-emerald-700 text-sm font-semibold hover:underline mt-1">Post your first gig</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {gigs.map((gig) => (
                  <div key={gig._id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-emerald-50 transition-all">
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-800 transition-colors">
                        {gig.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        
                        <span className="text-sm text-slate-400 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span className="font-medium text-slate-600">{gig.bidCount}</span> 
                          {gig.bidCount === 1 ? "applicant" : "applicants"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                    <Badge 
                          className={`shadow-none border-none px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            gig.status === "open" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {gig.status}
                        </Badge>
                      <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-teal-600 hover:bg-emerald-100/70 rounded-lg px-4">
                      <Link href={`/gigs/${gig._id}`} className="flex items-center gap-2">
                          Manage Gig <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}