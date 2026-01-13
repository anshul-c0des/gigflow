"use client";

import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import { Briefcase, UserSearch, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultTab = user?.role === "owner" ? "owner" : "freelancer";

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Console</h1>
          <p className="text-muted-foreground">Manage your hiring and work in one place.</p>
        </div>
      </div>

      <Tabs key={defaultTab} defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="freelancer" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Work as Freelancer
          </TabsTrigger>
          <TabsTrigger value="owner" className="flex items-center gap-2">
            <UserSearch className="h-4 w-4" /> Hire as Client
          </TabsTrigger>
        </TabsList>

        <TabsContent value="freelancer" className="mt-0">
          <FreelancerDashboard />
        </TabsContent>

        <TabsContent value="owner" className="mt-0">
          <OwnerDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}