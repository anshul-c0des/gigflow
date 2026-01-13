"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer" as "owner" | "freelancer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex items-center justify-center bg-slate-50/50 px-4 pt-5 pb-4">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-700 ${form.role === 'owner' ? 'bg-emerald-100/30' : 'bg-teal-100/30'}`} />
      </div>

      <Card className="relative z-10 w-full max-w-xl border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white/90 backdrop-blur-xl overflow-hidden">
        <CardHeader className="space-y-1 pt-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-emerald-600">
            Create your account
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Join the professional network
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-6 px-8 md:px-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "freelancer" })}
                className={`flex justify-center items-center gap-3 p-1 rounded-2xl border-2 transition-all ${
                  form.role === "freelancer" 
                    ? "border-teal-500 bg-teal-50/50 ring-4 ring-teal-500/10" 
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div className={`p-2 rounded-xl ${form.role === "freelancer" ? "bg-teal-500 text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
                  <User size={14} />
                </div>
                <span className={`text-sm font-bold ${form.role === "freelancer" ? "text-teal-900" : "text-slate-500"}`}>Freelancer</span>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: "owner" })}
                className={`flex justify-center items-center gap-3 p-1 rounded-2xl border-2 transition-all ${
                  form.role === "owner" 
                    ? "border-emerald-950 bg-emerald-50/50 ring-4 ring-emerald-950/5" 
                    : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                }`}
              >
                <div className={`p-2 rounded-xl ${form.role === "owner" ? "bg-emerald-950 text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
                  <Briefcase size={14} />
                </div>
                <span className={`text-sm font-bold ${form.role === "owner" ? "text-emerald-950" : "text-slate-500"}`}>Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                <Input
                  placeholder="John Doe"
                  className="h-12 rounded-xl border-slate-200 focus:ring-slate-900/10 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="h-12 rounded-xl border-slate-200 focus:ring-slate-900/10 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 focus:ring-slate-900/10 transition-all"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <p className="text-rose-600 bg-rose-50 p-3 rounded-xl text-sm font-medium border border-rose-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full h-12 mt-1 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                form.role === 'owner' ? 'bg-emerald-950 hover:bg-emerald-900 shadow-emerald-950/10' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/10'
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>Complete Registration <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-slate-900 font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}