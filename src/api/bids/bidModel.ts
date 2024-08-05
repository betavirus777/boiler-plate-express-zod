import mongoose, { Schema, Document } from "mongoose";

export interface IBid extends Document {
  auction: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  timestamp: Date;
  status: "pending" | "won" | "lost" | "outbid";
}

const BidSchema: Schema = new Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "won", "lost", "outbid"],
    required: true,
  },
});

export const Bid = mongoose.model<IBid>("Bid", BidSchema);
