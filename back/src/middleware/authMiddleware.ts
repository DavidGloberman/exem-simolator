import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import userModel from "../models/userModel";
import ErrorWithStatusCode from "../utils/errorTypes";
import { Organization } from "../models/organizationModel";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send({ message: "Unauthorized, missing token" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const id = (decoded as JwtUser)._id;

  if (!decoded || !id) {
    res.status(401).send({ message: "Unauthorized" });
  }

  (req as any).user = decoded as JwtUser;

  next();
};

export const attackerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userModel
    .findById((req as any).user?._id)
    .populate("organizationId");
  if (!user) throw new Error("user not found in attacker middleware");

  if (!(user.organizationId as unknown as Organization).name.startsWith("IDF"))
    next();
  else next(new ErrorWithStatusCode("unauthorized! attackers only", 403));
};

export const defenderMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userModel
    .findById((req as any).user?._id)
    .populate("organizationId");
  if (!user) throw new Error("user not found in defender middleware");

  if ((user.organizationId as unknown as Organization).name.startsWith("IDF"))
    next();
  else next(new ErrorWithStatusCode("unauthorized! defenders only", 403));
};

interface JwtUser {
  _id: ObjectId;
  username: string;
  organization: string;
}
