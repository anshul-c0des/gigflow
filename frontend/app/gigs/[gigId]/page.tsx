"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BidForm } from "@/components/bids/BidForm";
import { getSocket } from "@/lib/socket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Clock, 
  CheckCircle2, 
  Zap,
  IndianRupee,
  ArrowLeft
} from "lucide-react";
import api from "@/lib/axios";
import { EditGigModal } from "@/components/gigs/EditGigModal";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import useAuthCheck from "@/hooks/useAuthCheck";

type Bid = {
  _id: string;
  amount: number;
  message: string;
  status: "pending" | "hired" | "rejected";
  freelancer: { _id: string; name: string };
};

type Gig = {
  _id: string;
  title: string;
  description: string;
  budget: string;
  createdAt: string;
  status: "open" | "assigned";
  owner: { _id: string; name: string };
};

export default function GigDetailPage() {
  useAuthCheck();

  const { gigId } = useParams();
  const { user } = useAuth();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isSpecificOwner = user?.id === gig?.owner._id;
  const canPlaceBid = !isSpecificOwner && !loading && gig?.status === "open";
  const hasAlreadyBid = bids.some((b) => b.freelancer._id === user?.id);

  useEffect(() => {
    if (!user || !isSpecificOwner) return;
    const socket = getSocket();
    if (!socket) return;
    const handleNewBid = (newBid: Bid) => {
      setBids((prev) => [newBid, ...prev]);
      toast.success("New bid received!");
    };
    socket.on("bid:created", handleNewBid);
    return () => { socket.off("bid:created", handleNewBid); };
  }, [user, isSpecificOwner]);

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const { data } = await api.get(`/gigs/${gigId}`);
        setGig(data.gig);
        setBids(data.bids || []);
      } catch (err) {
        toast.error("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    fetchGigDetails();
  }, [gigId]);

  const handleHire = async (bidId: string) => {
    try {
      await api.post(`/gigs/${gig?._id}/hire`, { bidId });
      setBids((prev) => prev.map((b) => ({
        ...b, status: b._id === bidId ? "hired" : "rejected",
      })));
      if (gig) setGig({ ...gig, status: "assigned" });
      toast.success("Freelancer hired successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to hire");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Zap className="h-8 w-8 animate-pulse text-teal-500" />
    </div>
  );
  if (!gig) return <div className="p-20 text-center">Gig not found</div>;

  return (
    <main className="min-h-screen-[68px] bg-slate-50/50 pb-20">
      <div className=" mb-8">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="text-slate-500 hover:text-emerald-700 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
          <div className="flex items-center gap-3">
            <Badge className={gig.status === "open" ? "bg-emerald-100 text-emerald-700 border-none" : "bg-slate-100 text-slate-600 border-none"}>
              {gig.status.toUpperCase()}
            </Badge>
            {isSpecificOwner && gig.status==="open" &&  <EditGigModal gig={gig} onUpdate={setGig} />}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6 -mt-5">
          <section className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{gig.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {gig.owner.name}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDistanceToNow(new Date(gig.createdAt))} ago</span>
            </div>
          </section>

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="px-6 py-2">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Description</h3>
              <p className="whitespace-pre-wrap text-slate-600 leading-relaxed text-lg">
                {gig.description}
              </p>
            </CardContent>
          </Card>

          {isSpecificOwner && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Received Bids</h2>
                <Badge variant="outline" className="text-slate-500">{bids.length}{bids.length === 1 ? " Applicant" : " Applicants" } {bids.length === 0 ? " yet" : ""}</Badge>
              </div>
              
              <div className="grid gap-4">
                {bids.map((bid) => (
                  <Card key={bid._id} className={`border-none transition-all ${bid.status === 'hired' ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white shadow-sm"}`}>
                    <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-1 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-xl text-slate-900">{bid.freelancer.name}</p>
                          {bid.status === 'hired' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <p className="text-emerald-700 font-bold flex items-center gap-1 text-lg">
                           ₹{bid.amount}
                        </p>
                        <p className="text-slate-600 italic leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                          Message from freelancer: "{bid.message}"
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3 min-w-[120px]">
                        <Badge className={bid.status === "hired" ? "bg-emerald-500" : "bg-slate-100 text-slate-600 shadow-none border-none"}>
                          {bid.status.toUpperCase()}
                        </Badge>
                        {gig.status === "open" && bid.status === "pending" && (
                          <Button 
                            onClick={() => handleHire(bid._id)} 
                            className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold"
                          >
                            Hire Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
           {!isSpecificOwner && (
                <div className="pt-4">
                  {hasAlreadyBid ? (
                    <div className="bg-white/10 p-4 rounded-xl text-center space-y-2 border border-white/20">
                      <p className="text-sm font-medium">Application Active</p>
                      <Badge className="bg-teal-500 text-white border-none">
                        {bids.find(b => b.freelancer._id === user?.id)?.status.toUpperCase()}
                      </Badge>
                    </div>
                  ) : canPlaceBid ? (
                    <div className="space-y-4">
                      <p className="text-xs text-emerald-400 text-center">Ready to work on this?</p>
                      <BidForm
                        gigId={gig._id}
                        onBidCreated={(newBid) => setBids((prev) => [newBid, ...prev])}
                      />
                    </div>
                  ) : (
                    <p className="text-center text-emerald-400 text-sm italic">This opportunity is closed.</p>
                  )}
                </div>
              )}
        </div>

        

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-emerald-900 text-white overflow-hidden sticky top-18">
            <CardContent className="p-8 py-3 space-y-6">
                <p className="text-white text-center text-2xl font-bold uppercase tracking-widest mb-5 -mt-2">Summary Card</p>
              <div>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Total Budget</p>
                <h2 className="text-4xl font-black flex items-center gap-1">
                  <IndianRupee className="w-8 h-8 text-emerald-500" /> {gig.budget}
                </h2>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Status</span>
                  <span className="font-bold capitalize">{gig.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-400">Proposals</span>
                  <span className="font-bold">{bids.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}