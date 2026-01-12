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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Briefcase } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
// import { useToast } from "@/components/ui/use-toast";

// Schema matches your backend 'createGigSchema'
const gigFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(3, "Please provide a more detailed description"),
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
      toast.success("Your gig has been posted to the marketplace.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create gig");
        if (error.response?.status === 400) {        
        const fieldErrors = error.response.data.errors.fieldErrors;
        console.log(fieldErrors);
        }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle>Post a New Gig</CardTitle>
          </div>
          <CardDescription>
            Describe the project and the budget. Freelancers will bid on this gig.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Build a Landing Page for SaaS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range (e.g., $500 - $1000)</FormLabel>
                    <FormControl>
                      <Input placeholder="$500" {...field} />
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
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detail the requirements, tech stack, and timeline..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Gig
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}