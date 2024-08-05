import type { Request, RequestHandler, Response } from "express";
import { AuthService } from "@/api/authentication/authenticationService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import {
  LoginSchema,
  RegisterSchema,
} from "@/api/authentication/authenticationValidator";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Handles user login
  public login: RequestHandler = async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.parse(req.body);
    const serviceResponse = await this.authService.login(
      parsedBody.content.email,
      parsedBody.content.password
    );
    return handleServiceResponse(serviceResponse, res);
  };

  // Handles user registration
  public register: RequestHandler = async (req: Request, res: Response) => {
    const parsedBody = RegisterSchema.parse(req.body); // Validate request body with Zod schema
    const serviceResponse = await this.authService.register(parsedBody.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
