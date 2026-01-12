"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { BidForm } from "@/components/bids/BidForm";
import { getSocket } from "@/lib/socket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { EditGigModal } from "@/components/gigs/EditGigModal";
import toast from "react-hot-toast";

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
  status: "open" | "assigned";
  owner: { _id: string; name: string };
};

export default function GigDetailPage() {
  const { gigId } = useParams();
  const { user } = useAuth();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
  
    const socket = getSocket();
  
    socket.on("bid:created", (newBid) => {
      setBids((prev) => [newBid, ...prev]);
    });
  
    return () => {
      socket.off("bid:created");
    };
  }, [user]);
  

  useEffect(() => {
    if (!user) return;
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
  }, [gigId, user]);

  const handleHire = async (bidId: string) => {
    if (!confirm("Are you sure you want to hire this freelancer?")) return;

    try {
      await api.post(`/gigs/${gig?._id}/hire`, { bidId });
      
      // Optimistic Update
      setBids((prev) =>
        prev.map((b) => ({
          ...b,
          status: b._id === bidId ? "hired" : "rejected",
        }))
      );
      if (gig) setGig({ ...gig, status: "assigned" });
      
      toast.success("Freelancer hired successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to hire");
    }
  };

  const handleGigUpdate = (updatedGig: any) => {
    setGig(updatedGig);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!gig) return <div className="p-10 text-center">Gig not found</div>;

  const isOwner = user?.id === gig.owner._id;
  const isFreelancer = user?.role === "freelancer";
  const hasAlreadyBid = bids.some(b => b.freelancer._id.toString() === user?.id);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* 1. Gig Header Information */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{gig.title}</h1>
          <p className="text-muted-foreground mt-1">Posted by {gig.owner.name}</p>
        </div>
        <Badge variant={gig.status === "open" ? "default" : "secondary"} className="text-sm">
          {gig.status.toUpperCase()}
        </Badge>
        {isOwner && (
          <EditGigModal gig={gig} onUpdate={handleGigUpdate} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-gray-700">{gig.description}</p>
          <div className="mt-4 pt-4 border-t">
            <span className="font-semibold text-lg">Budget: ${gig.budget}</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Owner View: Manage Bids */}
      {isOwner && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Received Bids ({bids.length})</h2>
          {bids.length === 0 ? (
            <p className="text-muted-foreground">No bids received yet.</p>
          ) : (
            <div className="grid gap-4">
              {bids.map((bid) => (
                <Card key={bid._id} className={bid.status === 'hired' ? "border-green-500 bg-green-50/30" : ""}>
                  <CardContent className="flex justify-between items-center p-4">
                    <div className="space-y-1">
                      <p className="font-bold text-lg">{bid.freelancer.name}</p>
                      <p className="text-primary font-medium">Bid Amount: ${bid.amount}</p>
                      <p className="text-sm text-gray-600 italic">"{bid.message}"</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={bid.status === "hired" ? "default" : "outline"}>
                        {bid.status.toUpperCase()}
                      </Badge>
                      {gig.status === "open" && bid.status === "pending" && (
                        <Button onClick={() => handleHire(bid._id)} size="sm">
                          Hire
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Freelancer View: Bidding logic */}
      {isFreelancer && (
        <div className="space-y-6">
          {hasAlreadyBid ? (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-bold text-blue-800">Your Application Status</h3>
                <div className="mt-2 flex items-center justify-between">
                   <p>You bid <strong>${bids.find(b => b.freelancer._id === user?.id)?.amount}</strong></p>
                   <Badge>{bids.find(b => b.freelancer._id === user?.id)?.status.toUpperCase()}</Badge>
                </div>
              </CardContent>
            </Card>
          ) : gig.status === "open" ? (
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Interested? Place your bid</h2>
              <BidForm
                gigId={gig._id}
                onBidCreated={(newBid) => setBids((prev) => [newBid, ...prev])}
              />
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic">This gig is no longer accepting bids.</p>
          )}
        </div>
      )}
    </main>
  );
}