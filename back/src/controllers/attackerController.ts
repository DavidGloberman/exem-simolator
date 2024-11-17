import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import AttackingMissileModel from "../models/attackingMissileModel";
import * as MissileService from "../services/missileService";

export const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req as any).user?._id;
    const attacks = await AttackingMissileModel.find({
      attackerId: id,
    }).populate("missileId");

    res
      .status(200)
      .json({ data: attacks, massage: "attacks fetched successfully" });
  }
);

export const attack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { destination, missileId } = req.body;
    const launched = await MissileService.attack({
      attackerId: (req as any).user?._id!,
      destination,
      attackerMissileTypeId: missileId,
    });
    res.status(201).json({ data: launched, massage: "launched" });
  }
);
