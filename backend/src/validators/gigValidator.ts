import { z } from "zod";

export const createGigSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 10 characters"),
  budget: z.string().min(1, "Budget is required"),
});

export const updateGigSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  budget: z.string().optional(),
  status: z.enum(["open", "assigned"]).optional(),
});
