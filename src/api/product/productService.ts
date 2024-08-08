import ProductModel, { IProduct } from "./productModel";
import { Request } from "express";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { PaginateOptions, PaginateResult } from "mongoose";
import { buildFilter, buildSearchQuery } from "@/common/utils/filterUtils";

export class ProductService {
  public async createProduct(
    data: any
  ): Promise<ServiceResponse<IProduct | null>> {
    try {
      const product = new ProductModel(data);
      await product.save();
      return ServiceResponse.success(
        "Product created successfully",
        product,
        StatusCodes.CREATED
      );
    } catch (error: any) {
      logger.error(`Error creating product: ${error.message}`);
      return ServiceResponse.failure(
        "Error creating product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async updateProduct(
    id: string,
    data: any
  ): Promise<ServiceResponse<IProduct | null>> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedProduct) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<any>(
        "Product updated successfully",
        updatedProduct
      );
    } catch (error: any) {
      logger.error(`Error updating product with id ${id}: ${error.message}`);
      return ServiceResponse.failure(
        "Error updating product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async deleteProduct(
    id: string
  ): Promise<ServiceResponse<IProduct | null>> {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Product deleted successfully", null);
    } catch (error: any) {
      logger.error(`Error deleting product with id ${id}: ${error.message}`);
      return ServiceResponse.failure(
        "Error deleting product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async listProducts(
    req: Request
  ): Promise<ServiceResponse<PaginateResult<IProduct> | null>> {
    try {
      let filters = req.body.filters || {};
      filters = buildFilter(filters);
      const searchQuery = req.query.search as string;
      if (searchQuery) {
        buildSearchQuery(searchQuery, filters, ["name", "model"]);
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
      const products = await ProductModel.paginate(filters, paginateOptions);
      return ServiceResponse.success<PaginateResult<IProduct>>(
        "Products fetched successfully",
        products
      );
    } catch (error: any) {
      logger.error(`Error fetching products: ${error.message}`);
      return ServiceResponse.failure(
        "Error fetching products",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getProduct(
    id: string
  ): Promise<ServiceResponse<IProduct | null>> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        return ServiceResponse.failure(
          "Product not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success("Product fetched successfully", product);
    } catch (error: any) {
      logger.error(`Error deleting product with id ${id}: ${error.message}`);
      return ServiceResponse.failure(
        "Error getting product",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const productService = new ProductService();
