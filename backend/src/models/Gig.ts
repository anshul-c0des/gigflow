import mongoose, { Types } from "mongoose";

export interface IGig extends mongoose.Document {
  title: string;
  description: string;
  budget: string;
  owner: Types.ObjectId;
  status: "open" |  "assigned";
  hiredFreelancer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const gigSchema = new mongoose.Schema<IGig>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget:  {type: String, required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    status: { type: String, enum: ["open", "assigned"], default: "open" },
  },
  { timestamps: true }
);

gigSchema.index({ title: "text", description: "text" });

const Gig = mongoose.model<IGig>("Gig", gigSchema);
export default Gig;
