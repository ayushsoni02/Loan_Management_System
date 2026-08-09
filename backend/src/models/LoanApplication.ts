import mongoose, { Document, Schema } from "mongoose";
import { LoanStatus, LOAN_STATUS } from "../constants/loanStatus";

export interface ILoanApplication extends Document {
  borrower: mongoose.Types.ObjectId;
  borrowerProfile: mongoose.Types.ObjectId;
  salarySlipDocument?: mongoose.Types.ObjectId;
  
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;

  status: LoanStatus;
  rejectionReason?: string;

  sanctionedBy?: mongoose.Types.ObjectId;
  sanctionedAt?: Date;
  disbursedBy?: mongoose.Types.ObjectId;
  disbursedAt?: Date;
  closedAt?: Date;

  amountPaid: number;
  outstandingBalance: number;

  createdAt: Date;
  updatedAt: Date;
}

const LoanApplicationSchema = new Schema<ILoanApplication>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borrowerProfile: { type: Schema.Types.ObjectId, ref: "BorrowerProfile", required: true },
    salarySlipDocument: { type: Schema.Types.ObjectId, ref: "Document" },

    principal: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, required: true, default: 12 },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },

    status: { type: String, enum: Object.values(LOAN_STATUS), default: LOAN_STATUS.DRAFT, required: true },
    rejectionReason: { type: String },

    sanctionedBy: { type: Schema.Types.ObjectId, ref: "User" },
    sanctionedAt: { type: Date },
    disbursedBy: { type: Schema.Types.ObjectId, ref: "User" },
    disbursedAt: { type: Date },
    closedAt: { type: Date },

    amountPaid: { type: Number, default: 0 },
    outstandingBalance: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILoanApplication>("LoanApplication", LoanApplicationSchema);
