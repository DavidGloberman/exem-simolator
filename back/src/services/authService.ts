import userModel, { IUser } from "../models/userModel";
import ErrorWithStatusCode from "../utils/errorTypes";
import bcrypt from "bcrypt";
import organizationModel from "../models/organizationModel";

const SALT_ROUNDS = 10;

export const addUser = async (user: any): Promise<IUser> => {
  if (!user || !user.username?.trim() || !user.password)
    throw new ErrorWithStatusCode("missing credentials", 400);

  if (!user.organization)
    throw new ErrorWithStatusCode("organization is required", 400);

  if (await userModel.findOne({ name: user.username }))
    throw new ErrorWithStatusCode("username already exist", 409);

  const org = await organizationModel.findOne({ name: user.organization });
  if (!org) throw new ErrorWithStatusCode("organization does not exist", 400);

  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  const added = await userModel.create({
    username: user.username,
    password: hashedPassword,
    organizationId: org?.id,
    arsenal: { budget: org?.budget, resources: org?.resources },
  });

  return added;
};

export const authenticate = async (userDTO: {
  username: string;
  password: string;
}): Promise<IUser | undefined> => {
  if (!userDTO || !userDTO.username?.trim() || !userDTO.password)
    throw new ErrorWithStatusCode("missing credentials", 400);

  const user: IUser | undefined | null = await userModel.findOne({
    username: userDTO.username,
  });

  if (!user || !(await bcrypt.compare(userDTO.password, user.password)))
    if (!user) throw new ErrorWithStatusCode("invalid credentials", 401);

  return user;
};
