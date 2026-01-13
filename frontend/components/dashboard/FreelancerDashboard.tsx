"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Send, CheckCircle2, Loader2, Clock, IndianRupee, Briefcase, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";

interface Bid {
  _id: string;
  amount: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
  gig: {
    _id: string;
    title: string;
    status: string;
  };
}

export default function FreelancerDashboard() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const { data } = await api.get("/bids/my-bids");
        setBids(Array.isArray(data) ? data : data.bids);
      } catch (error) {
        console.error("Failed to fetch bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    const handleStatusUpdate = (data: any) => {
      if (data.type === "hired" || data.type === "rejected") {
        setBids((prevBids) =>
          prevBids.map((bid) =>
            bid.gig?._id === data.gigId 
              ? { ...bid, status: data.type as "hired" | "rejected" } 
              : bid
          )
        );
      }
    };

    socket.on("notification:new", handleStatusUpdate);

    return () => {
      socket.off("notification:new", handleStatusUpdate);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 animate-pulse text-brand" />
    </div>
    );
  }

  const bidsSent = bids.length;
  const gigsWon = bids.filter((bid) => bid.status === "hired").length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bids Sent</CardTitle>
            <div className="p-2 bg-freelancer/5 rounded-lg">
              <Send className="h-4 w-4 text-freelancer" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{bidsSent}</div>
            <p className="text-xs text-slate-400 mt-1">Proposals in market</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between  space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Gigs Won</CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{gigsWon}</div>
            <p className="text-xs text-freelancer font-medium mt-1">Win rate: {bidsSent > 0 ? Math.round((gigsWon/bidsSent)*100) : 0}%</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-freelancer text-white relative overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-90">Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-lg font-bold mb-4">Ready for your next gig?</div>
            <Button asChild size="sm" variant="secondary" className="w-full bg-white text-teal-600 hover:bg-slate-50 border-none shadow-md">
              <Link href="/gigs" className="flex items-center justify-center gap-2">
                Browse Marketplace <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-freelancer-foreground flex items-center gap-2">
            Active Applications
            <Badge variant="outline" className="ml-2 font-medium bg-white">{bids.length}</Badge>
          </h2>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            {bids.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No active applications found.</p>
                <Link href="/gigs" className="text-teal-600 text-sm font-semibold hover:underline mt-1">Explore available gigs</Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {bids.map((bid) => (
                  <div key={bid._id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-teal-50 transition-all">
                    <div className="flex gap-4">
                      <div className={`hidden sm:flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                        bid.status === 'hired' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {bid.gig?.title || "Project Title Unavailable"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <IndianRupee className="w-3.5 h-3.5" /> {bid.amount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(bid.createdAt))} ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                      <Badge 
                        className={`px-3 py-1 rounded-full font-semibold capitalize tracking-wide shadow-none border-none ${
                          bid.status === "pending" 
                            ? "bg-amber-100 text-amber-700" 
                            : bid.status === "hired"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {bid.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg px-4">
                        <Link href={`/gigs/${bid.gig?._id}`}>View Details</Link>
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