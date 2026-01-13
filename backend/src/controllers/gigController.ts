import { Request, Response } from "express";
import Gig from "../models/Gig";
import { createGigSchema, updateGigSchema } from "../validators/gigValidator";
import { AuthUser } from "../types/auth";
import Bid from "../models/Bid";
import { emitToUser } from "../sockets";
import mongoose, { InferSchemaType, Types } from "mongoose";

interface AuthRequest extends Request {
    user?: AuthUser;
}
type BidType = InferSchemaType<typeof Bid.schema> & { _id: Types.ObjectId };

export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createGigSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const gig = await Gig.create({
      ...parsed.data,
      owner: req.user?.id,
      status: "open",
    });

    res.status(201).json({ message: "Gig created", gig });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getGigs = async (_req: Request, res: Response) => {
  try {
    const gigs = await Gig.find({ status: "open" })
    .populate("owner", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    count: gigs.length,
    gigs,
  });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getGigById = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.status(200).json({ gig });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const updateGig = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateGigSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    }

    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (!gig.owner.equals(req.user?.id)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(gig, parsed.data);
    await gig.save();

    res.status(200).json({ message: "Gig updated", gig });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (!gig.owner.equals(req.user?.id)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    await gig.deleteOne();
    res.status(200).json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const searchGigs = async (req: Request, res: Response) => {
  const q = (req.query.q as string)?.trim();

  if (!q) {
    return res.status(400).json({ message: "Search query required" });
  }

  let gigs = await Gig.find(
    {
      status: "open",
      $text: { $search: q },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("owner", "name")
    .lean();

  if (gigs.length === 0 && q.length >= 3) {
    gigs = await Gig.find({
      status: "open",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).populate("owner", "name").lean();
  }

  res.json({ results: gigs, count: gigs.length });
};


export const getGigDetails = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const gig = await Gig.findById(req.params.id).populate("owner", "name email").lean();
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    let bids: BidType[] = [];

    if (userId) {
      const isOwner = gig.owner._id.equals(userId);
    
      const filter: any = { gig };
    
      if (!isOwner) {
        filter.freelancer = userId;
      }
    
      bids = await Bid.find(filter)
        .populate("freelancer", "name email")
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json({ gig, bids });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching gig details" });
  }
};

export const hireFreelancer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { gigId } = req.params;
    const { bidId } = req.body;
    
    if (typeof gigId !== "string") {
      return res.status(400).json({ message: "Invalid Gig ID format" });
    }
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (!userId || !gig.owner.equals(userId)) {
      return res.status(403).json({
        message: "You are not authorized to hire for this gig",
      });
    }
  
    if (gig.status !== "open") {
      return res.status(400).json({
        message: "This gig is no longer open for hiring",
      });
    }
  
  const bid = await Bid.findById(bidId);
  if (!bid) {
    return res.status(404).json({ message: "Bid not found" });
  }
  
  if (!bid.gig.equals(gigId)) {
    return res.status(400).json({
      message: "This bid does not belong to this gig",
    });
  }
  
  gig.status = "assigned";
  gig.hiredFreelancer = bid.freelancer;
  await gig.save();
  
  bid.status = "hired";
  await bid.save();
  
  await Bid.updateMany(
    {
      gig: gigId,
      _id: { $ne: bidId },
    },
    {
      $set: { status: "rejected" },
    }
  );

  emitToUser(bid.freelancer.toString(), "notification:new", {
    type: "hired",
    title: "Hired!",
    message: `You have been hired for "${gig.title}"`,
    gigId: gig._id,
    bidId: bid._id,
    amount: bid.amount,
  });

  const otherBids = await Bid.find({ gig: gigId, _id: { $ne: bidId } });
    otherBids.forEach((otherBid) => {
      emitToUser(otherBid.freelancer.toString(), "notification:new", {
        type: "rejected",
        title: "Application Status",
        message: `The gig "${gig.title}" has been closed.`,
        gigId: gig._id,
      });
    });
  
  res.status(200).json({
    message: "Freelancer hired successfully",
    hiredFreelancer: bid.freelancer,
  });
} catch (error) {
  res.status(500).json({ message: "Server error during hiring process" });
}
};

export const getMyGigs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const gigs = await Gig.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "bids",
          localField: "_id",
          foreignField: "gig",
          as: "allBids",
        },
      },
      {
        $project: {
          title: 1,
          status: 1,
          budget: 1,
          createdAt: 1,
          bidCount: { $size: "$allBids" },
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};