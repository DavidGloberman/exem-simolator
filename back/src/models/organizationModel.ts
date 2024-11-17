import mongoose, { ObjectId, Schema } from "mongoose";

export interface Resource extends mongoose.Document {
  missileId: ObjectId;
  amount: number;
}

export const ResourceSchema = new Schema<Resource>(
  {
    missileId: { type: Schema.Types.ObjectId, ref: "Missile" },
    amount: { type: Number },
  },
  { _id: false }
);

export interface Organization extends mongoose.Document {
  _id: ObjectId;
  name: string;
  resources: Resource[];
  budget: number;
}

export const OrganizationSchema = new Schema<Organization>({
  name: { type: String, required: true, unique: true },
  resources: [ResourceSchema],
  budget: { type: Number, min: 0 },
});

export default mongoose.model<Organization>("Organization", OrganizationSchema);
