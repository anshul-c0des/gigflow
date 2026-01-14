"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Calendar, 
  LogOut, 
  Wallet, 
  CreditCard,
  Briefcase,
  Users,
  Send,
  PieChart,
  TrendingUp,
  ArrowLeft,
  Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import useAuthCheck from "@/hooks/useAuthCheck";

export default function ProfilePage() {
  useAuthCheck();
  const { user, logout, loading } = useAuth();
  const [stats, setStats] = useState({ 
    totalEarned: 0, 
    totalSpent: 0, 
    bidsPlaced: 0,
    gigsWon: 0,
    gigsCreated: 0,
    totalBidsReceived: 0
  });

  const router = useRouter();

  useEffect(() => {

    const fetchStats = async () => {
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

    if (user) fetchStats();
  }, [user]);

  const successRate = stats.bidsPlaced > 0 
    ? Math.round((stats.gigsWon / stats.bidsPlaced) * 100) 
    : 0;
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 animate-pulse text-brand" />
      <div className="animate-pulse text-emerald-600 font-semibold tracking-wide">Initializing GigFlow Profile...</div>
    </div>
  );

  if (!user) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-md w-full p-10 text-center shadow-xl rounded-[2rem] border-slate-100 bg-white">
        <p className="text-slate-600 mb-6 font-medium">Your session has expired.</p>
        <Button className="w-full bg-emerald-950 hover:bg-emerald-900 rounded-xl h-12">Return to Login</Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 flex flex-col items-center">
      <div className="w-full max-w-5xl px-6 pt-6 space-y-8">

      <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="text-slate-500 hover:text-emerald-700 "
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="relative overflow-hidden flex flex-col items-center text-center md:flex-row md:text-left gap-8 p-10 -mt-2 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm">
          
          <Avatar className="h-28 w-28 border-[6px] border-slate-50 shadow-sm ring-1 ring-emerald-100">
            <AvatarFallback className="text-3xl bg-emerald-50 text-emerald-700 font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3 z-10">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 rounded-full text-xs font-bold uppercase tracking-wider mt-2">
                {user.role}{user.role==='owner' ? "/Client" : ""}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" /> {user.email}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-600" /> Joined Jan 2026</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={logout} 
            className="z-10 h-12 px-6 rounded-xl border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <section className="space-y-6">
            <h2 className="text-sm font-black text-freelancer uppercase tracking-[0.2em] px-1">
              Freelancer Performance
            </h2>

            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-5">
                <StatCard title="Total Bids" value={stats.bidsPlaced} icon={<Send className="h-4 w-4" />} color="teal" />
                <StatCard title="Win Rate" value={`${successRate}%`} icon={<PieChart className="h-4 w-4" />} color="teal" />
              </div>
              
              <Card className="border-none bg-freelancer text-white shadow-lg shadow-teal-500/20 rounded-3xl">
                <CardContent className="px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-50/80 font-bold text-xs uppercase tracking-widest mb-2">Income</p>
                      <p className="text-4xl font-black">₹{stats.totalEarned.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      <Wallet className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section> 

          <section className="space-y-6">
            <h2 className="text-sm font-black text-client uppercase tracking-[0.2em] px-1">
              Client Activity
            </h2>

            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-5">
                <StatCard title="Gigs Posted" value={stats.gigsCreated} icon={<Briefcase className="h-4 w-4" />} color="emerald" />
                <StatCard title="Bids Recieved" value={stats.totalBidsReceived} icon={<Users className="h-4 w-4" />} color="emerald" />
              </div>

              <Card className="border-none bg-client text-white shadow-lg shadow-emerald-950/20 rounded-3xl">
                <CardContent className="px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-400/80 font-bold text-xs uppercase tracking-widest mb-2">  Outflow</p>
                      <p className="text-4xl font-black">₹{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: 'teal' | 'emerald';
}) {
  return (
    <Card className="border-slate-100 rounded-2xl bg-white shadow-sm">
      <CardContent className="px-6 py-3 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.15em]">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-emerald-50 text-emerald-900'}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}