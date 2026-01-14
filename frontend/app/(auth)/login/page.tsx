"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login, loading: authLoading, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(form.email, form.password);
      console.log("Logged in user:", loggedInUser);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex items-center justify-center bg-slate-50/50 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-3xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 pt-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Enter your credentials
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-950/10 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to GigFlow?{" "}
              <Link
                href="/register"
                className="text-emerald-700 font-bold hover:underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
