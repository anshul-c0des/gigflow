"use client";

import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import { Briefcase, UserSearch, Loader2, Zap } from "lucide-react";
import useAuthCheck from "@/hooks/useAuthCheck";

export default function DashboardPage() {
  useAuthCheck();
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 animate-pulse text-brand" />
    </div>
  );

  const defaultTab = user?.role === "owner" ? "owner" : "freelancer";

  return ( 
    <div className="min-h-screen-[68px] bg-slate-50/50">
      <div className="container max-w-6xl mx-auto px-6 lg:px-12 py-8 md:py-10 space-y-8">
        
        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            My <span className="text-brand underline decoration-teal-500/20 underline-offset-8">Dashboard</span>
          </h1>
        </header>

        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="border-b border-slate-200">
            <TabsList className="bg-transparent h-auto p-0 flex gap-2 justify-start -mb-px">
              
              <TabsTrigger 
                value="freelancer" 
                className="group flex items-center gap-3 px-6 py-3 rounded-t-xl font-semibold text-slate-500 transition-all border-b-2 border-transparent
                data-[state=active]:bg-teal-50/50 data-[state=active]:text-teal-700 data-[state=active]:border-teal-500
                hover:text-slate-700 hover:bg-slate-100/50"
              >
                <Briefcase className="h-4 w-4 opacity-70 group-data-[state=active]:opacity-100" />
                <span className="text-sm md:text-base">Freelancing</span>
              </TabsTrigger>

              <TabsTrigger 
                value="owner" 
                className="group flex items-center gap-3 px-6 py-3 rounded-t-xl font-semibold text-slate-500 transition-all border-b-2 border-transparent
                data-[state=active]:bg-emerald-50/50 data-[state=active]:text-emerald-900 data-[state=active]:border-emerald-700
                hover:text-slate-600 hover:bg-slate-100/50"
              >
                <UserSearch className="h-4 w-4 opacity-70 group-data-[state=active]:opacity-100" />
                <span className="text-sm md:text-base">Hiring</span>
              </TabsTrigger>
              
            </TabsList>
          </div>

          <div className="pt-6 md:pt-8">
            <TabsContent value="freelancer" className="mt-0 outline-none ring-0 border-none">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <FreelancerDashboard />
              </div>
            </TabsContent>

            <TabsContent value="owner" className="mt-0 outline-none ring-0 border-none">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <OwnerDashboard />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}