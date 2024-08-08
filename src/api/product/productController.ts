import { Request, Response } from "express";
import { productService } from "@/api/product/productService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

export class ProductController {
  public async createProduct(req: Request, res: Response): Promise<void> {
    const serviceResponse = await productService.createProduct(req.body);
    handleServiceResponse(serviceResponse, res);
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const serviceResponse = await productService.updateProduct(id, req.body);
    handleServiceResponse(serviceResponse, res);
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const serviceResponse = await productService.deleteProduct(id);
    handleServiceResponse(serviceResponse, res);
  }

  public async listProducts(req: Request, res: Response): Promise<void> {
    const serviceResponse = await productService.listProducts(req);
    handleServiceResponse(serviceResponse, res);
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const serviceResponse = await productService.getProduct(id);
    handleServiceResponse(serviceResponse, res);
  }
}

export const productController = new ProductController();
