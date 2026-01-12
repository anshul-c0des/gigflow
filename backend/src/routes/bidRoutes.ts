import { Router } from "express";
import { createBid, getBidsForGig, getMyBids } from "../controllers/bidController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// GET /api/bids/my-bids
router.get("/my-bids", protect, getMyBids);

// Create bid (freelancer)
router.post("/", protect, createBid);

// Owner-only: get all bids for a gig
router.get("/gig/:gigId", protect, getBidsForGig);

export default router;
