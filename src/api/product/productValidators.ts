import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

// BasicEntity Zod schema
export const BasicEntitySchema = z.object({
  type: z.string().openapi({
    description: "Type of the entity",
    example: "Image",
  }),
  value: z.string().openapi({
    description: "Value of the entity",
    example: "http://example.com/image.jpg",
  }),
});

// Product Zod schema
export const ProductSchema = z.object({
  name: z.string().openapi({
    description: "Product name",
    example: "Rolex Watch",
  }),
  images: z.array(BasicEntitySchema).openapi({
    description: "List of images with type and value",
  }),
  brandName: z.string().optional().openapi({
    description: "Brand name of the product",
    example: "Rolex",
  }),
  brandLink: z.string().optional().openapi({
    description: "Link to the brand's website",
    example: "http://rolex.com",
  }),
  model: z.string().openapi({
    description: "Model of the product",
    example: "Daytona",
  }),
  reference: z.string().optional().openapi({
    description: "Product reference number",
    example: "116500LN",
  }),
  manufactureYear: z.string().optional().openapi({
    description: "Year the product was manufactured",
    example: "2021",
  }),
  material: z.string().optional().openapi({
    description: "Material of the product",
    example: "Stainless Steel",
  }),
  dialColor: z.string().optional().openapi({
    description: "Color of the dial",
    example: "Black",
  }),
  dimensions: z.string().optional().openapi({
    description: "Dimensions of the product",
    example: "40mm",
  }),
  movement: z.string().optional().openapi({
    description: "Movement type",
    example: "Automatic",
  }),
  bracelet: z.string().optional().openapi({
    description: "Bracelet type",
    example: "Oyster",
  }),
  crystalType: z.string().optional().openapi({
    description: "Type of crystal",
    example: "Sapphire",
  }),
  condition: z.string().optional().openapi({
    description: "Condition of the product",
    example: "New",
  }),
  serviceHistory: z.string().optional().openapi({
    description: "Service history of the product",
    example: "Serviced in 2023",
  }),
  description: z.string().optional().openapi({
    description: "Detailed description of the product",
    example: "A brand new Rolex Daytona...",
  }),
  createdAt: z.string().optional().openapi({
    description: "Date the product was created",
    example: "2024-01-01T00:00:00.000Z",
  }),
  updatedAt: z.string().optional().openapi({
    description: "Date the product was last updated",
    example: "2024-01-01T00:00:00.000Z",
  }),
});

// Zod schema for create product response
export const CreateProductResponseSchema = ProductSchema.extend({
  _id: z.string().openapi({
    description: "Unique identifier for the product",
    example: "60d0fe4f5311236168a109ca",
  }),
});
