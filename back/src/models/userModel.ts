import mongoose, { ObjectId, Schema } from "mongoose";
import { Resource, ResourceSchema } from "./organizationModel";

export interface Arsenal extends mongoose.Document {
  resources: Resource[];
  budget: number;
}

export const ArsenalSchema = new Schema<Arsenal>(
  {
    resources: [ResourceSchema],
    budget: Number,
  },
  { _id: false }
);

export interface IUser extends mongoose.Document {
  _id: ObjectId;
  username: string;
  password: string;
  organizationId: ObjectId;
  arsenal: Arsenal;
}

export const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    loadClass: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
  },
  organizationId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  arsenal: ArsenalSchema,
});

export default mongoose.model<IUser>("User", UserSchema)