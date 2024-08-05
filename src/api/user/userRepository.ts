import UserModel from "./userModel";
import type { IUser } from "@/api/user/userModel";

export class UserRepository {
  async findAllAsync(): Promise<IUser[]> {
    return await UserModel.find().lean().exec();
  }

  async findByIdAsync(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).lean().exec();
  }

  async findByEmailAsync(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async createAsync(userData: Partial<IUser>): Promise<IUser> {
    if (!userData.full_name) {
      userData.full_name = `${userData.first_name} ${userData.last_name}`;
    }
    if (!userData.display_name) {
      userData.display_name = userData.full_name;
    }
    return await UserModel.create(userData);
  }
}
