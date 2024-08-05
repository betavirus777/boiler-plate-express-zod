import { z } from "zod";
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI methods
extendZodWithOpenApi(z);

// Define request schema for login
export const LoginSchema = z.object({
  content: z.object({

    email: z.string().email().openapi({
      description: "User's email address",
      example: "user@example.com",
    }),
    password: z.string().min(6).openapi({
      description: "User's password",
      example: "secretPassword123",
    }),
  }),
});

// Define request schema for registration
export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email().openapi({
      description: "User's email address",
      example: "user@example.com",
    }),
    password: z.string().min(6).openapi({
      description: "User's password",
      example: "secretPassword123",
    }),
    first_name: z.string().openapi({
      description: "User's first name",
      example: "John",
    }),
    last_name: z.string().openapi({
      description: "User's last name",
      example: "Doe",
    }),
    phone: z.string().openapi({
      description: "User's phone number with country code",
      example: "+917017881231",
    }),
    display_name: z.string().openapi({
      description: "User's display name",
      example: "themohitrao",
    }),
  }),
});

// Define response schema
export const AuthResponseSchema = z.object({
  access_token: z.string().openapi({
    description: "JWT token for authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  refresh_token: z.string().openapi({
    description: "JWT token for authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
  user: z.object({
    id: z.string().openapi({
      description: "User's ID",
      example: "60d0fe4f5311236168a109ca",
    }),
    email: z.string().email().openapi({
      description: "User's email address",
      example: "user@example.com",
    }),
  }),
});
