import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export const handleServiceResponse = (
  serviceResponse: ServiceResponse<any>,
  response: Response
) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequestBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      logger.info(err);
      err = err.issues.map((e: any) => ({
        path: e.path[0],
        message: e.message,
      }));
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };

export const validateRequestParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.params);
      schema.parse(req.params);
      next();
    } catch (err: any) {
      logger.info(err);
      err = err.issues.map((e: any) => ({
        path: e.path[0],
        message: e.message,
      }));
      return res.status(409).json({
        status: "failed",
        error: err,
      });
    }
  };
