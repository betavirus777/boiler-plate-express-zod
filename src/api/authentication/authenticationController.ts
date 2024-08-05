import type { Request, RequestHandler, Response } from "express";
import { AuthService } from "@/api/authentication/authenticationService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { LoginSchema } from "@/api/authentication/authenticationValidator";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Handles user login
  public login: RequestHandler = async (req: Request, res: Response) => {
    const parsedBody = LoginSchema.parse(req.body);
    const serviceResponse = await this.authService.login(
      parsedBody.email,
      parsedBody.password
    );
    return handleServiceResponse(serviceResponse, res);
  };

  // Handles user registration
  public register: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await this.authService.register(req.body);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
