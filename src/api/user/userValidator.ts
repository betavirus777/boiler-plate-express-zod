import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
// Define the Shipping Address schema
const ShippingAddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  postal_code: z.string(),
  state: z.string(),
});

// Define the User schema
export const UserSchema = z.object({
  _id: z.string().optional(), // Assuming UUID format for _id
  first_name: z.string(),
  last_name: z.string(),
  full_name: z.string().optional(),
  display_name: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  active_payment_method: z.string().nullable().optional(),
  shipping_address: ShippingAddressSchema.optional(),
  comments_access_token: z.string(),
  holds_required: z.boolean(),
  is_banned: z.boolean().optional().default(false),
  password: z.string().optional(), // Not required for all operations
});

// Define the User type inferred from the schema
export type User = z.infer<typeof UserSchema>;

// Define the schema for the ID parameter
export const GetUserSchema = z.object({
  id: z.string(), // Assuming the ID is a UUID string. Adjust if needed.
});

// Define the type for the validated request
export type GetUserParams = z.infer<typeof GetUserSchema>;
