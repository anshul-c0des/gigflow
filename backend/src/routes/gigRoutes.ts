import { Router } from "express";
import { createGig, getGigs, getGigById, updateGig, deleteGig, searchGigs, hireFreelancer, getGigDetails, getMyGigs } from "../controllers/gigController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Public
router.get("/search", searchGigs);
router.get("/my-gigs", protect, getMyGigs);

router.get("/", getGigs);

// Protected (owner only for create/update/delete)
router.get("/:id", protect, getGigDetails);
router.post("/", protect, createGig);
router.patch("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);
router.post("/:gigId/hire", protect, hireFreelancer);

export default router;
