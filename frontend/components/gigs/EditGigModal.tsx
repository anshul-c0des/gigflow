"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  IndianRupee,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface EditGigModalProps {
  gig: {
    _id: string;
    title: string;
    description: string;
    budget: string;
  };
  onUpdate: (updatedGig: any) => void;
}

export function EditGigModal({ gig, onUpdate }: EditGigModalProps) {
  const [open, setOpen] = useState(false);   // open/close modal state
  const [loading, setLoading] = useState(false);   // loading state
  const [formData, setFormData] = useState({   // form data
    title: gig.title,
    description: gig.description,
    budget: gig.budget,
  });
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {   // update gig
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/gigs/${gig._id}`, formData);
      toast.success("Gig updated successfully");
      onUpdate(data.gig);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {   // delete gig
    if (
      !confirm("Are you sure? All received bids will be permanently deleted.")
    )
      return;

    setLoading(true);
    try {
      await api.delete(`/gigs/${gig._id}`);
      toast.success("Gig deleted");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer h-9 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold gap-2"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit Gig
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50/80 border-b border-slate-100">
          <DialogTitle className="text-2xl font-bold text-brand">
            Modify Gig
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs uppercase tracking-widest font-semibold mt-1">
            Gig ID: {gig._id.slice(-6)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="p-6 space-y-5 pt-0">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-bold text-slate-700">
              Project Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-white border-slate-200 focus:ring-emerald-500 h-11 rounded-lg"
              placeholder="e.g. Modern UI/UX Designer for Fintech"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-sm font-bold text-slate-700"
            >
              Detailed Description
            </Label>
            <Textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white border-slate-200 focus:ring-emerald-500 rounded-lg resize-none p-3"
              placeholder="Describe the scope, requirements, and timeline..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="budget"
              className="text-sm font-bold text-slate-700"
            >
              Budget Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="pl-9 bg-white border-slate-200 focus:ring-emerald-500 h-11 rounded-lg font-bold"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold gap-2 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4" /> Delete Gig
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-6 flex-1 sm:flex-none shadow-lg shadow-emerald-950/10"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update Gig"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
