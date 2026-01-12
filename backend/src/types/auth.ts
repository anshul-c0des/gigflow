import { Types } from "mongoose";

export interface AuthUser {
  id: Types.ObjectId;
  role: "owner" | "freelancer";
}
