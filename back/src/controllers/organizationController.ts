import asyncHandler from "../middleware/asyncHandler";
import { NextFunction, Request, Response } from "express";
import organizationModel from "../models/organizationModel";
import ErrorWithStatusCode from "../utils/errorTypes";

export const getAllNames = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allNames = (await organizationModel.find()).map((org) => org.name);
    res
      .status(200)
      .json({
        data: allNames,
        massage: "organizations names fetched successfully",
      });
  }
);

export const getById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const org = await organizationModel.findById(req.params.id);
    if (!org) throw new ErrorWithStatusCode("org not found", 404);
    res
      .status(200)
      .json({ data: org, massage: "organizations names fetched successfully" });
  }
);
