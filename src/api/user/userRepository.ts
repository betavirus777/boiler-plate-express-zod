import { PaginateOptions, PaginateResult } from "mongoose";
import { Request } from "express";
import UserModel from "./userModel";
import type { IUser } from "@/api/user/userModel";
import { buildFilter, buildSearchQuery } from "@/common/utils/filterUtils";

export class UserRepository {
  async findAllAsync(req: Request): Promise<PaginateResult<IUser>> {
    let filters = req.body.filters || {};
    filters = buildFilter(filters);
    const searchQuery = req.query.search as string;
    if (searchQuery) {
      buildSearchQuery(searchQuery, filters, ["email", "full_name"]);
    }
    const sortField = req.query.sort
      ? (req.query.sort as string)
      : ("createdAt" as string);
    const sortOrder = req.query.order ? req.query.order : -1;
    const paginateOptions: PaginateOptions = {
      limit: req.query?.limit ? parseInt(req.query.limit as string, 10) : 50,
      page: req.query?.page ? parseInt(req.query.page as string, 10) : 1,
      lean: true,
      sort: { [sortField]: sortOrder },
    };
    console.log(paginateOptions, filters);
    const users = await UserModel.find();
    console.log(users);
    return await UserModel.paginate(filters, paginateOptions);
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
