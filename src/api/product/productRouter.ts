import express, { Router } from "express";
import {
  validateRequestBody,
  validateRequestParams,
} from "@/common/utils/httpHandlers";
import {
  ProductSchema,
  CreateProductResponseSchema,
} from "./productValidators";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { StatusCodes } from "http-status-codes";
import { productController } from "./productController";

export const productRegistry = new OpenAPIRegistry();
export const productRouter: Router = express.Router();

// Create a product
productRegistry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Product"],
  request: {
    body: {
      description: "Create product details",
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
  },
  responses: createApiResponse(
    CreateProductResponseSchema,
    "Create a Product",
    StatusCodes.CREATED
  ),
});

productRouter.post(
  "/",
  validateRequestBody(ProductSchema),
  productController.createProduct.bind(productController)
);

// Update a product
productRegistry.registerPath({
  method: "put",
  path: "/products/:id",
  tags: ["Product"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "60d0fe4f5311236168a109ca" }),
    }),
    body: {
      description: "Update the product",
      content: {
        "application/json": {
          schema: ProductSchema.partial(),
        },
      },
    },
  },
  responses: createApiResponse(ProductSchema, "Update a product"),
});

productRouter.put(
  "/:id",
  validateRequestBody(ProductSchema.partial()),
  productController.updateProduct.bind(productController)
);

// Delete a product
productRegistry.registerPath({
  method: "delete",
  path: "/products/:id",
  tags: ["Product"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "60d0fe4f5311236168a109ca" }),
    }),
  },
  responses: createApiResponse(ProductSchema, "Delete a product"),
});

productRouter.delete(
  "/:id",
  validateRequestParams(z.object({ id: z.string() })),
  productController.deleteProduct.bind(productController)
);

// List all products
productRegistry.registerPath({
  method: "get",
  path: "/products/list",
  tags: ["Product"],
  responses: createApiResponse(ProductSchema, "Get a product"),
});

productRouter.post(
  "/list",
  productController.listProducts.bind(productController)
);

// Delete a product
productRegistry.registerPath({
  method: "get",
  path: "/products/:id",
  tags: ["Product"],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "60d0fe4f5311236168a109ca" }),
    }),
  },
  responses: createApiResponse(ProductSchema, "Get a product"),
});

productRouter.get(
  "/:id",
  validateRequestParams(z.object({ id: z.string() })),
  productController.getProduct.bind(productController)
);
export default productRouter;
