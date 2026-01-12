"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Send, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";

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

  // Derived Stats
  const bidsSent = bids.length;
  const gigsWon = bids.filter((bid) => bid.status === "hired").length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bids Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bidsSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gigs Won</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gigsWon}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Job</CardTitle>
            <Search className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/gigs">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Active Applications</CardTitle>
          <CardDescription>Track the status of your submitted bids.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bids.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                You haven't applied to any gigs yet.
              </p>
            ) : (
              bids.map((bid) => (
                <div key={bid._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{bid.gig?.title || "Unknown Gig"}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied {formatDistanceToNow(new Date(bid.createdAt))} ago • ${bid.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={
                        bid.status === "pending" 
                          ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10" 
                          : bid.status === "hired"
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/10"
                          : "bg-red-500/10 text-red-600 hover:bg-red-500/10"
                      } 
                      variant="secondary"
                    >
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/gigs/${bid.gig?._id}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}