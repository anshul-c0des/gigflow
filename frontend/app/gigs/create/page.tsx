"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, Briefcase, IndianRupee, Rocket, ArrowLeft, Zap } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const gigFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(5, "Please provide a more detailed description (min 5 chars)"),
  budget: z.string().min(1, "Budget is required"),
});

type GigFormValues = z.infer<typeof gigFormSchema>;

export default function CreateGigPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
    },
  });

  async function onSubmit(values: GigFormValues) {
    setIsLoading(true);
    try {
      await api.post("/gigs", values);
      toast.success("Gig successfully published to the marketplace!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen-[68px] bg-slate-50/50 py-6 px-4 pb-18">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-slate-500 hover:text-emerald-700 "
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <Card className="border-none shadow-2xl shadow-emerald-900/5 overflow-hidden bg-white">
          <CardHeader className="p-8 py-2 pb-0">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl text-brand font-bold">Post a New Gig</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-8 py-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold">Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Modern UI/UX Designer for E-commerce App" 
                          className="h-12 bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold">Estimated Budget</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="number"
                            placeholder="--" 
                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl font-bold"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold">Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detail the scope, deliverables, and any specific tech stack requirements..." 
                          className="min-h-[180px] bg-slate-50 border-slate-200 focus:ring-emerald-500 rounded-xl resize-none p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 border-t border-slate-100 flex gap-4 items-center justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="font-semibold text-slate-500 hover:bg-red-50 hover:text-red-400 cursor-pointer"
                  >
                    Discard
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className=" bg-brand cursor-pointer hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all "
                  >
                    {isLoading ? (
    <div className="flex h-screen items-center justify-center bg-slate-50">
    <Zap className="h-8 w-8 animate-pulse text-brand" />
  </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        Publish Gig <Rocket className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}