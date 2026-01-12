import mongoose, { Types } from "mongoose";

export interface IBid extends mongoose.Document {
  gig: Types.ObjectId;
  freelancer: Types.ObjectId;
  amount: number;
  message: string;
  status: "pending" | "hired" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new mongoose.Schema<IBid>(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    message: { type: String, required:false },
    status: { type: String, enum: ["pending", "hired", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Bid = mongoose.model<IBid>("Bid", bidSchema);
export default Bid;
