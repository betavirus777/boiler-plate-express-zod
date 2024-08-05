import { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  LoginSchema,
  RegisterSchema,
  AuthResponseSchema,
} from "./authenticationValidator";
import { validateRequestBody } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authController } from "./authenticationController";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = Router();

// Register OpenAPI schemas
authRegistry.register("AuthResponse", AuthResponseSchema);

// Define and register paths
authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Authentication"],
  request: {
    body: {
      description: "User login details",
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
      required: true,
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Login successful"),
});

authRouter.post(
  "/login",
  validateRequestBody(LoginSchema),
  authController.login
);

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Authentication"],
  request: {
    body: {
      description: "User Registeration details",
      content: {
        "application/json": {
          schema: RegisterSchema,
        },
      },
      required: true,
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Registration successful"),
});

authRouter.post(
  "/register",
  validateRequestBody(RegisterSchema),
  authController.register
);

export default authRouter;
