"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, SendHorizontal, Info, IndianRupee, Zap } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  gigId: string;
  onBidCreated: (bid: any) => void;
};

export const BidForm = ({ gigId, onBidCreated }: Props) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) <= 0) return toast.error("Please enter a valid amount");

    setLoading(true);
    try {
      const { data } = await api.post("/bids", { 
        gigId, 
        amount: Number(amount), 
        message: message || "" 
      });
      
      toast.success("Proposal submitted successfully!");
      onBidCreated(data.bid);
      setAmount("");
      setMessage("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-100 rounded-lg">
            <SendHorizontal className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Submit Proposal</CardTitle>
            <p className="text-xs text-slate-500 font-medium">Set your terms for this gig</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="-mt-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
              Your Bid
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="--"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 h-12 bg-slate-50/50 border-slate-200 focus:ring-teal-500 focus:border-teal-500 rounded-xl font-bold text-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-slate-700">
              Message for Bid owner
            </Label>
            <Textarea
              id="message"
              placeholder="Explain why you're the best fit for this project..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:ring-teal-500 focus:border-teal-500 rounded-xl resize-none p-4"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98] group"
          >

            {loading ? (
                <div className="flex h-screen items-center justify-center bg-slate-50">
                <Zap className="h-8 w-8 animate-pulse text-brand" />
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Send Proposal <SendHorizontal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};