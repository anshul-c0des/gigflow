"use client";

import { useAuth } from "@/context/AuthContext";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading || !user) return <p>Loading...</p>;


  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here is what's happening with your account.
        </p>
      </div>

      {user?.role === "owner" ? <OwnerDashboard /> : <FreelancerDashboard />}
    </div>
  );
}