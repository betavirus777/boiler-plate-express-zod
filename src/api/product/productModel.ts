import mongoose, { Document, Schema, model } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginateModel } from "../common/paginate";
import { EntityStatus } from "../common/common";

interface BasicEntity {
  type: string;
  value: string;
}
export interface IProduct {
  name: string;
  images: BasicEntity[];
  brandName: string;
  brandLink: string;
  model: string;
  reference: string;
  manufactureYear: string;
  material: string;
  dialColor: string;
  dimensions: string;
  movement: string;
  bracelet: string;
  crystalType: string;
  condition: string;
  serviceHistory: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

const BasicEntitySchema: Schema = new Schema({
  type: String,
  value: String,
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    images: [{ type: BasicEntitySchema }],
    brandName: { type: String, required: false },
    brandLink: { type: String, required: false },
    model: { type: String, required: true },
    reference: { type: String, required: false },
    manufactureYear: { type: String, required: false },
    material: { type: String, required: false },
    dialColor: { type: String, required: false },
    dimensions: { type: String, required: false },
    movement: { type: String, required: false },
    bracelet: { type: String, required: false },
    crystalType: { type: String, required: false },
    condition: { type: String, required: false },
    serviceHistory: { type: String, required: false },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(EntityStatus),
      required: true,
      default: EntityStatus.CREATED,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(aggregatePaginate);

interface IProductModel extends IProduct {}

interface ProductModel<T extends Document> extends IPaginateModel<T> {}

export const productModel = model<IProduct & Document>(
  "Product",
  ProductSchema,
  "Products"
) as ProductModel<IProductModel & Document>;

export { ProductModel, productModel as default };
