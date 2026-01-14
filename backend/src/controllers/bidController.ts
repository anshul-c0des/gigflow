import { Request, Response } from "express";
import Bid from "../models/Bid";
import Gig from "../models/Gig";
import { createBidSchema } from "../validators/bidValidator";
import { AuthUser } from "../types/auth";
import { emitToUser } from "../sockets";

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const createBid = async (req: AuthRequest, res: Response) => {   // create a bid
  try {
    const parsed = createBidSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const { gigId, amount, message } = parsed.data;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.owner.equals(req.user?.id))
      return res.status(403).json({ message: "Cannot bid on your own gig" });
    if (gig.status !== "open")
      return res.status(400).json({ message: "Gig is not open for bidding" });

    const existingBid = await Bid.findOne({
      gig: gigId,
      freelancer: req.user?.id,
    });
    if (existingBid)
      return res.status(409).json({ message: "You already bid on this gig" });

    const bid = await Bid.create({
      gig: gigId,
      freelancer: req.user?.id,
      amount,
      message,
      status: "pending",
    });

    emitToUser(gig.owner.toString(), "notification:new", {
      type: "new_bid",
      title: "New Bid Received",
      message: `A freelancer bid $${amount} on your gig "${gig.title}"`,
      gigId: gig._id,
    });

    const populatedBid = await bid.populate("freelancer", "name");

    emitToUser(gig.owner.toString(), "bid:created", populatedBid);

    res.status(201).json({ message: "Bid submitted", bid: populatedBid });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get all bids for a gig (owner only)
export const getBidsForGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (!gig.owner.equals(req.user?.id))
      return res.status(403).json({ message: "Unauthorized" });

    const bids = await Bid.find({ gig: req.params.gigId }).populate(
      "freelancer",
      "name email role"
    );

    res.status(200).json({ bids });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getMyBids = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const bids = await Bid.find({ freelancer: userId })
      .populate({
        path: "gig",
        select: "title status",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch your bids",
      error: error.message,
    });
  }
};
