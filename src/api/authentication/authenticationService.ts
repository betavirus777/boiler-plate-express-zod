import { StatusCodes } from "http-status-codes";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/common/utils/jwtUtils";
import { IUser } from "../user/userModel";

export class AuthService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Handles user login
  async login(
    email: string,
    password: string
  ): Promise<
    ServiceResponse<{
      access_token: string;
      refresh_token: string;
      user: Partial<IUser>;
    } | null>
  > {
    try {
      const user = await this.userRepository.findByEmailAsync(email);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return ServiceResponse.failure(
          "Invalid credentials",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const access_token = await generateAccessToken({
        userId: user._id,
        role: user.role,
      });
      const refresh_token = await generateRefreshToken({
        userId: user._id,
        role: user.role,
      });

      return ServiceResponse.success("Login Successful", {
        access_token,
        refresh_token,
        user: { id: user._id, email: user.email },
      });
    } catch (ex) {
      const errorMessage = `Error logging in user with email ${email}: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while logging in.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Handles user registration
  async register(userData: Omit<Partial<IUser>, "_id">): Promise<
    ServiceResponse<{
      access_token: string;
      refresh_token: string;
      user: Partial<IUser>;
    } | null>
  > {
    try {
      const existingUser = await this.userRepository.findByEmailAsync(
        userData?.email as string
      );
      if (existingUser) {
        return ServiceResponse.failure(
          "User already exists",
          null,
          StatusCodes.CONFLICT
        );
      }

      const newUser = await this.userRepository.createAsync({
        ...userData,
      });

      const access_token = await generateAccessToken({
        userId: newUser._id,
        role: newUser.role,
      });
      const refresh_token = await generateRefreshToken({
        userId: newUser._id,
        role: newUser.role,
      });

      return ServiceResponse.success("Registeration Successful", {
        access_token,
        refresh_token,
        user: { id: newUser._id, email: newUser.email },
      });
    } catch (ex) {
      const errorMessage = `Error registering user with email ${
        userData.email
      }: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while registering user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const authService = new AuthService();
