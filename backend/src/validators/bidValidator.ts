import { z } from "zod";

export const createBidSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  amount: z.number().min(1, "Bid amount must be greater than 0"),
  message: z.string().optional(),
});
