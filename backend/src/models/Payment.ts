import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  loanApplication: mongoose.Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    loanApplication: { type: Schema.Types.ObjectId, ref: "LoanApplication", required: true },
    utrNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
