import mongoose, { Document, Schema } from "mongoose";

export interface IBorrowerProfile extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: "salaried" | "self_employed" | "unemployed";
  breStatus: "pending" | "passed" | "failed";
  breFailReasons: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BorrowerProfileSchema = new Schema<IBorrowerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true, uppercase: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: { type: String, enum: ["salaried", "self_employed", "unemployed"], required: true },
    breStatus: { type: String, enum: ["pending", "passed", "failed"], default: "pending" },
    breFailReasons: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrowerProfile>("BorrowerProfile", BorrowerProfileSchema);
