import { Router } from "express";
import {
  createBid,
  getBidsForGig,
  getMyBids,
} from "../controllers/bidController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/my-bids", protect, getMyBids);   // gets my bids
router.post("/", protect, createBid);   // creates a new bid
router.get("/gig/:gigId", protect, getBidsForGig); // Owner-only: get all bids for a gig

export default router;
