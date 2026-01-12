"use client";

import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  LogOut, 
  Settings2 
} from "lucide-react";

// Standard shadcn Card imports (Ensure these are in your components folder)
import { Card as ShadCard, CardContent as ShadContent, CardHeader as ShadHeader, CardTitle as ShadTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="container py-10">Loading Profile...</div>;
  if (!user) return <div className="container py-10">Please login to view profile.</div>;

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-8 border rounded-xl bg-card">
        <Avatar className="h-24 w-24 border-4 border-primary/10">
          <AvatarImage src="" />
          <AvatarFallback className="text-2xl bg-primary/5 text-primary">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto md:mx-0 uppercase tracking-wider text-[10px]">
              {user.role}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" /> {user.email}
          </p>
        </div>

        <Button variant="outline" size="sm" className="hidden md:flex">
          <Settings2 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Details */}
        <ShadCard>
          <ShadHeader>
            <ShadTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Account Information
            </ShadTitle>
          </ShadHeader>
          <ShadContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Member Since
              </span>
              <span className="font-medium">January 2026</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Status
              </span>
              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10 border-none">
                Verified
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Two-Factor
              </span>
              <span className="text-sm text-destructive font-medium underline cursor-pointer">
                Enable Now
              </span>
            </div>
          </ShadContent>
        </ShadCard>

        {/* Role Specific History (Placeholder for Phase 3/4) */}
        <ShadCard>
          <ShadHeader>
            <ShadTitle className="text-lg">
              {user.role === 'owner' ? 'Hiring Overview' : 'Work Overview'}
            </ShadTitle>
          </ShadHeader>
          <ShadContent className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShieldCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {user.role === 'owner' 
                ? "You haven't hired any freelancers yet." 
                : "You haven't completed any gigs yet."}
            </p>
            <Button variant="link" className="mt-2 text-primary" asChild>
              <a href={user.role === 'owner' ? "/gigs/create" : "/gigs"}>
                {user.role === 'owner' ? "Post your first gig" : "Browse marketplace"}
              </a>
            </Button>
          </ShadContent>
        </ShadCard>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div>
            <p className="font-medium">Sign out of your account</p>
            <p className="text-sm text-muted-foreground">Log out from this device immediately.</p>
          </div>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </div>
    </div>
  );
}