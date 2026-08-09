import mongoose, { Document, Schema } from "mongoose";
import { ALL_ROLES, Role, ROLES } from "../constants/roles";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ALL_ROLES, default: ROLES.BORROWER, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
