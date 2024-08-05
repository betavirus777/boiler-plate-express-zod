// schemas/productSchema.ts
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ProductSchema = z.object({
  name: z.string().openapi({ example: "Laptop", description: "Product name" }),
  description: z.string().openapi({
    example: "A high-end laptop",
    description: "Product description",
  }),
  startingPrice: z
    .number()
    .openapi({ example: 1000, description: "Starting price for the product" }),
  category: z.string().openapi({
    example: "Electronics",
    description: "Category of the product",
  }),
});

export const CreateProductResponseSchema = ProductSchema.extend({
  _id: z.string().openapi({ example: "60d0fe4f5311236168a109ca" }),
  createdAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }),
  updatedAt: z.string().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});
