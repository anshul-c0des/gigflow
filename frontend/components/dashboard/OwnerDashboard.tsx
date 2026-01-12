"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, Briefcase, ArrowUpRight, Loader2 } from "lucide-react";
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

  // Derived stats
  const activeCount = gigs.filter((g) => g.status === "open").length;
  const totalBidsReceived = gigs.reduce((acc, curr) => acc + curr.bidCount, 0);

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
            <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bids Received</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBidsReceived}</div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <PlusCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" className="w-full">
              <Link href="/gigs/create">Post a New Gig</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Posted Gigs</CardTitle>
          <CardDescription>Manage your listings and hire freelancers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gigs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No gigs posted yet.</div>
            ) : (
              gigs.map((gig) => (
                <div key={gig._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{gig.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={gig.status === "open" ? "default" : "secondary"}>
                        {gig.status === "open" ? "Open" : "Assigned"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {gig.bidCount} {gig.bidCount === 1 ? "Bid" : "Bids"} received
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/gigs/${gig._id}`}>
                      View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}