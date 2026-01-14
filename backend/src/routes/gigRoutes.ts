import { Router } from "express";
import {
  createGig,
  getGigs,
  updateGig,
  deleteGig,
  searchGigs,
  hireFreelancer,
  getGigDetails,
  getMyGigs,
} from "../controllers/gigController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Public
router.get("/search", searchGigs);   // search gigs by title or description
router.get("/my-gigs", protect, getMyGigs);   // get my gigs
router.get("/", getGigs);   // fetch all gigs

// Protected (owner only for create/update/delete)
router.get("/:id", protect, getGigDetails);   // fetch gig details
router.post("/", protect, createGig);   // creates a new gig
router.patch("/:id", protect, updateGig);   // update an existing gig
router.delete("/:id", protect, deleteGig);   // delete gig
router.post("/:gigId/hire", protect, hireFreelancer);   // hire a freelancer

export default router;
