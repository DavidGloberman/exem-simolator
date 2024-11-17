import mongoose, { ObjectId, Schema, Types } from "mongoose";

export interface Missile extends mongoose.Document {
  _id: ObjectId;
  name: string;
  description: string;
  speed: number;
  intercepts: ObjectId[];
  price: number;
}

export const MissileSchema = new Schema<Missile>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  speed: { type: Number, required: true },
  intercepts: { type: [Types.ObjectId], ref: "MIssile", default: [] },
  price: { type: Number, required: true, min: 0 },
});

export default mongoose.model<Missile>("Missile", MissileSchema);
