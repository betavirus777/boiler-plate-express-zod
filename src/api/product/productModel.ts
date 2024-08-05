import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  startingPrice: number;
  images: string[];
  category: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
