"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Calendar, 
  LogOut, 
  Wallet, 
  CreditCard,
  CheckCircle2,
  Briefcase,
  Users,
  Send,
  PieChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const [stats, setStats] = useState({ 
    totalEarned: 0, 
    totalSpent: 0, 
    bidsPlaced: 0,
    gigsWon: 0,
    gigsCreated: 0,
    totalBidsReceived: 0
  });

  useEffect(() => {
    const fetchFluidStats = async () => {
      try {
        const [bidRes, gigRes] = await Promise.all([
          api.get("/bids/my-bids"),
          api.get("/gigs/my-gigs")
        ]);

        const myBids = Array.isArray(bidRes.data) ? bidRes.data : bidRes.data.bids || [];
        const myGigs = Array.isArray(gigRes.data) ? gigRes.data : gigRes.data.gigs || [];

        setStats({
          bidsPlaced: myBids.length,
          gigsWon: myBids.filter((b: any) => b.status === "hired").length,
          totalEarned: myBids.filter((b: any) => b.status === "hired").reduce((s: number, b: any) => s + b.amount, 0),
          
          gigsCreated: myGigs.length,
          totalBidsReceived: myGigs.reduce((s: number, g: any) => s + (g.bids?.length || 0), 0),
          totalSpent: myGigs.filter((g: any) => g.status === "assigned").reduce((s: number, g: any) => s + (Number(g.budget) || 0), 0)
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    if (user) fetchFluidStats();
  }, [user]);

  const successRate = stats.bidsPlaced > 0 
    ? Math.round((stats.gigsWon / stats.bidsPlaced) * 100) 
    : 0;

  if (loading) return <div className="container py-10 text-center">Loading Profile...</div>;
  if (!user) return <div className="container py-10 text-center">Please login.</div>;

  return (
    <div className="container max-w-5xl py-10 space-y-10">
      {/* 1. Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-2xl bg-card shadow-sm">
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          <AvatarFallback className="text-xl bg-primary/5 text-primary font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.email}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined Jan 2026</span>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="text-destructive border-destructive/20 hover:bg-destructive/5">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 2. Freelancer Category */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
            <Briefcase className="h-5 w-5 text-primary" /> Freelancer Activity
          </h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Bids Placed" value={stats.bidsPlaced} icon={<Send className="h-4 w-4" />} />
              <StatCard title="Success Rate" value={`${successRate}%`} icon={<PieChart className="h-4 w-4" />} />
            </div>
            <Card className="bg-green-50/30 border-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Earned</p>
                    <p className="text-3xl font-bold text-green-600">${stats.totalEarned}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 3. Owner Category */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 px-1">
            <Users className="h-5 w-5 text-blue-600" /> Owner Activity
          </h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Gigs Created" value={stats.gigsCreated} icon={<Briefcase className="h-4 w-4 text-blue-600" />} />
              <StatCard title="Bids Received" value={stats.totalBidsReceived} icon={<Users className="h-4 w-4 text-blue-600" />} />
            </div>
            <Card className="bg-blue-50/30 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Amount Spent</p>
                    <p className="text-3xl font-bold text-blue-600">${stats.totalSpent}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-muted-foreground opacity-50">{icon}</div>
      </CardContent>
    </Card>
  );
}