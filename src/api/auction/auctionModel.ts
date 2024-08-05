import mongoose, { Schema, Document } from "mongoose";

export interface IAuction extends Document {
  product: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  bids: mongoose.Types.ObjectId[];
  status: "active" | "closed";
}

const AuctionSchema: Schema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
  status: { type: String, enum: ["active", "closed"], required: true },
});

export const Auction = mongoose.model<IAuction>("Auction", AuctionSchema);
